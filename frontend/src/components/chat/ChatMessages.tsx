import { useEffect, useRef } from "react";
import { CardContent } from "@/components/ui/card";
import { SocketMessage, SocketUser } from "@/types/socket";
import { Loader2, AlertCircle } from "lucide-react";

interface ChatMessagesProps {
  messages: SocketMessage[];
  currentUser: SocketUser | null;
  isLoading: boolean;
  error: string | null;
  isTypingDisplayText: string;
  hasMessages: boolean;
}

export default function ChatMessages({
  messages,
  currentUser,
  isLoading,
  error,
  isTypingDisplayText,
  hasMessages,
}: ChatMessagesProps) {
  //  Auto scroll to bottom when new message arrives
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get user avatar/initial
  const getUserAvatar = (user: SocketUser) => {
    const initial = user.name?.charAt(0).toUpperCase() || "?";
    const colors = {
      CUSTOMER: "bg-blue-600",
      HOTEL_OWNER: "bg-green-600",
      SUPPORT: "bg-purple-600",
    };
    return { initial, colorClass: colors[user.role] || "bg-gray-600" };
  };

  // Format message time
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Render single message
  const renderMessage = (message: SocketMessage) => {
    const isOwnMessage =
      currentUser && message.sender_id === currentUser.user_id;
    const { initial, colorClass } = getUserAvatar(message.sender);

    return (
      <div
        key={message.message_id}
        className={`flex items-start gap-3 ${
          isOwnMessage ? "justify-end" : ""
        }`}
      >
        {/* Avatar - Left side (for other users) */}
        {!isOwnMessage && (
          <div
            className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0`}
          >
            <span className="text-white text-sm font-medium">{initial}</span>
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`rounded-lg p-4 max-w-[75%] ${
            isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          {/* Sender name (for other users) */}
          {!isOwnMessage && (
            <div className="text-xs text-muted-foreground mb-1 font-medium">
              {message.sender.name}
              {message.sender.role === "SUPPORT" && " (Destek)"}
              {message.sender.role === "HOTEL_OWNER" && " (Otel)"}
            </div>
          )}

          {/* Message content */}
          <p className="text-base leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>

          {/* Message time and status */}
          <div
            className={`text-xs mt-2 flex items-center gap-1 ${
              isOwnMessage
                ? "text-primary-foreground/70"
                : "text-muted-foreground"
            }`}
          >
            <span>{formatMessageTime(message.created_at)}</span>
            {isOwnMessage && (
              <span>
                {message.status === "SEND" && "📤"}
                {message.status === "DELIVERED" && "✅"}
                {message.status === "READ" && "👁️"}
              </span>
            )}
          </div>
        </div>

        {/* Avatar - Right side (for our own messages) */}
        {isOwnMessage && (
          <div
            className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0`}
          >
            <span className="text-white text-sm font-medium">{initial}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <CardContent className="flex-1 p-6 overflow-y-auto text-base space-y-4">
      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">
            Mesajlar yükleniyor...
          </span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Welcome message (if no messages) */}
      {!isLoading && !error && !hasMessages && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
            <span className="text-white text-sm font-medium">🎯</span>
          </div>
          <div className="bg-muted rounded-lg p-4 max-w-[75%]">
            <p className="text-base leading-relaxed">
              Merhaba! Size nasıl yardımcı olabilirim? Otel rezervasyonu,
              hizmetler veya diğer konularda sorularınızı sorabilirsiniz.
            </p>
          </div>
        </div>
      )}

      {/* Messages list */}
      {!isLoading && !error && hasMessages && messages.map(renderMessage)}

      {/* Typing indicator */}
      {isTypingDisplayText && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
            <span className="text-white text-sm font-medium">💭</span>
          </div>
          <div className="bg-muted rounded-lg p-4 max-w-[75%]">
            <p className="text-sm text-muted-foreground italic animate-pulse">
              {isTypingDisplayText}
            </p>
          </div>
        </div>
      )}

      {/* Auto scroll anchor */}
      <div ref={messagesEndRef} />
    </CardContent>
  );
}
