import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from './useSocket';
import socketService from '@/services/socketService';
import { chatAPI } from '@/data/apiService';
import {
  SocketMessage,
  SocketUser,
  MessageSendPayload,
  TypingEvent,
  NotificationEvent,
  ChatUIState,
  MessageInputState
} from '@/types/socket';
import { userManager } from '@/utils/auth';
import { authHelpers } from '@/utils/auth';

// ===============================================
// 🎯 useChat Hook - Chat İşlemleri Yönetimi
// ===============================================

/**
 * 💬 Chat işlemlerini yöneten hook
 * 
 * Bu hook şunları yapar:
 * - useSocket hook'unu kompoze eder (bağlantı yönetimi)
 * - Chat odasına katılma/ayrılma işlemlerini yönetir
 * - Mesaj listesini state'te tutar ve real-time günceller
 * - Mesaj gönderme fonksiyonalitesi sağlar
 * - Typing göstergesi yönetir
 * - Bildirim sistemi entegrasyonu
 * 
 * @param targetUserId - Sohbet edilecek kullanıcının ID'si (opsiyonel, sonradan da set edilebilir)
 * @returns Chat state ve control fonksiyonları
 */
export const useChat = (targetUserId?: number) => {
  // ===============================================
  // 🔌 SOCKET BAĞLANTISI (Hook Kompozisyonu)
  // ===============================================
  
  // useSocket hook'unu kullan - bağlantı yönetimi için
  const socket = useSocket();
  
  // ===============================================
  // 📊 CHAT STATE YÖNETİMİ
  // ===============================================
  
  // Mevcut chat'in ID'si
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  
  // Mevcut chat'teki mesaj listesi
  const [messages, setMessages] = useState<SocketMessage[]>([]);
  
  // Chat UI durumu
  const [chatState, setChatState] = useState<ChatUIState>({
    isOpen: false,
    currentChatId: null,
    messages: [],
    isLoading: false,
    error: null,
    isTyping: false,
    typingUsers: []
  });
  
  // Mesaj input durumu
  const [messageInput, setMessageInput] = useState<MessageInputState>({
    content: '',
    isValid: false,
    isSending: false,
    error: null
  });
  
  // Typing timeout ref (typing göstergesi için)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Current user bilgisi
  const [currentUser, setCurrentUser] = useState<SocketUser | null>(null);
  
  // ===============================================
  // 👤 CURRENT USER YÖNETİMİ
  // ===============================================
  
  useEffect(() => {
    const user = userManager.getUser();
    console.log('🔍 useChat - User data from localStorage:', user);
    
    if (user) {
      // Backend'den gelen user objesi id field'ını user_id olarak kullanıyor
      const userId = user.user_id || user.id;
      
      if (!userId) {
        console.warn('⚠️ useChat - User ID bulunamadı:', user);
        return;
      }
      
      setCurrentUser({
        user_id: userId,
        name: user.name || user.email || 'Kullanıcı',
        role: user.role || 'CUSTOMER',
        is_online: true
      });
      
      console.log('✅ useChat - Current user set:', {
        user_id: userId,
        name: user.name || user.email || 'Kullanıcı',
        role: user.role || 'CUSTOMER'
      });
    } else {
      console.warn('⚠️ useChat - Kullanıcı bilgisi bulunamadı!');
    }
  }, []);

  
  // ===============================================
  // 🏠 CHAT ODASI YÖNETİMİ
  // ===============================================
  
  /**
   * 🏠 Chat odasına katıl
   * targetUserId ile 1-1 chat başlat veya mevcut chat'i aç
   */
  const joinChat = useCallback(async (userId: number) => {
    try {
      console.log(`🏠 Chat katılımı başlatılıyor, targetUser: ${userId}`);
      
      // Socket durumunu hem useSocket'ten hem de socketService'den kontrol et
      const socketHookConnected = socket.isConnected;
      const socketServiceConnected = socketService.getConnectionStatus();
      
      console.log('🔍 Socket durumu:', { 
        hookConnected: socketHookConnected,
        serviceConnected: socketServiceConnected,
        finalStatus: socketServiceConnected // socketService'i öncelikli al
      });
      console.log('🔍 Current user:', currentUser);
      
      if (!socketServiceConnected) {
        throw new Error('Socket bağlantısı yok - önce socket bağlantısını kurun');
      }
      
      if (!currentUser) {
        throw new Error('Kullanıcı bilgisi bulunamadı - giriş yapın');
      }
      
      setChatState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Socket ile chat odasına katıl
      console.log('📡 Socket service joinChat çağrılıyor...');
      let chatId;
      try {
        const joinResult = await socketService.joinChat(userId);
        chatId = joinResult.chatId;
        console.log('✅ Socket joinChat başarılı, chatId:', chatId);
      } catch (socketError) {
        console.error('❌ Socket joinChat hatası:', socketError);
        const errorMessage = socketError instanceof Error ? socketError.message : 'Bilinmeyen socket hatası';
        throw new Error(`Socket join hatası: ${errorMessage}`);
      }
      
      // REST API ile mevcut mesajları getir
      console.log('📄 Eski mesajlar getiriliyor...');
      const existingMessages = await chatAPI.getMessages(chatId);
      console.log('✅ Eski mesajlar alındı:', existingMessages?.length || 0, 'mesaj');
      
      // State'i güncelle
      setCurrentChatId(chatId);
      setMessages(existingMessages || []);
      setChatState(prev => ({
        ...prev,
        currentChatId: chatId,
        messages: existingMessages || [],
        isLoading: false,
        error: null
        // isOpen: true kaldırıldı - ChatWidget'ta manuel açılacak
      }));
      
      console.log(`✅ Chat katılımı başarılı! ChatID: ${chatId}, ${existingMessages?.length || 0} mesaj yüklendi`);
      console.log('🔍 State güncelleme sonrası:', {
        currentChatId: chatId,
        setCurrentChatIdCalled: true,
        messagesLength: existingMessages?.length || 0
      });
      
      return { chatId, messages: existingMessages };
      
    } catch (error) {
      console.error('❌ Chat katılımı başarısız:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Chat katılımı başarısız';
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      
      throw error;
    }
  }, [socket.isConnected, currentUser]);
  
  /**
   * 🚪 Chat odasından ayrıl
   */
  const leaveChat = useCallback(() => {
    console.log('🚪 Chat odasından ayrılıyor...');
    
    // State'i temizle
    setCurrentChatId(null);
    setMessages([]);
    setChatState(prev => ({
      ...prev,
      currentChatId: null,
      messages: [],
      isOpen: false,
      error: null,
      isTyping: false,
      typingUsers: []
    }));
    
    // Typing timeout'unu temizle
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, []);
  
  // ===============================================
  // 💬 MESAJ YÖNETİMİ
  // ===============================================
  
  /**
   * 💬 Mesaj gönder
   */
  const sendMessage = useCallback(async (content: string) => {
    try {
      console.log('🔍 sendMessage çağrıldı:', {
        content: content,
        currentChatId: currentChatId,
        hasCurrentChatId: !!currentChatId,
        socketConnected: socketServiceConnected
      });
      
      if (!currentChatId) {
        console.error('❌ currentChatId bulunamadı:', {
          currentChatId,
          chatStateCurrentChatId: chatState.currentChatId,
          isOpen: chatState.isOpen
        });
        throw new Error('Aktif chat yok');
      }
      
      if (!content.trim()) {
        throw new Error('Mesaj içeriği boş olamaz');
      }
      
      if (!socketServiceConnected) {
        console.warn('⚠️ Socket bağlantısı yok, ama mesaj yine de gönderiliyor (kullanıcı deneyimi için):', {
          socketServiceStatus: socketServiceConnected,
          hookSocketStatus: socket.isConnected
        });
        // Socket bağlantısı olmasa da mesaj göndermeye devam et
      }
      
      console.log(`💬 Mesaj gönderiliyor: "${content}"`);
      
      setMessageInput(prev => ({ ...prev, isSending: true, error: null }));
      
      // Optimistic update - mesajı hemen UI'ya ekle
      const optimisticMessage: SocketMessage = {
        message_id: Date.now(), // Temporary ID
        chat_id: currentChatId,
        content: content.trim(),
        sender_id: currentUser?.user_id || 0,
        sender: currentUser || { user_id: 0, name: 'Ben', role: 'CUSTOMER', is_online: true },
        created_at: new Date().toISOString(),
        status: 'SEND' as const
      };
      
      // Mesajı hemen UI'ya ekle
      setMessages(prev => {
        const currentMessages = Array.isArray(prev) ? prev : [];
        const newMessages = [...currentMessages, optimisticMessage];
        console.log('📱 Optimistic mesaj eklendi, toplam mesaj sayısı:', newMessages.length);
        return newMessages;
      });
      
      // Socket ile mesaj gönder (arka planda)
      let sentMessage;
      try {
        sentMessage = await socketService.sendMessage(currentChatId, content.trim());
        console.log('✅ Mesaj başarıyla gönderildi:', sentMessage);
      } catch (socketError) {
        console.warn('⚠️ Socket ile mesaj gönderilemedi, ama UI\'da görünüyor:', socketError);
        // Socket hatası olsa da mesaj UI'da kalır
      }
      
      setMessageInput(prev => ({
        ...prev,
        content: '',
        isSending: false,
        isValid: false
      }));
      
      return sentMessage;
      
    } catch (error) {
      console.error('❌ Mesaj gönderme başarısız:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Mesaj gönderilemedi';
      setMessageInput(prev => ({
        ...prev,
        isSending: false,
        error: errorMessage
      }));
      
      throw error;
    }
  }, [currentChatId, socket.isConnected]);
  
  /**
   * ⌨️ Yazıyor göstergesi gönder
   */
  const sendTypingIndicator = useCallback((typing: boolean) => {
    if (!currentChatId || !socketServiceConnected) return;
    
    console.log(`⌨️ Typing göstergesi: ${typing}`);
    socketService.sendTypingIndicator(currentChatId, typing);
    
    // Eğer yazıyor durumuna geçtiyse, 3 saniye sonra otomatik durdur
    if (typing) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        socketService.sendTypingIndicator(currentChatId!, false);
      }, 3000);
    }
  }, [currentChatId, socket.isConnected]);
  
  /**
   * 📝 Mesaj input content'ini güncelle
   */
  const updateMessageContent = useCallback((content: string) => {
    const isValid = content.trim().length > 0;
    
    setMessageInput(prev => ({
      ...prev,
      content,
      isValid,
      error: null
    }));
    
    // Typing göstergesi logic
    if (content.length > 0) {
      sendTypingIndicator(true);
    } else {
      sendTypingIndicator(false);
    }
  }, [sendTypingIndicator]);
  
  // ===============================================
  // 📥 REAL-TIME EVENT HANDLER'LAR
  // ===============================================
  
  useEffect(() => {
    if (!socket.isConnected) return;
    
    console.log('📥 Chat real-time event listenerlar kuruluyor...');
    
    // 📩 Yeni mesaj geldiğinde
    socketService.onNewMessage((messageData: SocketMessage) => {
      console.log('📩 Yeni mesaj event alındı:', messageData);
      
      // Sadece mevcut chat'e ait mesajları ekle
      if (messageData.chat_id === currentChatId) {
        setMessages(prev => {
          // Duplicate mesaj kontrolü (mesaj ID'si ile)
          const exists = prev.some(msg => msg.message_id === messageData.message_id);
          if (exists) return prev;
          
          // Yeni mesajı ekle (tarih sırasına göre)
          return [...prev, messageData].sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        });
        
        setChatState(prev => ({
          ...prev,
          messages: prev.messages  // Bu otomatik olarak useEffect ile sync olacak
        }));
      }
    });
    
    // ⌨️ Yazıyor göstergesi geldiğinde
    socketService.onTypingIndicator((typingData: TypingEvent) => {
      console.log('⌨️ Typing event alındı:', typingData);
      
      // Sadece mevcut chat'te typing göster
      if (typingData.chatId === currentChatId) {
        setChatState(prev => {
          let newTypingUsers = [...prev.typingUsers];
          
          if (typingData.typing) {
            // Typing listesine ekle (duplicate önleme)
            if (!newTypingUsers.some(user => user.user_id === typingData.userId)) {
              newTypingUsers.push({
                user_id: typingData.userId,
                name: typingData.userName || 'Kullanıcı',
                role: 'CUSTOMER' // Default rol
              });
            }
          } else {
            // Typing listesinden çıkar
            newTypingUsers = newTypingUsers.filter(user => user.user_id !== typingData.userId);
          }
          
          return {
            ...prev,
            typingUsers: newTypingUsers,
            isTyping: newTypingUsers.length > 0
          };
        });
      }
    });
    
    // 🔔 Bildirim geldiğinde
    socketService.onNotification((notification: NotificationEvent) => {
      console.log('🔔 Notification event alındı:', notification);
      
      // UI'da bildirim gösterme logic'i buraya eklenebilir
      // Örneğin: toast notification, browser notification, vs.
    });
    
    // Cleanup function
    return () => {
      console.log('🧹 Chat event listenerlar temizleniyor...');
      socketService.removeAllListeners();
    };
  }, [socket.isConnected, currentChatId]);
  
  // ===============================================
  // 🔄 MESSAGES STATE SYNC
  // ===============================================
  
  // messages state'i ile chatState.messages'ı sync tut
  useEffect(() => {
    setChatState(prev => ({
      ...prev,
      messages: messages
    }));
  }, [messages]);
  
  // ===============================================
  // 🚀 AUTO-JOIN LOGIC
  // ===============================================
  
  // targetUserId prop'u değiştiğinde otomatik chat'e katıl
  useEffect(() => {
    if (targetUserId && socket.isConnected && currentUser) {
      console.log(`🚀 targetUserId prop değişti: ${targetUserId}, otomatik chat katılımı başlatılıyor...`);
      joinChat(targetUserId);
    }
  }, [targetUserId, socket.isConnected, currentUser, joinChat]);

  // 🔌 Socket bağlantısını manuel başlat
  useEffect(() => {
    const initSocket = async () => {
      if (authHelpers.isLoggedIn() && !socket.isConnected && !socket.isConnecting) {
        console.log('🔌 Manual socket bağlantısı başlatılıyor...');
        try {
          await socket.connect();
        } catch (error) {
          console.error('❌ Socket bağlantısı başarısız:', error);
        }
      }
    };

    initSocket();
  }, [socket.isConnected, socket.isConnecting, socket.connect]);
  
  // ===============================================
  // 🔍 COMPUTED VALUES
  // ===============================================
  
  const hasMessages = messages.length > 0;
  
  // Socket durumunu socketService'den kontrol et (daha güvenilir)
  const socketServiceConnected = socketService.getConnectionStatus();
  
  // canSendMessage - tüm gereksinimleri kontrol et
  const canSendMessage = Boolean(
    socketServiceConnected &&          // Socket bağlı olmalı
    currentChatId &&                   // Chat ID'si olmalı  
    messageInput.content.trim().length > 0 &&  // İçerik olmalı
    !messageInput.isSending &&         // Gönderim işlemi devam etmemeli
    !chatState.isLoading               // Chat yükleniyor olmamalı
  );
  
  // Debug için canSendMessage durumunu logla (sadece önemli değişikliklerde)
  useEffect(() => {
    console.log('🔍 canSendMessage durumu:', {
      socketServiceConnected,
      currentChatId,
      hasContent: messageInput.content.trim().length > 0,
      isSending: messageInput.isSending,
      isLoading: chatState.isLoading,
      finalCanSend: canSendMessage
    });
  }, [socketServiceConnected, currentChatId, messageInput.content, messageInput.isSending, chatState.isLoading, canSendMessage]);
  
  const isTypingDisplayText = chatState.typingUsers.length > 0 
    ? `${chatState.typingUsers.map(u => u.name).join(', ')} yazıyor...`
    : '';
  
  // ===============================================
  // 📤 HOOK API (Return değerleri)
  // ===============================================
  
  return {
    // 🔌 Socket state (useSocket'ten gelen)
    ...socket,
    
    // 💬 Chat state
    currentChatId,
    messages,
    chatState,
    messageInput,
    currentUser,
    
    // 🎮 Chat control fonksiyonları
    joinChat,
    leaveChat,
    sendMessage,
    sendTypingIndicator,
    updateMessageContent,
    
    // 🔍 Computed values
    hasMessages,
    canSendMessage,
    isTypingDisplayText,
    
    // 🎯 Utility fonksiyonları
    clearChatError: () => setChatState(prev => ({ ...prev, error: null })),
    toggleChatWindow: () => setChatState(prev => ({ ...prev, isOpen: !prev.isOpen })),
    closeChatWindow: () => setChatState(prev => ({ ...prev, isOpen: false })),
    openChatWindow: () => setChatState(prev => ({ ...prev, isOpen: true })),
    
    // 🔌 Socket bağlantı fonksiyonları
    connect: socket.connect,
    disconnect: socket.disconnect
  };
};

// ===============================================
// 📋 TİP EXPORT'LARI
// ===============================================

export type UseChatReturn = ReturnType<typeof useChat>;

export default useChat;
