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
    if (user) {
      setCurrentUser({
        user_id: user.user_id,
        name: user.name,
        role: user.role,
        is_online: true
      });
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
      if (!socket.isConnected) {
        throw new Error('Socket bağlantısı yok');
      }
      
      if (!currentUser) {
        throw new Error('Kullanıcı bilgisi bulunamadı');
      }
      
      console.log(`🏠 Chat katılımı başlatılıyor, targetUser: ${userId}`);
      
      setChatState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Socket ile chat odasına katıl
      const { chatId } = await socketService.joinChat(userId);
      
      // REST API ile mevcut mesajları getir
      const existingMessages = await chatAPI.getMessages(chatId);
      
      // State'i güncelle
      setCurrentChatId(chatId);
      setMessages(existingMessages);
      setChatState(prev => ({
        ...prev,
        currentChatId: chatId,
        messages: existingMessages,
        isLoading: false,
        isOpen: true
      }));
      
      console.log(`✅ Chat katılımı başarılı! ChatID: ${chatId}, ${existingMessages.length} mesaj yüklendi`);
      
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
      if (!currentChatId) {
        throw new Error('Aktif chat yok');
      }
      
      if (!content.trim()) {
        throw new Error('Mesaj içeriği boş olamaz');
      }
      
      if (!socket.isConnected) {
        throw new Error('Socket bağlantısı yok');
      }
      
      console.log(`💬 Mesaj gönderiliyor: "${content}"`);
      
      setMessageInput(prev => ({ ...prev, isSending: true, error: null }));
      
      // Socket ile mesaj gönder
      const sentMessage = await socketService.sendMessage(currentChatId, content.trim());
      
      console.log('✅ Mesaj başarıyla gönderildi:', sentMessage);
      
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
    if (!currentChatId || !socket.isConnected) return;
    
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
  const canSendMessage = Boolean(socket.isConnected && currentChatId && messageInput.isValid && !messageInput.isSending);
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
