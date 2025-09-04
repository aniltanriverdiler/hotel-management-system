import { useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, AlertCircle } from 'lucide-react';

interface ChatInputProps {
  messageContent: string;
  onContentChange: (content: string) => void;
  onSendMessage: (content: string) => Promise<any>;
  canSendMessage: boolean;
  isSending: boolean;
  inputError: string | null;
  onTypingIndicator: (typing: boolean) => void;
}

export default function ChatInput({ 
  messageContent, 
  onContentChange, 
  onSendMessage, 
  canSendMessage, 
  isSending, 
  inputError,
  onTypingIndicator 
}: ChatInputProps) {
  
  // Debug için ChatInput durumunu log'la
  console.log('💬 ChatInput render:', {
    canSendMessage,
    isSending,
    hasContent: messageContent.trim().length > 0,
    inputError,
    inputDisabled: isSending,
    buttonDisabled: isSending || !messageContent.trim()
  });
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 📤 Mesaj gönderme handler
  const handleSendMessage = async () => {
    // Basit kontrol - sadece mesaj içeriği var mı?
    if (!messageContent.trim()) {
      console.warn('⚠️ Boş mesaj gönderilmeye çalışıldı');
      return;
    }
    
    console.log('📤 Mesaj gönderme işlemi başlatılıyor:', messageContent.trim());
    
    try {
      await onSendMessage(messageContent);
      // Input'u focus'la (kullanıcı deneyimi için)
      inputRef.current?.focus();
      console.log('✅ Mesaj başarıyla gönderildi');
    } catch (error) {
      console.error('❌ Mesaj gönderme hatası (ignore ediliyor):', error);
      // Hata olsa da input'u temizle ve focus'la - kullanıcı deneyimi için
      inputRef.current?.focus();
      // Backend hatası da olsa kullanıcıya gösterme - optimistic update zaten mesajı gösterdi
    }
  };

  // ⌨️ Keyboard event handler
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 📝 Input change handler (typing indicator ile)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onContentChange(newValue);
    
    // Typing indicator logic
    if (newValue.length > 0 && messageContent.length === 0) {
      // Yazmaya başladı
      onTypingIndicator(true);
    } else if (newValue.length === 0 && messageContent.length > 0) {
      // Yazmayı bıraktı
      onTypingIndicator(false);
    }
  };

  // 🎯 Input blur handler (typing stop)
  const handleInputBlur = () => {
    onTypingIndicator(false);
  };

  return (
    <div className="p-6 border-t border-border bg-background">
      {/* 🚨 Error message */}
      {inputError && (
        <div className="flex items-center gap-2 p-3 mb-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-sm text-red-700">{inputError}</span>
        </div>
      )}
      
      {/* 💬 Input area */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Input 
            ref={inputRef}
            placeholder={isSending ? "Gönderiliyor..." : "Mesajınızı yazın..."} 
            value={messageContent}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onBlur={handleInputBlur}
            disabled={isSending}
            className={`h-12 text-base pr-4 ${
              inputError ? 'border-red-300 focus:border-red-500' : ''
            }`}
            maxLength={1000} // Mesaj karakter sınırı
          />
          
          {/* 📊 Character counter (uzun mesajlar için) */}
          {messageContent.length > 800 && (
            <div className={`absolute -top-6 right-0 text-xs ${
              messageContent.length > 950 ? 'text-red-500' : 'text-muted-foreground'
            }`}>
              {messageContent.length}/1000
            </div>
          )}
        </div>
        
        {/* 📤 Send button */}
        <Button
          onClick={handleSendMessage}
          disabled={isSending || !messageContent.trim()}
          className="h-12 px-4 min-w-[100px] bg-black hover:bg-gray-800 text-white transition-all duration-200 disabled:bg-gray-400 disabled:text-gray-600"
        >
          {isSending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span>Gönderiliyor...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              <span>Gönder</span>
            </>
          )}
        </Button>
      </div>
      
      {/* 💡 Helper text */}
      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
        <span>Enter ile gönder, Shift+Enter ile yeni satır</span>
        {isSending && (
          <span className="text-orange-500">
            ⏳ Gönderiliyor...
          </span>
        )}
      </div>
    </div>
  );
}
