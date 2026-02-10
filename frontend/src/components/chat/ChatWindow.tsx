import { Card } from "@/components/ui/card";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import { UseChatReturn } from "@/hooks/useChat";

interface ChatWindowProps {
  onClose: () => void;
  chat?: UseChatReturn; // All state and functions from the chat hook
}

export default function ChatWindow({ onClose, chat }: ChatWindowProps) {
  if (!chat) {
    return (
      <Card className="w-96 h-[500px] flex flex-col shadow-lg rounded-xl border bg-card text-card-foreground mb-4">
        <div className="p-4 text-center">
          <div className="text-sm text-muted-foreground">
            Chat yükleniyor...
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-96 h-[500px] flex flex-col shadow-lg rounded-xl border bg-card text-card-foreground mb-4">
      {/* Chat Header - Connection status and user information */}
      <ChatHeader
        onClose={onClose}
        isConnected={chat.isConnected}
        isConnecting={chat.isConnecting}
        currentChatId={chat.currentChatId}
        error={chat.error}
      />

      {/* Chat Messages - Real-time message list */}
      <ChatMessages
        messages={chat.messages || []}
        currentUser={chat.currentUser}
        isLoading={chat.chatState.isLoading}
        error={chat.chatState.error}
        isTypingDisplayText={chat.isTypingDisplayText}
        hasMessages={chat.hasMessages}
      />

      {/* Chat Input - Message sending */}
      <ChatInput
        messageContent={chat.messageInput.content}
        onContentChange={chat.updateMessageContent}
        onSendMessage={chat.sendMessage}
        canSendMessage={chat.canSendMessage}
        isSending={chat.messageInput.isSending}
        inputError={chat.messageInput.error}
        onTypingIndicator={chat.sendTypingIndicator}
      />
    </Card>
  );
}
