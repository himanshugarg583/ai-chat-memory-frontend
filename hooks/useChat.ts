'use client';

import { useState, useCallback, useRef } from 'react';
import { api } from '@/lib/api';
import type { Message, UsedMemory, MemoryChange } from '@/types';

interface MessageWithMeta extends Message {
  usedMemories?: UsedMemory[];
  memoryChanges?: MemoryChange[];
}

interface SendMessageResult {
  assistantMessageId: string;
  usedMemories: UsedMemory[];
  memoryChanges: MemoryChange[];
}

interface UseChatReturn {
  messages: MessageWithMeta[];
  sending: boolean;
  error: string | null;
  loadMessages: () => Promise<void>;
  sendMessage: (content: string) => Promise<SendMessageResult | null>;
  clearMessages: () => void;
  clearError: () => void;
  retryLastMessage: () => Promise<SendMessageResult | null>;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<MessageWithMeta[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastMessageRef = useRef<string | null>(null);

  const loadMessages = useCallback(async () => {
    try {
      const data = await api.getMessages();
      setMessages((data.messages || []).map(m => ({ ...m })));
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  }, []);

  const sendMessage = useCallback(async (content: string): Promise<SendMessageResult | null> => {
    lastMessageRef.current = content;
    setSending(true);
    setError(null);

    try {
      const data = await api.sendMessage(content);
      await loadMessages();

      // Attach meta to the assistant message by ID
      if (data.assistantMessage) {
        setMessages(prev => prev.map(m => 
          m.id === data.assistantMessage!.id
            ? { ...m, usedMemories: data.usedMemories, memoryChanges: data.memoryChanges }
            : m
        ));

        return {
          assistantMessageId: data.assistantMessage.id,
          usedMemories: data.usedMemories,
          memoryChanges: data.memoryChanges,
        };
      }

      return null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send message';
      setError(message);
      await loadMessages();
      return null;
    } finally {
      setSending(false);
    }
  }, [loadMessages]);

  const retryLastMessage = useCallback(async (): Promise<SendMessageResult | null> => {
    if (!lastMessageRef.current) return null;
    return sendMessage(lastMessageRef.current);
  }, [sendMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    lastMessageRef.current = null;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    sending,
    error,
    loadMessages,
    sendMessage,
    clearMessages,
    clearError,
    retryLastMessage,
  };
}
