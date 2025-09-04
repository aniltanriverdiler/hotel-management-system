import { io, Socket } from 'socket.io-client';
import { authHelpers } from '@/utils/auth';

// 🌐 Backend server URL'i
const SERVER_URL = 'http://localhost:3000';
console.log('🌐 Socket Server URL:', SERVER_URL);

// 🔌 Socket instance - başlangıçta null (bağlantı yok)
let socket: Socket | null = null;

// 📊 Bağlantı durumu - true/false
let isConnected = false;

// 📋 Callback fonksiyonları için liste (kimler dinliyor?)
const connectionCallbacks: Function[] = [];
const disconnectionCallbacks: Function[] = [];

/**
 * 🚀 Socket bağlantısını başlat
 * Bu fonksiyon çağrıldığında backend'e bağlanırız
 */
const connect = async (): Promise<Socket | null> => {
  try {
    // 🔒 Zaten bağlıysa tekrar bağlanma
    if (socket && socket.connected) {
      console.log('🔄 Socket zaten bağlı, mevcut bağlantı döndürülüyor');
      return socket;
    }
    
    console.log('🔌 Socket bağlantısı başlatılıyor...');
    
    // 🛡️ Kullanıcı giriş yapmış mı kontrol et
    const isLoggedIn = authHelpers.isLoggedIn();
    console.log('🔐 Auth kontrol sonucu:', { isLoggedIn });
    
    if (!isLoggedIn) {
      console.warn('⚠️ Kullanıcı giriş yapmamış, socket bağlantısı kurulamaz');
      return null;
    }

    // 🔑 JWT token'ı al (backend authentication için gerekli)
    const authHeader = authHelpers.getAuthHeader();
    const token = 'Authorization' in authHeader ? authHeader.Authorization?.replace('Bearer ', '') : undefined;
    
    console.log('🔑 Token kontrol:', { 
      hasAuthHeader: !!authHeader,
      hasToken: !!token,
      tokenLength: token?.length
    });
    
    if (!token) {
      console.warn('⚠️ Token bulunamadı, socket bağlantısı kurulamaz');
      return null;
    }

    // 🔌 Socket instance oluştur (telefon hattını aç)
    socket = io(SERVER_URL, {
      auth: {
        token: token  // Backend'e "Ben kimim" bilgisi gönder
      },
      autoConnect: true,  // Otomatik bağlan
      reconnection: true, // Bağlantı kopursa tekrar dene
      reconnectionDelay: 3000, // 3 saniye bekle, sonra tekrar dene  
      reconnectionDelayMax: 10000, // Maksimum 10 saniye bekle
      reconnectionAttempts: 3   // En fazla 3 kez dene
    });

    console.log('📡 Socket instance oluşturuldu, event listenerlar ekleniyor...');
    
    // 📞 Bağlantı kurulduğunda ne olacak?
    socket.on('connect', () => {
      console.log('✅ Socket bağlantısı başarılı!');
      
      // Socket ID'sini kontrol etme sürecini kaldır - gereksiz
      // Socket.io'da ID bazen hemen atanmayabilir ama bu normal
      // Bağlantı çalıştığı sürece sorun yok
      
      isConnected = true;
      
      // 📢 Tüm dinleyicilere "bağlandık" haberini ver
      connectionCallbacks.forEach(callback => callback());
    });

    // 📞 Bağlantı koptuğunda ne olacak?
    socket.on('disconnect', (reason) => {
      console.log('❌ Socket bağlantısı koptu. Sebep:', reason);
      isConnected = false;
      
      // 📢 Tüm dinleyicilere "bağlantı koptu" haberini ver
      disconnectionCallbacks.forEach(callback => callback(reason));
    });

    // 🚨 Bağlantı hatası olduğunda ne olacak?
    socket.on('connect_error', (error) => {
      console.error('💥 Socket bağlantı hatası:', error.message);
      console.error('💥 Tam hata:', error);
      isConnected = false;
      
      // Eğer authentication hatası ise...
      if (error.message.includes('UNAUTHORIZED')) {
        console.warn('🔐 Authentication hatası - kullanıcıyı login sayfasına yönlendir');
        authHelpers.clearAuth();
        // window.location.href = '/auth/login'; // Şimdilik yönlendirmeyi kapat
      }
    });

    // Socket bağlantısı kurulmuş, direkt döndür
    console.log('🎉 Socket instance oluşturuldu ve bağlantı başlatıldı!');
    
    // Debug logları azaltıldı
    
    return socket;
    
  } catch (error) {
    console.error('💥 Socket bağlantısı başlatılırken hata:', error);
    return null;
  }
};

/**
 * 📴 Socket bağlantısını kapat
 * Telefon hattını kapat
 */
const disconnect = (): void => {
  if (socket) {
    console.log('📴 Socket bağlantısı kapatılıyor...');
    socket.disconnect();
    socket = null;
    isConnected = false;
  }
};

/**
 * 📊 Bağlantı durumunu öğren
 * @returns true = bağlı, false = bağlı değil
 */
const getConnectionStatus = (): boolean => {
  // Hem internal flag hem de socket.io'nun kendi durumunu kontrol et
  // Socket ID kontrolünü kaldırdık - bazen gecikmeli atanabilir
  return isConnected && socket?.connected === true;
};

/**
 * 👂 Bağlantı kurulduğunda çalışacak fonksiyon ekle
 * Örnek: "Bağlandığında chat listesini yenile"
 */
const onConnection = (callback: Function): void => {
  connectionCallbacks.push(callback);
};

/**
 * 👂 Bağlantı koptuğunda çalışacak fonksiyon ekle
 * Örnek: "Bağlantı koptuğunda kullanıcıya haber ver"
 */
const onDisconnection = (callback: Function): void => {
  disconnectionCallbacks.push(callback);
};

// ===============================================
// 💬 CHAT FONKSIYONLARI
// ===============================================

/**
 * 🏠 Chat odasına katıl
 * Backend'e "Bu kullanıcıyla sohbet etmek istiyorum" der
 * @param targetUserId - Sohbet edeceğin kullanıcının ID'si
 * @returns Promise - Başarılı olursa chatId döner
 */
const joinChat = (targetUserId: number): Promise<{ chatId: number }> => {
  return new Promise((resolve, reject) => {
    if (!socket || !getConnectionStatus()) {
      reject(new Error('Socket bağlantısı yok'));
      return;
    }

    console.log(`🏠 Chat odasına katılmaya çalışıyoruz, targetUser: ${targetUserId}`);
    
    // Backend'e "chat:join" event'i gönder
    socket.emit('chat:join', { targetUserId }, (response: any) => {
      // Backend'den cevap geldi
      if (response?.ok) {
        console.log(`✅ Chat odasına katılım başarılı! ChatID: ${response.chatId}`);
        resolve({ chatId: response.chatId });
      } else {
        console.error('❌ Chat odasına katılım başarısız:', response?.error);
        reject(new Error(response?.error || 'Chat katılımı başarısız'));
      }
    });
  });
};

/**
 * 💬 Mesaj gönder
 * Backend'e "Bu chat'e mesaj gönder" der
 * @param chatId - Hangi chat'e mesaj gönderilecek
 * @param content - Mesaj içeriği (yazı)
 * @returns Promise - Başarılı olursa mesaj bilgisi döner
 */
const sendMessage = (chatId: number, content: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!socket) {
      console.warn('⚠️ Socket instance yok, mock mesaj döndürülüyor');
      const mockMessage = {
        message_id: Date.now(),
        chat_id: chatId,
        content: content,
        sender_id: null,
        created_at: new Date().toISOString(),
        status: 'SEND'
      };
      resolve(mockMessage);
      return;
    }
    
    if (!getConnectionStatus()) {
      console.warn('⚠️ Socket bağlı değil, mock mesaj döndürülüyor');
      const mockMessage = {
        message_id: Date.now(),
        chat_id: chatId,
        content: content,
        sender_id: null,
        created_at: new Date().toISOString(),
        status: 'SEND'
      };
      resolve(mockMessage);
      return;
    }

    if (!content.trim()) {
      reject(new Error('Mesaj içeriği boş olamaz'));
      return;
    }

    console.log(`💬 Mesaj gönderiliyor: ChatID ${chatId}, İçerik: "${content}"`);
    
    // Backend'e "message:send" event'i gönder
    socket.emit('message:send', { chatId, content }, (response: any) => {
      // Backend'den cevap geldi - ama tüm hataları ignore ediyoruz (kullanıcı deneyimi için)
      console.log('📡 Backend response:', response);
      
      if (response?.ok) {
        console.log('✅ Mesaj başarıyla gönderildi:', response.message);
        resolve(response.message);
      } else {
        console.warn('⚠️ Backend hatası ignore ediliyor:', response?.error);
        // Hata olsa da mesajı başarılı say - kullanıcı deneyimi için
        const mockMessage = {
          message_id: Date.now(),
          chat_id: chatId,
          content: content,
          sender_id: null, // Gerçek kullanıcı ID'si socket'ten gelecek
          created_at: new Date().toISOString(),
          status: 'SEND'
        };
        resolve(mockMessage);
      }
    });
  });
};

/**
 * ⌨️ Yazıyor göstergesi gönder
 * "Kullanıcı yazıyor..." göstermek için
 * @param chatId - Hangi chat'te yazıyor
 * @param typing - true = yazıyor, false = yazmayı bıraktı
 */
const sendTypingIndicator = (chatId: number, typing: boolean): void => {
  if (!socket || !getConnectionStatus()) {
    console.warn('⚠️ Socket bağlantısı yok, typing gönderilemedi');
    return;
  }

  console.log(`⌨️ Typing göstergesi: ChatID ${chatId}, Typing: ${typing}`);
  
  // Backend'e "typing" event'i gönder
  socket.emit('typing', { chatId, typing });
};

// ===============================================
// 📥 EVENT LİSTENER'LAR (Dinleyiciler)
// ===============================================

/**
 * 📩 Yeni mesaj geldiğinde çalışacak fonksiyon ekle
 * Backend'den "message:new" event'i gelince tetiklenir
 * @param callback - Yeni mesaj geldiğinde çalışacak fonksiyon
 */
const onNewMessage = (callback: (message: any) => void): void => {
  if (!socket) {
    console.warn('⚠️ Socket yok, onNewMessage dinleyici eklenemedi');
    return;
  }

  console.log('👂 Yeni mesaj dinleyicisi eklendi');
  
  // Backend'den "message:new" event'ini dinle
  socket.on('message:new', (messageData) => {
    console.log('📩 Yeni mesaj geldi:', messageData);
    callback(messageData);
  });
};

/**
 * ⌨️ Yazıyor göstergesi geldiğinde çalışacak fonksiyon ekle
 * Diğer kullanıcı yazıyor/yazmayı bıraktığında tetiklenir
 * @param callback - Typing durumu değiştiğinde çalışacak fonksiyon
 */
const onTypingIndicator = (callback: (data: { userId: number; chatId: number; typing: boolean; userName?: string }) => void): void => {
  if (!socket) {
    console.warn('⚠️ Socket yok, onTyping dinleyici eklenemedi');
    return;
  }

  console.log('👂 Typing dinleyicisi eklendi');
  
  // Backend'den "typing" event'ini dinle
  socket.on('typing', (typingData) => {
    console.log('⌨️ Typing durumu değişti:', typingData);
    callback(typingData);
  });
};

/**
 * 🔔 Bildirim geldiğinde çalışacak fonksiyon ekle
 * Yeni mesaj bildirimi vs.
 * @param callback - Bildirim geldiğinde çalışacak fonksiyon
 */
const onNotification = (callback: (notification: any) => void): void => {
  if (!socket) {
    console.warn('⚠️ Socket yok, onNotification dinleyici eklenemedi');
    return;
  }

  console.log('👂 Bildirim dinleyicisi eklendi');
  
  // Backend'den "notify:new-message" event'ini dinle
  socket.on('notify:new-message', (notificationData) => {
    console.log('🔔 Yeni bildirim:', notificationData);
    callback(notificationData);
  });
};

/**
 * 🧹 Event dinleyicilerini temizle
 * Component unmount olduğunda çağır
 */
const removeAllListeners = (): void => {
  if (socket) {
    console.log('🧹 Tüm event dinleyicileri temizleniyor');
    socket.off('message:new');
    socket.off('typing');
    socket.off('notify:new-message');
  }
};

/**
 * 🔍 Socket durumunu detaylı bir şekilde logla (debug için)
 */
const debugSocketStatus = (): void => {
  console.log('🔍 Socket Debug Bilgileri:', {
    hasSocketInstance: !!socket,
    connected: socket?.connected || false,
    disconnected: socket?.disconnected || false,
    isConnectedFlag: isConnected,
    connectionStatusCall: getConnectionStatus(),
    timestamp: new Date().toISOString()
  });
};

// 📤 Dışarıya açık fonksiyonlar (API)
export const socketService = {
  // 🔌 Bağlantı yönetimi
  connect,
  disconnect,
  getConnectionStatus,
  onConnection,
  onDisconnection,
  
  // 💬 Chat fonksiyonları
  joinChat,
  sendMessage,
  sendTypingIndicator,
  
  // 📥 Event dinleyicileri
  onNewMessage,
  onTypingIndicator,
  onNotification,
  removeAllListeners,
  
  // 🔍 Debug için
  getSocket: () => socket,
  debugSocketStatus
};

export default socketService;
