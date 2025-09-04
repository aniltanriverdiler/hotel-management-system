import { Button } from "@/components/ui/button";
import { MessageCircle } from 'lucide-react';

interface ChatButtonProps {
  onClick: () => void;
}

export default function ChatButton({ onClick }: ChatButtonProps) {
  return (
    <div className="relative">
      <Button
        variant="default"
        size="lg"
        className="rounded-full p-6 shadow-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50 hover:shadow-2xl"
        onClick={onClick}
      >
        <MessageCircle className="w-10 h-10" />
      </Button>
      {/* Bildirim Badge'i */}
      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
        1
      </div>
    </div>
  );
}
