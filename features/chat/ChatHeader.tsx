'use client';

import { MessageSquare, RefreshCw } from 'lucide-react';

interface ChatHeaderProps {
  onNewSession: () => void;
}

export default function ChatHeader({ onNewSession }: ChatHeaderProps) {
  return (
    <div className="px-6 py-5 border-b border-gray-100/80 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-gray-900">AI Assistant</h2>
            <p className="text-gray-500 text-sm flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Memory-powered conversations
            </p>
          </div>
        </div>
        <button
          onClick={onNewSession}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all text-sm font-medium text-gray-700 btn-lift"
        >
          <RefreshCw className="w-4 h-4" />
          New Chat
        </button>
      </div>
    </div>
  );
}
