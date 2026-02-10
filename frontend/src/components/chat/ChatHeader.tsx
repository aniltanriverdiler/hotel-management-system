import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import {
  MessageCircle,
  X,
  Wifi,
  WifiOff,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { SocketError } from "@/types/socket";

interface ChatHeaderProps {
  onClose: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  currentChatId: number | null;
  error: SocketError | null;
}

export default function ChatHeader({
  onClose,
  isConnected,
  isConnecting,
  currentChatId,
  error,
}: ChatHeaderProps) {
  // Connection status styling
  const getConnectionStatusStyles = () => {
    if (isConnecting)
      return { color: "text-yellow-600", icon: Loader2, text: "Bağlanıyor..." };
    if (isConnected)
      return { color: "text-green-600", icon: Wifi, text: "Çevrimiçi" };
    if (error)
      return { color: "text-red-600", icon: AlertCircle, text: "Hata" };
    return { color: "text-gray-600", icon: WifiOff, text: "Çevrimdışı" };
  };

  const { color, icon: StatusIcon, text } = getConnectionStatusStyles();

  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
      <div className="flex items-center gap-3">
        {/* Chat icon */}
        <MessageCircle className="w-8 h-8 text-blue-600" />

        <div className="flex flex-col">
          {/* Title */}
          <span className="font-medium text-lg">Canlı Destek</span>

          {/* Chat info - only show if chat ID is present */}
          {currentChatId && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Chat #{currentChatId}</span>
            </div>
          )}
        </div>
      </div>

      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <X className="w-6 h-6" />
      </Button>
    </CardHeader>
  );
}
