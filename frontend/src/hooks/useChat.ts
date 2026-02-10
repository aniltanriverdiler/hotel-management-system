import { useState, useEffect, useCallback, useRef } from "react";
import { useSocket } from "./useSocket";
import socketService from "@/services/socketService";
import { chatAPI } from "@/data/apiService";
import {
  SocketMessage,
  SocketUser,
  TypingEvent,
  NotificationEvent,
  ChatUIState,
  MessageInputState,
} from "@/types/socket";
import { userManager } from "@/utils/auth";
import { authHelpers } from "@/utils/auth";

// ===============================================
// useChat Hook - Chat Operations Management
// ===============================================

/**
 * Chat operations management hook
 *
 * This hook does the following:
 * - Composes useSocket hook (connection management)
 * - Chat room join/leave operations
 * - Message list in state and real-time updates
 * - Message sending functionality
 * - Typing indicator management
 * - Notification system integration
 *
 * @param targetUserId - The ID of the user to chat with (optional, can be set later)
 * @returns Chat state and control functions
 */
export const useChat = (targetUserId?: number) => {
  // ===============================================
  // Socket Connection (Hook Composition)
  // ===============================================

  // useSocket hook'unu kullan - connection management
  const socket = useSocket();

  // ===============================================
  // Chat State Management
  // ===============================================

  // Current chat ID
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);

  // Current chat message list
  const [messages, setMessages] = useState<SocketMessage[]>([]);

  // Chat UI state
  const [chatState, setChatState] = useState<ChatUIState>({
    isOpen: false,
    currentChatId: null,
    messages: [],
    isLoading: false,
    error: null,
    isTyping: false,
    typingUsers: [],
  });

  // Message input state
  const [messageInput, setMessageInput] = useState<MessageInputState>({
    content: "",
    isValid: false,
    isSending: false,
    error: null,
  });

  // Typing timeout ref (typing indicator)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Current user information
  const [currentUser, setCurrentUser] = useState<SocketUser | null>(null);

  // ===============================================
  // Current User Management
  // ===============================================

  useEffect(() => {
    const user = userManager.getUser();
    console.log("useChat - User data from localStorage:", user);

    if (user) {
      // The user object from the backend has an id field that we use as user_id
      const userId = user.user_id || user.id;

      if (!userId) {
        console.warn("⚠️ useChat - User ID bulunamadı:", user);
        return;
      }

      setCurrentUser({
        user_id: userId,
        name: user.name || user.email || "Kullanıcı",
        role: user.role || "CUSTOMER",
        is_online: true,
      });

      console.log("✅ useChat - Current user set:", {
        user_id: userId,
        name: user.name || user.email || "Kullanıcı",
        role: user.role || "CUSTOMER",
      });
    } else {
      console.warn("⚠️ useChat - Kullanıcı bilgisi bulunamadı!");
    }
  }, []);

  // ===============================================
  // Chat Room Management
  // ===============================================

  /**
   * Join chat room
   * Start a 1-1 chat with targetUserId or open the existing chat
   */
  const joinChat = useCallback(
    async (userId: number) => {
      try {
        console.log(`🏠 Chat katılımı başlatılıyor, targetUser: ${userId}`);

        // Check socket status from useSocket and socketService
        const socketHookConnected = socket.isConnected;
        const socketServiceConnected = socketService.getConnectionStatus();

        console.log("🔍 Socket durumu:", {
          hookConnected: socketHookConnected,
          serviceConnected: socketServiceConnected,
          finalStatus: socketServiceConnected, // socketService has priority
        });
        console.log("🔍 Current user:", currentUser);

        if (!socketServiceConnected) {
          throw new Error(
            "Socket bağlantısı yok - önce socket bağlantısını kurun"
          );
        }

        if (!currentUser) {
          throw new Error("Kullanıcı bilgisi bulunamadı - giriş yapın");
        }

        setChatState((prev) => ({ ...prev, isLoading: true, error: null }));

        // Join chat room with socket
        console.log("📡 Socket service joinChat çağrılıyor...");
        let chatId;
        try {
          const joinResult = await socketService.joinChat(userId);
          chatId = joinResult.chatId;
          console.log("✅ Socket joinChat başarılı, chatId:", chatId);
        } catch (socketError) {
          console.error("❌ Socket joinChat hatası:", socketError);
          const errorMessage =
            socketError instanceof Error
              ? socketError.message
              : "Bilinmeyen socket hatası";
          throw new Error(`Socket join hatası: ${errorMessage}`);
        }

        // Get existing messages with REST API
        console.log("📄 Eski mesajlar getiriliyor...");
        const existingMessages = await chatAPI.getMessages(chatId);
        console.log(
          "✅ Eski mesajlar alındı:",
          existingMessages?.length || 0,
          "mesaj"
        );

        // Update state
        setCurrentChatId(chatId);
        setMessages(existingMessages || []);
        setChatState((prev) => ({
          ...prev,
          currentChatId: chatId,
          messages: existingMessages || [],
          isLoading: false,
          error: null,
          // isOpen: true removed - will be opened manually in ChatWidget
        }));

        console.log(
          `✅ Chat katılımı başarılı! ChatID: ${chatId}, ${
            existingMessages?.length || 0
          } mesaj yüklendi`
        );
        console.log("🔍 State güncelleme sonrası:", {
          currentChatId: chatId,
          setCurrentChatIdCalled: true,
          messagesLength: existingMessages?.length || 0,
        });

        return { chatId, messages: existingMessages };
      } catch (error) {
        console.error("❌ Chat katılımı başarısız:", error);

        const errorMessage =
          error instanceof Error ? error.message : "Chat katılımı başarısız";
        setChatState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        throw error;
      }
    },
    [socket.isConnected, currentUser]
  );

  // Leave chat room
  const leaveChat = useCallback(() => {
    console.log("🚪 Chat odasından ayrılıyor...");

    // Clear state
    setCurrentChatId(null);
    setMessages([]);
    setChatState((prev) => ({
      ...prev,
      currentChatId: null,
      messages: [],
      isOpen: false,
      error: null,
      isTyping: false,
      typingUsers: [],
    }));

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, []);

  // ===============================================
  // Message Management
  // ===============================================

  // Send message
  const sendMessage = useCallback(
    async (content: string) => {
      try {
        console.log("🔍 sendMessage çağrıldı:", {
          content: content,
          currentChatId: currentChatId,
          hasCurrentChatId: !!currentChatId,
          socketConnected: socketServiceConnected,
        });

        if (!currentChatId) {
          console.error("❌ currentChatId bulunamadı:", {
            currentChatId,
            chatStateCurrentChatId: chatState.currentChatId,
            isOpen: chatState.isOpen,
          });
          throw new Error("Aktif chat yok");
        }

        if (!content.trim()) {
          throw new Error("Mesaj içeriği boş olamaz");
        }

        if (!socketServiceConnected) {
          console.warn(
            "⚠️ Socket bağlantısı yok, ama mesaj yine de gönderiliyor (kullanıcı deneyimi için):",
            {
              socketServiceStatus: socketServiceConnected,
              hookSocketStatus: socket.isConnected,
            }
          );
          // Continue sending message even if socket connection is not available
        }

        console.log(`💬 Mesaj gönderiliyor: "${content}"`);

        setMessageInput((prev) => ({ ...prev, isSending: true, error: null }));

        // Optimistic update - add message to UI immediately
        const optimisticMessage: SocketMessage = {
          message_id: Date.now(), // Temporary ID
          chat_id: currentChatId,
          content: content.trim(),
          sender_id: currentUser?.user_id || 0,
          sender: currentUser || {
            user_id: 0,
            name: "Ben",
            role: "CUSTOMER",
            is_online: true,
          },
          created_at: new Date().toISOString(),
          status: "SEND" as const,
        };

        // Add message to UI immediately
        setMessages((prev) => {
          const currentMessages = Array.isArray(prev) ? prev : [];
          const newMessages = [...currentMessages, optimisticMessage];
          console.log(
            "📱 Optimistic mesaj eklendi, toplam mesaj sayısı:",
            newMessages.length
          );
          return newMessages;
        });

        // Send message with socket (in the background)
        let sentMessage;
        try {
          sentMessage = await socketService.sendMessage(
            currentChatId,
            content.trim()
          );
          console.log("✅ Mesaj başarıyla gönderildi:", sentMessage);
        } catch (socketError) {
          console.warn(
            "⚠️ Socket ile mesaj gönderilemedi, ama UI'da görünüyor:",
            socketError
          );
          // Even if there's a socket error, the message will remain in the UI
        }

        setMessageInput((prev) => ({
          ...prev,
          content: "",
          isSending: false,
          isValid: false,
        }));

        return sentMessage;
      } catch (error) {
        console.error("❌ Mesaj gönderme başarısız:", error);

        const errorMessage =
          error instanceof Error ? error.message : "Mesaj gönderilemedi";
        setMessageInput((prev) => ({
          ...prev,
          isSending: false,
          error: errorMessage,
        }));

        throw error;
      }
    },
    [currentChatId, socket.isConnected]
  );

  // Send typing indicator
  const sendTypingIndicator = useCallback(
    (typing: boolean) => {
      if (!currentChatId || !socketServiceConnected) return;

      console.log(`⌨️ Typing göstergesi: ${typing}`);
      socketService.sendTypingIndicator(currentChatId, typing);

      // If typing state is entered, stop automatically after 3 seconds
      if (typing) {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          socketService.sendTypingIndicator(currentChatId!, false);
        }, 3000);
      }
    },
    [currentChatId, socket.isConnected]
  );

  // Update message input content
  const updateMessageContent = useCallback(
    (content: string) => {
      const isValid = content.trim().length > 0;

      setMessageInput((prev) => ({
        ...prev,
        content,
        isValid,
        error: null,
      }));

      // Typing indicator logic
      if (content.length > 0) {
        sendTypingIndicator(true);
      } else {
        sendTypingIndicator(false);
      }
    },
    [sendTypingIndicator]
  );

  // ===============================================
  // Real-Time Event Handlers
  // ===============================================

  useEffect(() => {
    if (!socket.isConnected) return;

    console.log("📥 Chat real-time event listenerlar kuruluyor...");

    // New message event
    socketService.onNewMessage((messageData: SocketMessage) => {
      console.log("📩 Yeni mesaj event alındı:", messageData);

      // Only add messages for the current chat
      if (messageData.chat_id === currentChatId) {
        setMessages((prev) => {
          // Duplicate message check (message ID)
          const exists = prev.some(
            (msg) => msg.message_id === messageData.message_id
          );
          if (exists) return prev;

          // Add new message (sorted by date)
          return [...prev, messageData].sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );
        });

        setChatState((prev) => ({
          ...prev,
          messages: prev.messages, // This will be automatically synced with useEffect
        }));
      }
    });

    // Typing indicator event
    socketService.onTypingIndicator((typingData: TypingEvent) => {
      console.log("⌨️ Typing event alındı:", typingData);

      // Only show typing indicator for the current chat
      if (typingData.chatId === currentChatId) {
        setChatState((prev) => {
          let newTypingUsers = [...prev.typingUsers];

          if (typingData.typing) {
            // Add to typing list (prevent duplicates)
            if (
              !newTypingUsers.some((user) => user.user_id === typingData.userId)
            ) {
              newTypingUsers.push({
                user_id: typingData.userId,
                name: typingData.userName || "Kullanıcı",
                role: "CUSTOMER", // Default role
              });
            }
          } else {
            // Remove from typing list
            newTypingUsers = newTypingUsers.filter(
              (user) => user.user_id !== typingData.userId
            );
          }

          return {
            ...prev,
            typingUsers: newTypingUsers,
            isTyping: newTypingUsers.length > 0,
          };
        });
      }
    });

    // Notification event
    socketService.onNotification((notification: NotificationEvent) => {
      console.log("🔔 Notification event alındı:", notification);

      // Notification display logic can be added here
      // For example: toast notification, browser notification, etc.
    });

    // Cleanup function
    return () => {
      console.log("🧹 Chat event listenerlar temizleniyor...");
      socketService.removeAllListeners();
    };
  }, [socket.isConnected, currentChatId]);

  // ===============================================
  // Messages State Sync
  // ===============================================

  // Sync messages state with chatState.messages
  useEffect(() => {
    setChatState((prev) => ({
      ...prev,
      messages: messages,
    }));
  }, [messages]);

  // ===============================================
  // Auto-Join Logic
  // ===============================================

  // Auto-join when targetUserId prop changes
  useEffect(() => {
    if (targetUserId && socket.isConnected && currentUser) {
      console.log(
        `🚀 targetUserId prop değişti: ${targetUserId}, otomatik chat katılımı başlatılıyor...`
      );
      joinChat(targetUserId);
    }
  }, [targetUserId, socket.isConnected, currentUser, joinChat]);

  // Manually start socket connection
  useEffect(() => {
    const initSocket = async () => {
      if (
        authHelpers.isLoggedIn() &&
        !socket.isConnected &&
        !socket.isConnecting
      ) {
        console.log("🔌 Manual socket bağlantısı başlatılıyor...");
        try {
          await socket.connect();
        } catch (error) {
          console.error("❌ Socket bağlantısı başarısız:", error);
        }
      }
    };

    initSocket();
  }, [socket.isConnected, socket.isConnecting, socket.connect]);

  // ===============================================
  // Computed Values
  // ===============================================

  const hasMessages = messages.length > 0;

  // Check socket status from socketService (more reliable)
  const socketServiceConnected = socketService.getConnectionStatus();

  // canSendMessage - check all requirements
  const canSendMessage = Boolean(
    socketServiceConnected && // Socket must be connected
      currentChatId && // Chat ID must be present
      messageInput.content.trim().length > 0 && // Content must be present
      !messageInput.isSending && // Sending process must not be ongoing
      !chatState.isLoading // Chat must not be loading
  );

  // Debug canSendMessage state (only important changes)
  useEffect(() => {
    console.log("🔍 canSendMessage durumu:", {
      socketServiceConnected,
      currentChatId,
      hasContent: messageInput.content.trim().length > 0,
      isSending: messageInput.isSending,
      isLoading: chatState.isLoading,
      finalCanSend: canSendMessage,
    });
  }, [
    socketServiceConnected,
    currentChatId,
    messageInput.content,
    messageInput.isSending,
    chatState.isLoading,
    canSendMessage,
  ]);

  const isTypingDisplayText =
    chatState.typingUsers.length > 0
      ? `${chatState.typingUsers.map((u) => u.name).join(", ")} yazıyor...`
      : "";

  // ===============================================
  // Hook API (Return values)
  // ===============================================

  return {
    // Socket state (from useSocket)
    ...socket,

    // Chat state
    currentChatId,
    messages,
    chatState,
    messageInput,
    currentUser,

    // Chat control functions
    joinChat,
    leaveChat,
    sendMessage,
    sendTypingIndicator,
    updateMessageContent,

    // Computed values
    hasMessages,
    canSendMessage,
    isTypingDisplayText,

    // Utility functions
    clearChatError: () => setChatState((prev) => ({ ...prev, error: null })),
    toggleChatWindow: () =>
      setChatState((prev) => ({ ...prev, isOpen: !prev.isOpen })),
    closeChatWindow: () => setChatState((prev) => ({ ...prev, isOpen: false })),
    openChatWindow: () => setChatState((prev) => ({ ...prev, isOpen: true })),

    // Socket connection functions
    connect: socket.connect,
    disconnect: socket.disconnect,
  };
};

// ===============================================
// Type Exports
// ===============================================

export type UseChatReturn = ReturnType<typeof useChat>;

export default useChat;
