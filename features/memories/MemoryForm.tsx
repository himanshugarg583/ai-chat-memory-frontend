'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';
import { MEMORY_CATEGORIES } from '@/lib/constants';

interface MemoryFormProps {
  onAdd: (content: string, category: string) => Promise<boolean>;
}

export default function MemoryForm({ onAdd }: MemoryFormProps) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [adding, setAdding] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setAdding(true);
    try {
      if (await onAdd(content.trim(), category)) {
        setContent('');
      }
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="p-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm space-y-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Add a new memory..."
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm"
        />
        <div className="flex gap-2">
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none appearance-none cursor-pointer"
          >
            {MEMORY_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={adding || !content.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-all flex items-center gap-2 text-sm font-medium shadow-md shadow-emerald-500/20 disabled:shadow-none"
          >
            {adding ? <Spinner size="sm" /> : <Plus className="w-4 h-4" />}
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
