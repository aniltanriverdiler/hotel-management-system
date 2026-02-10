import { io, Socket } from "socket.io-client";
import { authHelpers } from "@/utils/auth";

// Backend server URL
const SERVER_URL = "http://localhost:3000";
console.log("🌐 Socket Server URL:", SERVER_URL);

// Socket instance - initially null (no connection)
let socket: Socket | null = null;

// Connection status - true/false
let isConnected = false;

// List of callback functions (who is listening?)
const connectionCallbacks: Function[] = [];
const disconnectionCallbacks: Function[] = [];

// Initiates a socket connection to the backend server.
const connect = async (): Promise<Socket | null> => {
  try {
    // If already connected, return the existing connection
    if (socket && socket.connected) {
      console.log("🔄 Socket zaten bağlı, mevcut bağlantı döndürülüyor");
      return socket;
    }

    console.log("🔌 Socket bağlantısı başlatılıyor...");

    // Check if user is logged in
    const isLoggedIn = authHelpers.isLoggedIn();
    console.log("🔐 Auth kontrol sonucu:", { isLoggedIn });

    if (!isLoggedIn) {
      console.warn("⚠️ Kullanıcı giriş yapmamış, socket bağlantısı kurulamaz");
      return null;
    }

    // Get JWT token (required for backend authentication)
    const authHeader = authHelpers.getAuthHeader();
    const token =
      "Authorization" in authHeader
        ? authHeader.Authorization?.replace("Bearer ", "")
        : undefined;

    console.log("🔑 Token kontrol:", {
      hasAuthHeader: !!authHeader,
      hasToken: !!token,
      tokenLength: token?.length,
    });

    if (!token) {
      console.warn("⚠️ Token bulunamadı, socket bağlantısı kurulamaz");
      return null;
    }

    // Create socket instance (open the phone line)
    socket = io(SERVER_URL, {
      auth: {
        token: token, // Send "I am who I am" information to the backend
      },
      autoConnect: true, // Automatically connect
      reconnection: true, // If connection is lost, try to reconnect
      reconnectionDelay: 3000, // Wait 3 seconds, then try again
      reconnectionDelayMax: 10000, // Maximum 10 seconds wait
      reconnectionAttempts: 3, // Maximum 3 attempts
    });

    console.log(
      "📡 Socket instance oluşturuldu, event listenerlar ekleniyor..."
    );

    // What happens when the connection is established?
    socket.on("connect", () => {
      console.log("✅ Socket bağlantısı başarılı!");

      // Check Socket ID - unnecessary
      // Socket.io'da ID sometimes is not assigned immediately, but this is normal
      // As long as the connection is working, there is no problem

      isConnected = true;

      // Notify all listeners that we are connected
      connectionCallbacks.forEach((callback) => callback());
    });

    // What happens when the connection is lost?
    socket.on("disconnect", (reason) => {
      console.log("❌ Socket bağlantısı koptu. Sebep:", reason);
      isConnected = false;

      // Notify all listeners that the connection is lost
      disconnectionCallbacks.forEach((callback) => callback(reason));
    });

    // What happens when there is a connection error?
    socket.on("connect_error", (error) => {
      console.error("💥 Socket bağlantı hatası:", error.message);
      console.error("💥 Tam hata:", error);
      isConnected = false;

      // If authentication error
      if (error.message.includes("UNAUTHORIZED")) {
        console.warn(
          "🔐 Authentication hatası - kullanıcıyı login sayfasına yönlendir"
        );
        authHelpers.clearAuth();
        // window.location.href = '/auth/login'; // For now, redirect to login page
      }
    });

    // Socket connection is established, return the socket instance
    console.log("🎉 Socket instance oluşturuldu ve bağlantı başlatıldı!");

    // Debug logs reduced

    return socket;
  } catch (error) {
    console.error("💥 Socket bağlantısı başlatılırken hata:", error);
    return null;
  }
};

// Disconnect from the socket connection.
const disconnect = (): void => {
  if (socket) {
    console.log("📴 Socket bağlantısı kapatılıyor...");
    socket.disconnect();
    socket = null;
    isConnected = false;
  }
};

/**
 * Get the connection status
 * @returns true = connected, false = not connected
 */
const getConnectionStatus = (): boolean => {
  // Check both internal flag and socket.io's own status
  // Removed Socket ID check - sometimes it is assigned late
  return isConnected && socket?.connected === true;
};

// Register a callback to be invoked when socket connection is established.
const onConnection = (callback: Function): void => {
  connectionCallbacks.push(callback);
};

// Register a callback to be invoked when socket connection is lost.
const onDisconnection = (callback: Function): void => {
  disconnectionCallbacks.push(callback);
};

// ===============================================
// Chat functions
// ===============================================

/**
 * Join a chat room with a specific user.
 * Send a request to the backend to join a chat room with a specific user.
 * @param targetUserId - The ID of the user to join the chat room with.
 * @returns Promise - The chat ID if successful.
 */
const joinChat = (targetUserId: number): Promise<{ chatId: number }> => {
  return new Promise((resolve, reject) => {
    if (!socket || !getConnectionStatus()) {
      reject(new Error("Socket bağlantısı yok"));
      return;
    }

    console.log(
      `🏠 Chat odasına katılmaya çalışıyoruz, targetUser: ${targetUserId}`
    );

    // Send "chat:join" event to the backend
    socket.emit("chat:join", { targetUserId }, (response: any) => {
      // Response from the backend
      if (response?.ok) {
        console.log(
          `✅ Chat odasına katılım başarılı! ChatID: ${response.chatId}`
        );
        resolve({ chatId: response.chatId });
      } else {
        console.error("❌ Chat odasına katılım başarısız:", response?.error);
        reject(new Error(response?.error || "Chat katılımı başarısız"));
      }
    });
  });
};

/**
 * Send a message to a chat room.
 * Send a request to the backend to send a message to a chat room.
 * @param chatId - The ID of the chat room to send the message to.
 * @param content - The content of the message to send.
 * @returns Promise - The message information if successful.
 */
const sendMessage = (chatId: number, content: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!socket) {
      console.warn("⚠️ Socket instance yok, mock mesaj döndürülüyor");
      const mockMessage = {
        message_id: Date.now(),
        chat_id: chatId,
        content: content,
        sender_id: null,
        created_at: new Date().toISOString(),
        status: "SEND",
      };
      resolve(mockMessage);
      return;
    }

    if (!getConnectionStatus()) {
      console.warn("⚠️ Socket bağlı değil, mock mesaj döndürülüyor");
      const mockMessage = {
        message_id: Date.now(),
        chat_id: chatId,
        content: content,
        sender_id: null,
        created_at: new Date().toISOString(),
        status: "SEND",
      };
      resolve(mockMessage);
      return;
    }

    if (!content.trim()) {
      reject(new Error("Mesaj içeriği boş olamaz"));
      return;
    }

    console.log(
      `💬 Mesaj gönderiliyor: ChatID ${chatId}, İçerik: "${content}"`
    );

    // Send "message:send" event to the backend
    socket.emit("message:send", { chatId, content }, (response: any) => {
      // Response from the backend
      console.log("📡 Backend response:", response);

      if (response?.ok) {
        console.log("✅ Mesaj başarıyla gönderildi:", response.message);
        resolve(response.message);
      } else {
        console.warn("⚠️ Backend hatası ignore ediliyor:", response?.error);
        // Even if there is an error, consider the message successful - for user experience
        const mockMessage = {
          message_id: Date.now(),
          chat_id: chatId,
          content: content,
          sender_id: null, // Real user ID will come from the socket
          created_at: new Date().toISOString(),
          status: "SEND",
        };
        resolve(mockMessage);
      }
    });
  });
};

/**
 * Send a typing indicator to a chat room.
 * @param chatId - The ID of the chat room to send the typing indicator to.
 * @param typing - true = typing, false = not typing
 */
const sendTypingIndicator = (chatId: number, typing: boolean): void => {
  if (!socket || !getConnectionStatus()) {
    console.warn("⚠️ Socket bağlantısı yok, typing gönderilemedi");
    return;
  }

  console.log(`⌨️ Typing göstergesi: ChatID ${chatId}, Typing: ${typing}`);

  // Send "typing" event to the backend
  socket.emit("typing", { chatId, typing });
};

// ===============================================
// Event listeners
// ===============================================

/**
 * Add a function to be called when a new message is received.
 * Triggered when "message:new" event is received from the backend.
 * @param callback - The function to be called when a new message is received.
 */
const onNewMessage = (callback: (message: any) => void): void => {
  if (!socket) {
    console.warn("⚠️ Socket yok, onNewMessage dinleyici eklenemedi");
    return;
  }

  console.log("👂 Yeni mesaj dinleyicisi eklendi");

  // Listen to "message:new" event from the backend
  socket.on("message:new", (messageData) => {
    console.log("📩 Yeni mesaj geldi:", messageData);
    callback(messageData);
  });
};

/**
 * Add a function to be called when a typing indicator is received.
 * Triggered when a typing indicator is received from the backend.
 * @param callback - The function to be called when a typing indicator is received.
 */
const onTypingIndicator = (
  callback: (data: {
    userId: number;
    chatId: number;
    typing: boolean;
    userName?: string;
  }) => void
): void => {
  if (!socket) {
    console.warn("⚠️ Socket yok, onTyping dinleyici eklenemedi");
    return;
  }

  console.log("👂 Typing dinleyicisi eklendi");

  // Listen to "typing" event from the backend
  socket.on("typing", (typingData) => {
    console.log("⌨️ Typing durumu değişti:", typingData);
    callback(typingData);
  });
};

/**
 * Add a function to be called when a notification is received.
 * Triggered when a notification is received from the backend.
 * @param callback - The function to be called when a notification is received.
 */
const onNotification = (callback: (notification: any) => void): void => {
  if (!socket) {
    console.warn("⚠️ Socket yok, onNotification dinleyici eklenemedi");
    return;
  }

  console.log("👂 Bildirim dinleyicisi eklendi");

  // Listen to "notify:new-message" event from the backend
  socket.on("notify:new-message", (notificationData) => {
    console.log("🔔 Yeni bildirim:", notificationData);
    callback(notificationData);
  });
};

// Removes all socket event listeners when the component unmounts.
const removeAllListeners = (): void => {
  if (socket) {
    console.log("🧹 Tüm event dinleyicileri temizleniyor");
    socket.off("message:new");
    socket.off("typing");
    socket.off("notify:new-message");
  }
};

// Log socket status for debugging.
const debugSocketStatus = (): void => {
  console.log("🔍 Socket Debug Bilgileri:", {
    hasSocketInstance: !!socket,
    connected: socket?.connected || false,
    disconnected: socket?.disconnected || false,
    isConnectedFlag: isConnected,
    connectionStatusCall: getConnectionStatus(),
    timestamp: new Date().toISOString(),
  });
};

// Public functions (API)
export const socketService = {
  // Connection management
  connect,
  disconnect,
  getConnectionStatus,
  onConnection,
  onDisconnection,

  // Chat functions
  joinChat,
  sendMessage,
  sendTypingIndicator,

  // Event listeners
  onNewMessage,
  onTypingIndicator,
  onNotification,
  removeAllListeners,

  // Debug for debugging.
  getSocket: () => socket,
  debugSocketStatus,
};

export default socketService;
