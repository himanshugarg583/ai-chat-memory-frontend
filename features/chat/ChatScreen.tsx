'use client';

import { useEffect, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import ErrorBanner from '@/components/ui/ErrorBanner';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageComposer from './MessageComposer';
import type { MemoryChange } from '@/types';

interface ChatScreenProps {
  onNewSession: () => Promise<void>;
  onMemoriesChanged: () => void;
}

export default function ChatScreen({ onNewSession, onMemoriesChanged }: ChatScreenProps) {
  const { messages, sending, error, loadMessages, sendMessage, clearError, retryLastMessage } = useChat();
  const [input, setInput] = useState('');

  useEffect(() => { loadMessages(); }, [loadMessages]);

  function hasRealChanges(changes?: MemoryChange[]) {
    return changes?.some(c => !['unchanged', 'skipped_duplicate'].includes(c.action)) ?? false;
  }

  async function handleSubmit() {
    const message = input.trim();
    if (!message || sending) return;
    setInput('');
    const result = await sendMessage(message);
    if (hasRealChanges(result?.memoryChanges)) onMemoriesChanged();
  }

  async function handleRetry() {
    clearError();
    const result = await retryLastMessage();
    if (hasRealChanges(result?.memoryChanges)) onMemoriesChanged();
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white">
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
          <ErrorBanner message={error} onDismiss={clearError} onRetry={handleRetry} />
        </div>
      )}

      <ChatHeader onNewSession={onNewSession} />

      <MessageList
        messages={messages}
        sending={sending}
        onStarterClick={setInput}
      />

      <MessageComposer
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        sending={sending}
      />
    </div>
  );
}
