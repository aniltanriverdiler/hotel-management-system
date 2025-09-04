// ===============================================
// 🎯 SOCKET EVENT TİPLERİ
// ===============================================
// Bu dosya backend'den gelen/giden socket event'leri için tip tanımları içerir

// 👤 Kullanıcı bilgileri (backend User modeli based)
export interface SocketUser {
  user_id: number;
  name: string;
  role: 'CUSTOMER' | 'HOTEL_OWNER' | 'SUPPORT';
  is_online?: boolean;
}

// 💬 Mesaj yapısı (backend Message modeli based)
export interface SocketMessage {
  message_id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  created_at: string;  // ISO date string
  status: 'SEND' | 'DELIVERED' | 'READ';
  
  // İlişkili veriler (backend'den populate ediliyor)
  sender: SocketUser;
}

// 🏠 Chat odası yapısı (backend Chat modeli based)  
export interface SocketChat {
  chat_id: number;
  created_at: string;
  
  // İlişkili veriler
  participants?: SocketChatParticipant[];
  messages?: SocketMessage[];
}

// 👥 Chat katılımcısı (backend ChatParticipant modeli based)
export interface SocketChatParticipant {
  participant_id: number;
  chat_id: number;
  user_id: number;
  joined_at: string;
  
  // İlişkili user bilgisi
  user: SocketUser;
}

// ===============================================
// 📤 CLIENT → SERVER EVENT PAYLOADS (Gönderilen)
// ===============================================

// 🏠 Chat odasına katılma isteği
export interface ChatJoinPayload {
  targetUserId: number;
}

// 💬 Mesaj gönderme isteği  
export interface MessageSendPayload {
  chatId: number;
  content: string;
}

// ⌨️ Yazıyor göstergesi gönderme
export interface TypingPayload {
  chatId: number;
  typing: boolean;  // true = yazıyor, false = yazmayı bıraktı
}

// ===============================================
// 📥 SERVER → CLIENT EVENT PAYLOADS (Gelen)
// ===============================================

// 🏠 Chat katılımı cevabı
export interface ChatJoinResponse {
  ok: boolean;
  chatId?: number;
  error?: string;
}

// 💬 Mesaj gönderme cevabı
export interface MessageSendResponse {
  ok: boolean;
  message?: SocketMessage;
  error?: string;
}

// 📩 Yeni mesaj bildirimi (real-time)
export interface NewMessageEvent {
  message: SocketMessage;
  chatId: number;
}

// ⌨️ Yazıyor göstergesi bildirimi (real-time)
export interface TypingEvent {
  userId: number;
  chatId: number;
  typing: boolean;
  userName?: string;  // UI'da "Ali yazıyor..." göstermek için
}

// 🔔 Genel bildirim yapısı
export interface NotificationEvent {
  type: 'new-message' | 'user-online' | 'user-offline' | 'system';
  title: string;
  message: string;
  chatId?: number;
  fromUserId?: number;
  messageId?: number;
}

// 📊 Sistem bilgi mesajları (çevrimdışı kullanıcı vs.)
export interface SystemInfoEvent {
  type: 'offline' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  toUserId: number;
}

// ===============================================
// 🔌 SOCKET CONNECTION TİPLERİ  
// ===============================================

// Socket bağlantı durumu
export type SocketConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

// Socket error tipleri
export interface SocketError {
  type: 'connection' | 'authentication' | 'network' | 'timeout';
  message: string;
  originalError?: any;
}

// Socket bağlantı konfigürasyonu
export interface SocketConfig {
  url: string;
  token?: string;
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionDelay?: number;
  reconnectionAttempts?: number;
}

// ===============================================
// 🎪 EVENT NAME CONSTANTS (Event isimleri)
// ===============================================

// Bu constant'lar typo'ları önler ve refactoring'i kolaylaştırır
export const SOCKET_EVENTS = {
  // Client → Server
  CHAT_JOIN: 'chat:join',
  MESSAGE_SEND: 'message:send', 
  TYPING: 'typing',
  
  // Server → Client
  MESSAGE_NEW: 'message:new',
  TYPING_INDICATOR: 'typing',
  NOTIFY_NEW_MESSAGE: 'notify:new-message',
  SYSTEM_INFO: 'system:info',
  
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error'
} as const;

// Event isimlerinin tipi (string literal union)
export type SocketEventName = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];

// ===============================================
// 🎨 UI STATE TİPLERİ (Frontend state için)
// ===============================================

// Chat UI durumu
export interface ChatUIState {
  isOpen: boolean;
  currentChatId: number | null;
  messages: SocketMessage[];
  isLoading: boolean;
  error: string | null;
  isTyping: boolean;
  typingUsers: SocketUser[];
}

// Mesaj input durumu
export interface MessageInputState {
  content: string;
  isValid: boolean;
  isSending: boolean;
  error: string | null;
}

// Online kullanıcı durumu
export interface UserOnlineStatus {
  userId: number;
  isOnline: boolean;
  lastSeen?: string;
}

