import { useState, useEffect, useCallback, useRef } from 'react';
import socketService from '@/services/socketService';
import { SocketConnectionStatus, SocketError } from '@/types/socket';
import { authHelpers } from '@/utils/auth';

// ===============================================
// 🎯 useSocket Hook - Socket Bağlantı Yönetimi
// ===============================================

/**
 * 🔌 Socket bağlantısını React component lifecycle'ına entegre eden hook
 * 
 * Bu hook şunları yapar:
 * - Socket bağlantı durumunu state'te tutar
 * - Component mount/unmount'da otomatik bağlantı yönetir
 * - Authentication error'larını handle eder
 * - Reconnection mantığını yürütür
 * 
 * @param autoConnect - Component mount olduğunda otomatik bağlansın mı? (default: true)
 * @returns Socket connection state ve control fonksiyonları
 */
export const useSocket = (autoConnect: boolean = true) => {
  // ===============================================
  // 📊 STATE YÖNETİMİ
  // ===============================================
  
  // Bağlantı durumu - enum değerler kullanıyoruz
  const [connectionStatus, setConnectionStatus] = useState<SocketConnectionStatus>('disconnected');
  
  // Hata durumu - error olursa detayları burada
  const [error, setError] = useState<SocketError | null>(null);
  
  // Reconnection denemesi sayısı
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  // Son bağlantı zamanı (debug için)
  const [lastConnectedAt, setLastConnectedAt] = useState<Date | null>(null);
  
  // ===============================================
  // 📋 REF YÖNETİMİ
  // ===============================================
  
  // Reconnection timer'ını tutmak için ref
  const reconnectionTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Component unmount oldu mu kontrolü (memory leak önleme)
  const isMountedRef = useRef(true);
  
  // ===============================================
  // 🎯 CALLBACK FONKSİYONLARI
  // ===============================================
  
  /**
   * 🔗 Socket bağlantısını başlat
   * Bu fonksiyon button click vs. ile manuel çağrılabilir
   */
  const connect = useCallback(async () => {
    try {
      // Zaten bağlıysa veya bağlanmaya çalışıyorsa skip
      if (connectionStatus === 'connected' || connectionStatus === 'connecting') {
        console.log('🔄 Zaten bağlı veya bağlanıyor, skip...');
        return;
      }
      
      console.log('🔌 Socket bağlantısı başlatılıyor...');
      setConnectionStatus('connecting');
      setError(null);
      
      // Authentication kontrolü
      if (!authHelpers.isLoggedIn()) {
        throw new Error('Kullanıcı giriş yapmamış');
      }
      
      // Actual socket connection
      const socket = await socketService.connect();
      
      if (socket && isMountedRef.current) {
        setConnectionStatus('connected');
        setLastConnectedAt(new Date());
        setReconnectAttempts(0);
        console.log('✅ Socket bağlantısı başarılı');
      }
      
    } catch (err) {
      console.error('❌ Socket bağlantı hatası:', err);
      
      if (isMountedRef.current) {
        setConnectionStatus('error');
        setError({
          type: 'connection',
          message: err instanceof Error ? err.message : 'Bağlantı hatası',
          originalError: err
        });
      }
    }
  }, [connectionStatus]);
  
  /**
   * 📴 Socket bağlantısını kapat
   * Bu fonksiyon manuel veya component unmount'da çağrılır
   */
  const disconnect = useCallback(() => {
    console.log('📴 Socket bağlantısı kapatılıyor...');
    
    // Reconnection timer'ını temizle
    if (reconnectionTimerRef.current) {
      clearTimeout(reconnectionTimerRef.current);
      reconnectionTimerRef.current = null;
    }
    
    // Socket'i kapat
    socketService.disconnect();
    
    if (isMountedRef.current) {
      setConnectionStatus('disconnected');
      setError(null);
      setReconnectAttempts(0);
    }
  }, []);
  
  /**
   * 🔄 Otomatik reconnection mantığı
   * Bağlantı koptuğunda belirli süre sonra tekrar dener
   */
  const attemptReconnection = useCallback(() => {
    const maxAttempts = 5;
    const baseDelay = 1000; // 1 saniye
    
    if (reconnectAttempts >= maxAttempts) {
      console.warn('⚠️ Maksimum reconnection denemesi aşıldı');
      setConnectionStatus('error');
      setError({
        type: 'connection',
        message: `${maxAttempts} deneme sonrası bağlantı kurulamadı`
      });
      return;
    }
    
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s
    const delay = baseDelay * Math.pow(2, reconnectAttempts);
    
    console.log(`🔄 ${delay}ms sonra reconnection deneniyor... (${reconnectAttempts + 1}/${maxAttempts})`);
    
    reconnectionTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setReconnectAttempts(prev => prev + 1);
        connect();
      }
    }, delay);
  }, [reconnectAttempts, connect]);
  
  // ===============================================
  // 🎪 SOCKET EVENT LİSTENER'LAR
  // ===============================================
  
  useEffect(() => {
    console.log('🎪 Socket event listenerlar kuruluyor...');
    
    // ✅ Bağlantı başarılı olduğunda
    socketService.onConnection(() => {
      if (isMountedRef.current) {
        console.log('🎉 Socket onConnection event alındı');
        setConnectionStatus('connected');
        setError(null);
        setReconnectAttempts(0);
        setLastConnectedAt(new Date());
      }
    });
    
    // ❌ Bağlantı koptuğunda  
    socketService.onDisconnection((reason: string) => {
      if (isMountedRef.current) {
        console.log('💔 Socket onDisconnection event alındı:', reason);
        setConnectionStatus('disconnected');
        
        // Kullanıcı manuel kapattıysa reconnect yapma
        if (reason !== 'io client disconnect') {
          attemptReconnection();
        }
      }
    });
    
    // Cleanup function
    return () => {
      console.log('🧹 Socket event listenerlar temizleniyor...');
      // Not: socketService kendi cleanup'ını yapıyor
    };
  }, [attemptReconnection]);
  
  // ===============================================
  // 🚀 COMPONENT LIFECYCLE YÖNETİMİ
  // ===============================================
  
  // Component mount olduğunda otomatik bağlan
  useEffect(() => {
    if (autoConnect && authHelpers.isLoggedIn()) {
      console.log('🚀 Component mount oldu, otomatik bağlantı başlatılıyor...');
      connect();
    }
    
    // Component unmount cleanup
    return () => {
      console.log('👋 Component unmount oluyor, socket kapatılıyor...');
      isMountedRef.current = false;
      
      // Timer'ları temizle
      if (reconnectionTimerRef.current) {
        clearTimeout(reconnectionTimerRef.current);
      }
      
      // Socket'i kapat
      socketService.disconnect();
    };
  }, [autoConnect, connect]);
  
  // ===============================================
  // 🔍 COMPUTED VALUES (Türetilmiş değerler)
  // ===============================================
  
  // Basit boolean flag'ler (UI'da kullanım kolaylığı için)
  const isConnected = connectionStatus === 'connected';
  const isConnecting = connectionStatus === 'connecting';
  const isDisconnected = connectionStatus === 'disconnected';
  const hasError = connectionStatus === 'error' || error !== null;
  
  // ===============================================
  // 📤 HOOK API (Dönüş değerleri)
  // ===============================================
  
  return {
    // 📊 State bilgileri
    connectionStatus,
    isConnected,
    isConnecting, 
    isDisconnected,
    hasError,
    error,
    reconnectAttempts,
    lastConnectedAt,
    
    // 🎮 Control fonksiyonları
    connect,
    disconnect,
    
    // 🔍 Utility fonksiyonları
    getSocket: socketService.getSocket,  // Debug için socket instance'a erişim
    isLoggedIn: authHelpers.isLoggedIn   // Auth durum kontrolü
  };
};

// ===============================================
// 📋 TİP EXPORT'LARI
// ===============================================

// Hook'un return tipini export et (başka yerlerde kullanım için)
export type UseSocketReturn = ReturnType<typeof useSocket>;

// Default export
export default useSocket;
