// ===============================================
// Socket event types
// ===============================================
// This file contains type definitions for socket events sent and received from the backend.

// User information (backend User model based)
export interface SocketUser {
  user_id: number;
  name: string;
  role: "CUSTOMER" | "HOTEL_OWNER" | "SUPPORT";
  is_online?: boolean;
}

// Message structure (backend Message model based)
export interface SocketMessage {
  message_id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  created_at: string; // ISO date string
  status: "SEND" | "DELIVERED" | "READ";

  // Related data (populated from backend)
  sender: SocketUser;
}

// Chat room structure (backend Chat model based)
export interface SocketChat {
  chat_id: number;
  created_at: string;

  // Related data
  participants?: SocketChatParticipant[];
  messages?: SocketMessage[];
}

// Chat participant (backend ChatParticipant model based)
export interface SocketChatParticipant {
  participant_id: number;
  chat_id: number;
  user_id: number;
  joined_at: string;

  // Related user information
  user: SocketUser;
}

// ===============================================
// CLIENT → SERVER EVENT PAYLOADS (Sent)
// ===============================================

// Chat room join request
export interface ChatJoinPayload {
  targetUserId: number;
}

// Message send request
export interface MessageSendPayload {
  chatId: number;
  content: string;
}

// Typing indicator send
export interface TypingPayload {
  chatId: number;
  typing: boolean; // true = typing, false = not typing
}

// ===============================================
// SERVER → CLIENT EVENT PAYLOADS (Received)
// ===============================================

// Chat join response
export interface ChatJoinResponse {
  ok: boolean;
  chatId?: number;
  error?: string;
}

// Message send response
export interface MessageSendResponse {
  ok: boolean;
  message?: SocketMessage;
  error?: string;
}

// New message notification (real-time)
export interface NewMessageEvent {
  message: SocketMessage;
  chatId: number;
}

// Typing indicator notification (real-time)
export interface TypingEvent {
  userId: number;
  chatId: number;
  typing: boolean;
  userName?: string; // To show "Ali is typing..." in the UI
}

// General notification structure
export interface NotificationEvent {
  type: "new-message" | "user-online" | "user-offline" | "system";
  title: string;
  message: string;
  chatId?: number;
  fromUserId?: number;
  messageId?: number;
}

// System info messages (offline user, etc.)
export interface SystemInfoEvent {
  type: "offline" | "error" | "warning" | "info";
  title: string;
  message: string;
  toUserId: number;
}

// ===============================================
// SOCKET CONNECTION TYPES
// ===============================================

// Socket connection status
export type SocketConnectionStatus =
  | "connected"
  | "disconnected"
  | "connecting"
  | "error";

// Socket error types
export interface SocketError {
  type: "connection" | "authentication" | "network" | "timeout";
  message: string;
  originalError?: any;
}

// Socket connection configuration
export interface SocketConfig {
  url: string;
  token?: string;
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionDelay?: number;
  reconnectionAttempts?: number;
}

// ===============================================
// EVENT NAME CONSTANTS (Event names)
// ===============================================

// These constants prevent typos and facilitate refactoring
export const SOCKET_EVENTS = {
  // Client → Server
  CHAT_JOIN: "chat:join",
  MESSAGE_SEND: "message:send",
  TYPING: "typing",

  // Server → Client
  MESSAGE_NEW: "message:new",
  TYPING_INDICATOR: "typing",
  NOTIFY_NEW_MESSAGE: "notify:new-message",
  SYSTEM_INFO: "system:info",

  // Connection events
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",
} as const;

// Event names type (string literal union)
export type SocketEventName =
  (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];

// ===============================================
// UI STATE TYPES (For frontend state)
// ===============================================

// Chat UI state
export interface ChatUIState {
  isOpen: boolean;
  currentChatId: number | null;
  messages: SocketMessage[];
  isLoading: boolean;
  error: string | null;
  isTyping: boolean;
  typingUsers: SocketUser[];
}

// Message input state
export interface MessageInputState {
  content: string;
  isValid: boolean;
  isSending: boolean;
  error: string | null;
}

// Online user status
export interface UserOnlineStatus {
  userId: number;
  isOnline: boolean;
  lastSeen?: string;
}
