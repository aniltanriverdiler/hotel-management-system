import { Button } from "@/components/ui/button";
import { MessageCircle, Wifi, WifiOff, Loader2 } from 'lucide-react';

interface ChatButtonProps {
  onClick: () => void;
  hasNewMessages?: boolean;
  messageCount?: number;
  isConnected?: boolean;
  isConnecting?: boolean;
}

export default function ChatButton({ 
  onClick, 
  hasNewMessages = false, 
  messageCount = 0, 
  isConnected = false, 
  isConnecting = false 
}: ChatButtonProps) {
  
  // 🎨 Button state'ine göre stil
  const getButtonStyles = () => {
    if (isConnecting) {
      return "bg-yellow-500 hover:bg-yellow-600";
    }
    if (!isConnected) {
      return "bg-gray-500 hover:bg-gray-600";
    }
    return "bg-blue-600 hover:bg-blue-700";
  };

  // 🔌 Connection icon - daha büyük ve görünür
  const getConnectionIcon = () => {
    if (isConnecting) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (!isConnected) return <WifiOff className="w-4 h-4" />;
    return <Wifi className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="relative">
      <Button
        variant="default"
        size="lg"
        className={`rounded-full p-6 shadow-lg text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl ${getButtonStyles()}`}
        onClick={onClick}
      >
        <MessageCircle className="w-10 h-10" />
      </Button>
      
      {/* 🔌 Bağlantı durumu ikonu - daha görünür */}
      <div className="absolute -top-2 -left-2 bg-white rounded-full p-2 shadow-lg border-2 border-gray-200">
        <div className={`${isConnecting ? "text-yellow-500" : isConnected ? "text-green-500" : "text-gray-500"}`}>
          {getConnectionIcon()}
        </div>
      </div>
      
      {/* 📩 Mesaj bildirimi badge */}
      {hasNewMessages && messageCount > 0 && isConnected && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-6 h-6 flex items-center justify-center shadow-lg animate-pulse px-1">
          {messageCount > 99 ? '99+' : messageCount}
        </div>
      )}
      
      {/* 🎯 Tooltip (hover durumunda) */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {isConnecting && '🔄 Bağlanıyor...'}
          {!isConnected && !isConnecting && '❌ Bağlantı yok'}
          {isConnected && !hasNewMessages && '💬 Canlı Destek'}
          {isConnected && hasNewMessages && `💬 ${messageCount} yeni mesaj`}
        </div>
      </div>
    </div>
  );
}
