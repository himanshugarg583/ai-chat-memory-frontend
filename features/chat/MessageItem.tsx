'use client';

import { Bot, User, ChevronRight, Sparkles } from 'lucide-react';
import { ACTION_STYLES } from '@/lib/constants';
import { formatTime, formatSimilarity } from '@/lib/format';
import type { Message } from '@/types';

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const { role, content, createdAt, memoryStatus, usedMemories, memoryChanges } = message;
  const hasMemoryActivity = (usedMemories?.length ?? 0) > 0 || (memoryChanges?.length ?? 0) > 0;

  function getActionStyle(action: string) {
    return ACTION_STYLES[action] || 'text-gray-600 bg-gray-50';
  }

  return (
    <div className={`flex gap-4 ${role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in-up`}>
      <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-md ${
        role === 'user' 
          ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
          : 'bg-gradient-to-br from-emerald-400 to-teal-500'
      }`}>
        {role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
      </div>

      <div className={`max-w-[75%] ${role === 'user' ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-5 py-3.5 ${
            role === 'user'
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-md shadow-lg shadow-indigo-500/20'
              : 'bg-white text-gray-700 rounded-tl-md shadow-soft border border-gray-100'
          }`}
        >
          <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
          
          {role === 'user' && memoryStatus && (
            <p className="text-xs mt-3 text-white/70 flex items-center gap-1.5 pt-2 border-t border-white/20">
              <Sparkles className="w-3 h-3" />
              {memoryStatus}
            </p>
          )}

          {role === 'assistant' && hasMemoryActivity && (
            <details className="mt-4 text-sm">
              <summary className="flex items-center gap-1.5 text-gray-400 cursor-pointer hover:text-indigo-600 transition-colors py-1">
                <ChevronRight className="w-4 h-4 details-chevron" />
                <span className="text-xs font-medium">Memory activity</span>
              </summary>
              <div className="mt-3 p-4 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl space-y-4 border border-gray-100">
                {usedMemories && usedMemories.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-700 text-xs mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      Memories Referenced
                    </p>
                    <div className="space-y-2">
                      {usedMemories.map((mem, idx) => (
                        <div key={idx} className="text-xs py-2.5 px-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-indigo-600 font-semibold">{mem.memoryKey}</span>
                            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-medium">
                              {formatSimilarity(mem.similarity)}
                            </span>
                          </div>
                          <span className="text-gray-600">{mem.content}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {memoryChanges && memoryChanges.filter(c => c.action !== 'unchanged').length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-700 text-xs mb-2">Memory Updates</p>
                    <div className="space-y-1.5">
                      {memoryChanges.filter(c => c.action !== 'unchanged').map((change, idx) => (
                        <div key={idx} className={`text-xs py-2 px-3 rounded-lg ${getActionStyle(change.action)}`}>
                          <span className="font-bold uppercase">{change.action}</span>
                          <span className="mx-1.5">·</span>
                          <span className="font-medium">{change.memoryKey}</span>
                          {change.content && <span className="opacity-80 ml-1.5">— {change.content}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
        <p className={`text-[11px] text-gray-400 mt-2 ${role === 'user' ? 'text-right' : 'text-left'} px-1`}>
          {formatTime(createdAt)}
        </p>
      </div>
    </div>
  );
}
