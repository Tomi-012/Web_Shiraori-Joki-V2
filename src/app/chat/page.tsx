'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import ChatInterface from '@/components/ChatInterface';
import MobileChatInterface from '@/components/mobile/MobileChatInterface';

export default function ChatPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <main className="min-h-screen bg-gray-50 mobile-full-height">
      {isMobile ? <MobileChatInterface /> : <ChatInterface />}
    </main>
  );
}