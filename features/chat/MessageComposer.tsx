'use client';

import { useRef, useEffect } from 'react';
import Spinner from '@/components/ui/Spinner';
import { TEXTAREA_MAX_HEIGHT, MESSAGE_MAX_LENGTH } from '@/lib/constants';

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  sending: boolean;
}

export default function MessageComposer({ value, onChange, onSubmit, sending }: MessageComposerProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = 'auto';
    inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
  }, [value]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim() || sending) return;
    onSubmit();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <div className="p-5 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex gap-3 items-end p-2 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-indigo-300 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-indigo-500/5 transition-all">
          <textarea
            ref={inputRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            maxLength={MESSAGE_MAX_LENGTH}
            rows={1}
            className="flex-1 px-4 py-3 bg-transparent outline-none resize-none text-gray-800 placeholder-gray-400"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !value.trim()}
            className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-all flex items-center justify-center shadow-lg shadow-indigo-500/25 disabled:shadow-none btn-lift"
          >
            {sending ? <Spinner size="md" className="text-white" /> : <SendIcon />}
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-3">Press Enter to send · Shift+Enter for new line</p>
      </form>
    </div>
  );
}

function SendIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}
