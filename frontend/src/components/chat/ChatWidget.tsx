"use client";

import { useState, useEffect } from 'react';
import ChatButton from '@/components/chat/ChatButton';
import ChatWindow from '@/components/chat/ChatWindow';
import { useChat } from '@/hooks/useChat';
import { authHelpers, userManager } from '@/utils/auth';
import socketService from '@/services/socketService';

export default function ChatWidget() {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // 🎯 Chat hook - Socket ve chat işlemleri için (targetUserId yok - sadece socket bağlantısı)
  const chat = useChat();
  
  // 👤 Kullanıcı giriş yapmış mı kontrol
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔐 Authentication kontrolü
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = authHelpers.isLoggedIn();
      const userData = userManager.getUser();
      const authHeader = authHelpers.getAuthHeader();
      
      setIsLoggedIn(loggedIn);
      
      console.log('🔍 ChatWidget Auth kontrol:', { 
        loggedIn, 
        hasToken: !!(authHeader as any).Authorization,
        hasUserData: !!userData,
        userDataKeys: userData ? Object.keys(userData) : []
      });
      
      if (!loggedIn) {
        console.warn('⚠️ ChatWidget - Kullanıcı giriş yapmamış veya eksik data');
      }
    };
    
    checkAuth();
    
    // Auth durumu değişebilir, periyodik kontrol
    const authInterval = setInterval(checkAuth, 5000);
    
    return () => clearInterval(authInterval);
  }, []);

  // 🔌 Socket bağlantısını manuel başlat
  useEffect(() => {
    if (isLoggedIn && !chat.isConnected && !chat.isConnecting) {
      console.log('🔌 Manuel socket bağlantısı başlatılıyor...');
      chat.connect?.(); // Eğer connect fonksiyonu varsa çağır
    }
  }, [isLoggedIn, chat.isConnected, chat.isConnecting]);

  // 💡 Tooltip gösterme logic'i
  useEffect(() => {
    // Sadece giriş yapmış kullanıcılara tooltip göster
    if (!isLoggedIn) return;
    
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000); // 3 saniye sonra tooltip beliriyor

    // 10 saniye sonra tooltip'i gizle
    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 13000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [isLoggedIn]);

  // 🎯 Support chat başlatma fonksiyonu
  const startSupportChat = async () => {
    try {
      console.log('🎯 Support chat başlatılıyor...');
      
      // Önce chat penceresini aç ki kullanıcı beklerken görebilsin
      console.log('📖 Chat penceresi açılıyor (loading durumunda)...');
      chat.openChatWindow();
      
      // Socket bağlantısı kontrolü ve bağlanma
      const isConnected = socketService.getConnectionStatus();
      console.log('🔍 Socket durumu:', isConnected);
      
      if (!isConnected) {
        console.log('🔌 Socket bağlı değil, bağlanıyoruz...');
        try {
          const socket = await socketService.connect();
          if (!socket) {
            console.error('❌ Socket bağlantısı kurulamadı');
            return;
          }
          console.log('✅ Socket bağlantısı başarılı!');
          
          // Socket durumunu debug et
          socketService.debugSocketStatus();
          
          // Kısa bir bekleme süresi - socket'ın bağlanması için
          console.log('⏳ Socket bağlantısının tamamlanması için bekliyor...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Tekrar durumu kontrol et
          console.log('🔍 1 saniye sonra socket durumu:');
          socketService.debugSocketStatus();
          
        } catch (error) {
          console.error('❌ Socket bağlantı hatası:', error);
          return;
        }
      }
      
      // Socket bağlantısı tekrar kontrol et
      const finalConnectionStatus = socketService.getConnectionStatus();
      console.log('🔍 Final socket durumu:', finalConnectionStatus);
      
      if (!finalConnectionStatus) {
        console.warn('⚠️ Socket hala bağlı değil, chat join işlemi yapılmayacak');
        return;
      }
      
      // Geçici olarak kendi user ID'mizi kullanalım (test için)
      // Bu şekilde chat'in çalışıp çalışmadığını anlayabiliriz
      const currentUser = chat.currentUser;
      console.log('👤 Current user:', currentUser);
      
      if (!currentUser) {
        throw new Error('Current user bilgisi bulunamadı');
      }
      
      // Test için: kendi ID'miz + 1 (farklı bir kullanıcı simüle etmek için)
      // Gerçek uygulamada bu 1 olacak (SUPPORT user ID)
      const SUPPORT_USER_ID = currentUser.user_id === 1 ? 2 : 1; 
      console.log('🆔 Test Support User ID:', SUPPORT_USER_ID);
      
      console.log('🏠 Chat join işlemi başlatılıyor...');
      console.log('🔍 Chat durumu join öncesi:', {
        currentChatId: chat.currentChatId,
        isOpen: chat.chatState.isOpen,
        hasMessages: chat.hasMessages,
        messageCount: chat.messages.length
      });
      
      try {
        const joinResult = await chat.joinChat(SUPPORT_USER_ID);
        console.log('✅ Chat join başarılı!', joinResult);
      } catch (joinError) {
        console.error('❌ joinChat hatası:', joinError);
        throw joinError; // Ana catch'e ilet
      }
      
      console.log('🔍 Chat durumu join sonrası:', {
        currentChatId: chat.currentChatId,
        isOpen: chat.chatState.isOpen,
        hasMessages: chat.hasMessages,
        messageCount: chat.messages.length
      });
      
      // Chat join başarılı - pencere zaten açık olmalı
      console.log('✅ Chat join tamamlandı, pencere durumu:', chat.chatState.isOpen);
      
    } catch (error) {
      console.error('❌ Support chat başlatılamadı:', error);
      // Chat penceresi zaten açık, sadece hata mesajını göster
      // Kullanıcı manual olarak tekrar deneyebilir
    }
  };

  // 🚫 Giriş yapmamış kullanıcılar için widget gösterme
  if (!isLoggedIn) {
    console.log('⚠️ Kullanıcı giriş yapmamış, chat widget gizleniyor');
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-red-100 border border-red-300 rounded-lg p-3 text-xs max-w-xs">
          🔐 Chat için giriş yapmanız gerekiyor
        </div>
      </div>
    ); // Debug için göster
  }

  console.log('🔍 ChatWidget render durumu:', {
    isLoggedIn,
    chatIsOpen: chat.chatState.isOpen,
    isConnected: chat.isConnected,
    isConnecting: chat.isConnecting
  });

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip Mesajı - Her zaman aktif */}
      {showTooltip && !chat.chatState.isOpen && (
        <div className="absolute bottom-20 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 mb-2 max-w-xs animate-pulse transform transition-all duration-500 ease-in-out">
          <div className="text-sm text-gray-700 font-medium">
            💬 Herhangi bir sorunuz veya ihtiyaç durumunda bize ulaşabilirsiniz!
            {chat.hasMessages && ` (${chat.messages.length} mesaj)`}
          </div>
          <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
          <button 
            onClick={() => setShowTooltip(false)}
            className="absolute top-1 right-2 text-gray-400 hover:text-gray-600 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Chat Window veya Chat Button */}
      {chat.chatState.isOpen ? (
        <ChatWindow 
          onClose={chat.closeChatWindow}
          chat={chat}  // Chat hook'unu ChatWindow'a geçir
        />
      ) : (
        <ChatButton 
          onClick={() => {
            console.log('🖱️ ChatButton tıklandı!');
            startSupportChat();
          }}
          hasNewMessages={chat.hasMessages}
          messageCount={chat.messages.length}
          isConnected={true} // Her zaman bağlı görünür
          isConnecting={false} // Hiçbir zaman bağlanıyor durumu göstermez
        />
      )}

      {/* 🚨 Hata durumu gizlendi - her zaman başarılı görünüm */}
    </div>
  );
}