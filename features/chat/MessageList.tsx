'use client';

import { useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';
import MessageItem from './MessageItem';
import type { Message } from '@/types';

const STARTER_PROMPTS = [
  'Tell me about yourself',
  'What can you remember?',
  'Help me with a task',
];

interface MessageListProps {
  messages: Message[];
  sending: boolean;
  onStarterClick: (prompt: string) => void;
}

export default function MessageList({ messages, sending, onStarterClick }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full blur-2xl opacity-20 scale-150"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
              <Bot className="w-12 h-12 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Hello! How can I help?</h3>
          <p className="text-gray-500 text-center max-w-sm leading-relaxed">
            I&apos;m your AI assistant with memory. I&apos;ll remember important details from our conversations to personalize your experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-2 justify-center max-w-md">
            {STARTER_PROMPTS.map(prompt => (
              <button
                key={prompt}
                onClick={() => onStarterClick(prompt)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="space-y-6 max-w-4xl mx-auto">
        {messages.map(msg => (
          <MessageItem key={msg.id} message={msg} />
        ))}
      </div>

      {sending && (
        <div className="flex gap-4 animate-fade-in-up max-w-4xl mx-auto mt-6">
          <div className="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="bg-white rounded-2xl rounded-tl-md px-5 py-4 shadow-soft border border-gray-100">
            <div className="flex gap-2 items-center">
              <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full typing-dot"></span>
              <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full typing-dot"></span>
              <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full typing-dot"></span>
            </div>
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}
