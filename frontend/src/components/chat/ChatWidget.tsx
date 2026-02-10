"use client";

import { useState, useEffect } from "react";
import ChatButton from "@/components/chat/ChatButton";
import ChatWindow from "@/components/chat/ChatWindow";
import { useChat } from "@/hooks/useChat";
import { authHelpers, userManager } from "@/utils/auth";
import socketService from "@/services/socketService";

export default function ChatWidget() {
  const [showTooltip, setShowTooltip] = useState(false);

  // Chat hook - For socket and chat operations (no targetUserId - only socket connection)
  const chat = useChat();

  // Check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Authentication check
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = authHelpers.isLoggedIn();
      const userData = userManager.getUser();
      const authHeader = authHelpers.getAuthHeader();

      setIsLoggedIn(loggedIn);

      console.log("🔍 ChatWidget Auth kontrol:", {
        loggedIn,
        hasToken: !!(authHeader as any).Authorization,
        hasUserData: !!userData,
        userDataKeys: userData ? Object.keys(userData) : [],
      });

      if (!loggedIn) {
        console.warn(
          "⚠️ ChatWidget - Kullanıcı giriş yapmamış veya eksik data"
        );
      }
    };

    checkAuth();

    // Auth status can change, periodic check
    const authInterval = setInterval(checkAuth, 5000);

    return () => clearInterval(authInterval);
  }, []);

  // Manually start socket connection
  useEffect(() => {
    if (isLoggedIn && !chat.isConnected && !chat.isConnecting) {
      console.log("🔌 Manuel socket bağlantısı başlatılıyor...");
      chat.connect?.(); // If connect function exists, call it
    }
  }, [isLoggedIn, chat.isConnected, chat.isConnecting]);

  // Tooltip display logic
  useEffect(() => {
    // Only show tooltip to logged in users
    if (!isLoggedIn) return;

    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000); // After 3 seconds, show tooltip

    // After 10 seconds, hide tooltip
    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 13000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [isLoggedIn]);

  // Start support chat function
  const startSupportChat = async () => {
    try {
      console.log("🎯 Support chat başlatılıyor...");

      // First open chat window so user can see it while waiting
      console.log("📖 Chat penceresi açılıyor (loading durumunda)...");
      chat.openChatWindow();

      // Socket connection check and connection
      const isConnected = socketService.getConnectionStatus();
      console.log("🔍 Socket durumu:", isConnected);

      if (!isConnected) {
        console.log("🔌 Socket bağlı değil, bağlanıyoruz...");
        try {
          const socket = await socketService.connect();
          if (!socket) {
            console.error("❌ Socket bağlantısı kurulamadı");
            return;
          }
          console.log("✅ Socket bağlantısı başarılı!");

          // Debug socket status
          socketService.debugSocketStatus();

          // Short wait - for socket to connect
          console.log("⏳ Socket bağlantısının tamamlanması için bekliyor...");
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Check status again
          console.log("🔍 1 saniye sonra socket durumu:");
          socketService.debugSocketStatus();
        } catch (error) {
          console.error("❌ Socket bağlantı hatası:", error);
          return;
        }
      }

      // Check socket connection again
      const finalConnectionStatus = socketService.getConnectionStatus();
      console.log("🔍 Final socket durumu:", finalConnectionStatus);

      if (!finalConnectionStatus) {
        console.warn(
          "⚠️ Socket hala bağlı değil, chat join işlemi yapılmayacak"
        );
        return;
      }

      // Temporarily use our own user ID for testing purposes to verify if the chat works.
      const currentUser = chat.currentUser;
      console.log("👤 Current user:", currentUser);

      if (!currentUser) {
        throw new Error("Current user bilgisi bulunamadı");
      }

      // For testing purposes: our own user ID + 1 (to simulate a different user)
      // In the real application, this will be 1 (SUPPORT user ID)
      const SUPPORT_USER_ID = currentUser.user_id === 1 ? 2 : 1;
      console.log("🆔 Test Support User ID:", SUPPORT_USER_ID);

      console.log("🏠 Chat join işlemi başlatılıyor...");
      console.log("🔍 Chat durumu join öncesi:", {
        currentChatId: chat.currentChatId,
        isOpen: chat.chatState.isOpen,
        hasMessages: chat.hasMessages,
        messageCount: chat.messages.length,
      });

      try {
        const joinResult = await chat.joinChat(SUPPORT_USER_ID);
        console.log("✅ Chat join başarılı!", joinResult);
      } catch (joinError) {
        console.error("❌ joinChat hatası:", joinError);
        throw joinError; // Pass to main catch
      }

      console.log("🔍 Chat durumu join sonrası:", {
        currentChatId: chat.currentChatId,
        isOpen: chat.chatState.isOpen,
        hasMessages: chat.hasMessages,
        messageCount: chat.messages.length,
      });

      // Chat join successful - window should already be open
      console.log(
        "✅ Chat join tamamlandı, pencere durumu:",
        chat.chatState.isOpen
      );
    } catch (error) {
      console.error("❌ Support chat başlatılamadı:", error);
      // Chat window is already open, only show error message
      // User can manually try again
    }
  };

  // For not logged in users, show widget
  if (!isLoggedIn) {
    console.log("⚠️ Kullanıcı giriş yapmamış, chat widget gizleniyor");
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-red-100 border border-red-300 rounded-lg p-3 text-xs max-w-xs">
          🔐 Chat için giriş yapmanız gerekiyor
        </div>
      </div>
    ); // For debugging purposes
  }

  console.log("🔍 ChatWidget render durumu:", {
    isLoggedIn,
    chatIsOpen: chat.chatState.isOpen,
    isConnected: chat.isConnected,
    isConnecting: chat.isConnecting,
  });

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip Message - Always active */}
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

      {/* Chat Window or Chat Button */}
      {chat.chatState.isOpen ? (
        <ChatWindow
          onClose={chat.closeChatWindow}
          chat={chat} // Pass chat hook to ChatWindow
        />
      ) : (
        <ChatButton
          onClick={() => {
            console.log("🖱️ ChatButton tıklandı!");
            startSupportChat();
          }}
          hasNewMessages={chat.hasMessages}
          messageCount={chat.messages.length}
          isConnected={true} // Always connected
          isConnecting={false} // Never show connecting status
        />
      )}

      {/* Error status hidden - always successful view */}
    </div>
  );
}
