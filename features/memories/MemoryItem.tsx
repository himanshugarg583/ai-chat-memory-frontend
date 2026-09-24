'use client';

import { Pencil, Trash2, Check, X } from 'lucide-react';
import { CATEGORY_STYLES } from '@/lib/constants';
import type { Memory } from '@/types';

interface MemoryItemProps {
  memory: Memory;
  editingId: string | null;
  editContent: string;
  onStartEdit: (memory: Memory) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: string) => void;
  onEditChange: (content: string) => void;
  onDelete: (id: string) => void;
}

export default function MemoryItem({
  memory,
  editingId,
  editContent,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onEditChange,
  onDelete,
}: MemoryItemProps) {
  const isEditing = editingId === memory.id;

  function getCategoryStyle(category: string) {
    return CATEGORY_STYLES[category] || CATEGORY_STYLES.general;
  }

  return (
    <div
      className={`memory-card p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md ${
        memory.status === 'superseded' ? 'opacity-60' : ''
      }`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editContent}
            onChange={e => onEditChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-indigo-50/50"
            autoFocus
            onKeyDown={e => {
              if (e.key === 'Enter') onSaveEdit(memory.id);
              if (e.key === 'Escape') onCancelEdit();
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={() => onSaveEdit(memory.id)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
            >
              <Check className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={onCancelEdit}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="text-indigo-600 font-semibold text-sm">{memory.memoryKey}</span>
            <span className={`text-[10px] px-2 py-1 rounded-lg font-medium border ${getCategoryStyle(memory.category)}`}>
              {memory.category}
            </span>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">{memory.content}</p>
          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${memory.source === 'auto' ? 'bg-indigo-400' : 'bg-emerald-400'}`}></span>
              {memory.source === 'auto' ? 'AI generated' : 'Manual'}
              {memory.status === 'superseded' && <span className="text-amber-500">· superseded</span>}
            </span>
            {memory.status === 'active' && (
              <div className="flex gap-1">
                <button
                  onClick={() => onStartEdit(memory)}
                  className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  title="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(memory.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

