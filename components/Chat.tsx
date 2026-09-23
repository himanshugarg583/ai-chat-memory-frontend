'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, ChevronRight, RefreshCw } from 'lucide-react';
import type { Message, UsedMemory, MemoryChange, User } from '@/types';

interface ChatProps {
  user: User;
  messages: Message[];
  onSendMessage: (message: string) => Promise<{
    usedMemories: UsedMemory[];
    memoryChanges: MemoryChange[];
  } | null>;
  onNewSession: () => Promise<void>;
}

interface MessageWithMeta extends Message {
  usedMemories?: UsedMemory[];
  memoryChanges?: MemoryChange[];
}

export default function Chat({ user, messages, onSendMessage, onNewSession }: ChatProps) {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [messagesWithMeta, setMessagesWithMeta] = useState<MessageWithMeta[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize messages without meta, keep existing meta for messages we have
    setMessagesWithMeta(prev => {
      const existingMetaMap = new Map(prev.map(m => [m.id, { usedMemories: m.usedMemories, memoryChanges: m.memoryChanges }]));
      return messages.map(m => ({
        ...m,
        usedMemories: existingMetaMap.get(m.id)?.usedMemories,
        memoryChanges: existingMetaMap.get(m.id)?.memoryChanges,
      }));
    });
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesWithMeta]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = input.trim();
    if (!message || sending) return;

    setInput('');
    setSending(true);

    try {
      const result = await onSendMessage(message);
      if (result) {
        // Update the last assistant message with memory meta
        setMessagesWithMeta(prev => {
          const updated = [...prev];
          const lastAssistantIdx = updated.findLastIndex(m => m.role === 'assistant');
          if (lastAssistantIdx !== -1) {
            updated[lastAssistantIdx] = {
              ...updated[lastAssistantIdx],
              usedMemories: result.usedMemories,
              memoryChanges: result.memoryChanges,
            };
          }
          return updated;
        });
      }
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleNewSession = async () => {
    await onNewSession();
    setMessagesWithMeta([]);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created': return 'text-green-600';
      case 'updated': return 'text-amber-600';
      case 'removed': return 'text-red-600';
      case 'unchanged': return 'text-gray-500';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-primary-600 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">Chat</h2>
          <p className="text-primary-200 text-sm">{user.email}</p>
        </div>
        <button
          onClick={handleNewSession}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          New Session
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messagesWithMeta.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-lg mb-2">Start a conversation</p>
            <p className="text-sm">I&apos;ll remember important details about you</p>
          </div>
        ) : (
          messagesWithMeta.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 animate-fade-in-up ${
                  msg.role === 'user'
                    ? 'bg-primary-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                
                {/* Memory status for user messages */}
                {msg.role === 'user' && msg.memoryStatus && (
                  <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-primary-200' : 'text-gray-500'}`}>
                    Memory: {msg.memoryStatus}
                  </p>
                )}

                {/* Memory details for assistant messages */}
                {msg.role === 'assistant' && (msg.usedMemories?.length || msg.memoryChanges?.length) && (
                  <details className="mt-3 text-sm">
                    <summary className="flex items-center gap-1 text-gray-500 cursor-pointer hover:text-gray-700">
                      <ChevronRight className="w-4 h-4 chevron" />
                      Memory details
                    </summary>
                    <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200 space-y-2">
                      {msg.usedMemories && msg.usedMemories.length > 0 && (
                        <div>
                          <p className="font-medium text-gray-700 text-xs mb-1">Memories used:</p>
                          {msg.usedMemories.map((mem, idx) => (
                            <div key={idx} className="text-xs py-1 border-b border-gray-100 last:border-0">
                              <span className="text-primary-600 font-medium">[{mem.memoryKey}]</span>{' '}
                              <span className="text-gray-600">{mem.content}</span>{' '}
                              <span className="text-gray-400">({(mem.similarity * 100).toFixed(1)}%)</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {msg.memoryChanges && msg.memoryChanges.length > 0 && (
                        <div>
                          <p className="font-medium text-gray-700 text-xs mb-1">Memory changes:</p>
                          {msg.memoryChanges.map((change, idx) => (
                            <div key={idx} className={`text-xs py-1 ${getActionColor(change.action)}`}>
                              {change.action.toUpperCase()}: [{change.memoryKey}] {change.content}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>
            </div>
          ))
        )}

        {/* Typing indicator */}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            maxLength={4000}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex items-center justify-center"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
