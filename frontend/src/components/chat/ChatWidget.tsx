"use client";

import { useState, useEffect } from 'react';
import ChatButton from '@/components/chat/ChatButton';
import ChatWindow from '@/components/chat/ChatWindow';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Sayfa yüklendiğinde tooltip'i göster
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000); // 3 saniye sonra tooltip beliriyor

    // 10 saniye sonra tooltip'i gizle
    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 13000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip Mesajı */}
      {showTooltip && !open && (
        <div className="absolute bottom-20 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 mb-2 max-w-xs animate-pulse transform transition-all duration-500 ease-in-out">
          <div className="text-sm text-gray-700 font-medium">
            💬 Herhangi bir sorunuz veya ihtiyaç durumunda bize ulaşabilirsiniz!
          </div>
          <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
          <button 
            onClick={() => setShowTooltip(false)}
            className="absolute top-1 right-2 text-gray-400 hover:text-gray-600 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {open ? (
        <ChatWindow onClose={() => setOpen(false)} />
      ) : (
        <ChatButton onClick={() => setOpen(true)} />
      )}
    </div>
  );
}
