"use client";

import { useState, useEffect } from 'react';
import ChatButton from '@/components/chat/ChatButton';
import ChatWindow from '@/components/chat/ChatWindow';
import { useChat } from '@/hooks/useChat';
import { authHelpers } from '@/utils/auth';
import socketService from '@/services/socketService';

export default function ChatWidget() {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // 🎯 Chat hook - Socket ve chat işlemleri için
  const chat = useChat();
  
  // 👤 Kullanıcı giriş yapmış mı kontrol
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔐 Authentication kontrolü
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = authHelpers.isLoggedIn();
      setIsLoggedIn(loggedIn);
      console.log('🔍 Auth kontrol:', { loggedIn, hasToken: !!authHelpers.getAuthHeader() });
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
      
      // Direkt socketService ile bağlantı kontrolü
      const isConnected = socketService.getConnectionStatus();
      console.log('🔍 Socket durumu:', isConnected);
      
      if (!isConnected) {
        console.log('🔌 Socket bağlı değil, direkt bağlanıyoruz...');
        const socket = await socketService.connect();
        if (!socket) {
          console.error('❌ Socket bağlantısı kurulamadı');
          chat.openChatWindow();
          return;
        }
        console.log('✅ Socket bağlantısı başarılı!');
        // Bağlantı kurulması için biraz bekle
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Varsayılan support user ID (backend'de SUPPORT rolündeki bir kullanıcı)
      const SUPPORT_USER_ID = 1; // Bu ID'yi backend'deki gerçek support kullanıcısına göre ayarla
      
      await chat.joinChat(SUPPORT_USER_ID);
      chat.openChatWindow();
      
    } catch (error) {
      console.error('❌ Support chat başlatılamadı:', error);
      // Hata durumunda da chat penceresini aç ki en azından UI'ı görebilelim
      chat.openChatWindow();
    }
  };

  // 🚫 Giriş yapmamış kullanıcılar için widget gösterme
  if (!isLoggedIn) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-red-100 border border-red-300 rounded-lg p-3 text-xs max-w-xs">
          🔐 Chat için giriş yapmanız gerekiyor
        </div>
      </div>
    ); // Debug için göster
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip Mesajı - Sadece bağlıyken göster */}
      {showTooltip && !chat.chatState.isOpen && chat.isConnected && (
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
          onClick={startSupportChat}  // Support chat başlat
          hasNewMessages={chat.hasMessages}
          messageCount={chat.messages.length}
          isConnected={chat.isConnected}
          isConnecting={chat.isConnecting}
        />
      )}

      {/* 🚨 Hata durumu gösterimi */}
      {chat.hasError && chat.error && (
        <div className="absolute bottom-20 right-0 bg-red-100 border border-red-300 rounded-lg p-3 mb-2 max-w-sm">
          <div className="text-sm text-red-700 font-medium">
            ⚠️ Chat Hatası
          </div>
          <div className="text-xs text-red-600 mt-1">
            {chat.error.message}
          </div>
          <button 
            onClick={chat.clearChatError}
            className="text-xs text-red-500 mt-2 underline"
          >
            Kapat
          </button>
        </div>
      )}
    </div>
  );
}