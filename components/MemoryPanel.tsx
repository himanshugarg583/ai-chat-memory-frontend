'use client';

import { useState } from 'react';
import { RefreshCw, Plus, Pencil, Trash2, X, Check, Brain } from 'lucide-react';
import type { Memory } from '@/types';

interface MemoryPanelProps {
  memories: Memory[];
  filter: 'active' | 'all';
  onFilterChange: (filter: 'active' | 'all') => void;
  onRefresh: () => Promise<void>;
  onAdd: (content: string, category: string) => Promise<void>;
  onUpdate: (id: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function MemoryPanel({
  memories,
  filter,
  onFilterChange,
  onRefresh,
  onAdd,
  onUpdate,
  onDelete,
}: MemoryPanelProps) {
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const activeCount = memories.filter(m => m.status === 'active').length;
  const displayMemories = filter === 'active' 
    ? memories.filter(m => m.status === 'active')
    : memories;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    
    setAdding(true);
    try {
      await onAdd(newContent.trim(), newCategory);
      setNewContent('');
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (memory: Memory) => {
    setEditingId(memory.id);
    setEditContent(memory.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const saveEdit = async (id: string) => {
    if (!editContent.trim()) return;
    await onUpdate(id, editContent.trim());
    cancelEdit();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this memory?')) {
      await onDelete(id);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personal': return 'bg-purple-100 text-purple-700';
      case 'technical': return 'bg-blue-100 text-blue-700';
      case 'preference': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-primary-600 text-white px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            <h2 className="font-semibold text-lg">Memories</h2>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">
              {filter === 'active' ? activeCount : `${activeCount}/${memories.length}`}
            </span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Filter toggle */}
        <div className="flex gap-1 bg-white/10 rounded-lg p-1">
          <button
            onClick={() => onFilterChange('active')}
            className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-colors ${
              filter === 'active' ? 'bg-white text-primary-600' : 'text-white/80 hover:text-white'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => onFilterChange('all')}
            className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-white text-primary-600' : 'text-white/80 hover:text-white'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* Memory list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {displayMemories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Brain className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-center">No memories yet</p>
            <p className="text-sm text-center">Chat to start building memories</p>
          </div>
        ) : (
          displayMemories.map((memory) => (
            <div
              key={memory.id}
              className={`memory-card p-4 bg-white rounded-xl border border-gray-200 ${
                memory.status === 'superseded' ? 'opacity-50' : ''
              }`}
            >
              {editingId === memory.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(memory.id);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(memory.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-primary-600 font-semibold text-sm">
                      {memory.memoryKey}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(memory.category)}`}>
                      {memory.category}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{memory.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {memory.source}
                      {memory.status === 'superseded' && ' · superseded'}
                    </span>
                    {memory.status === 'active' && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEdit(memory)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(memory.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add memory form */}
      <form onSubmit={handleAdd} className="p-4 border-t border-gray-200 bg-white space-y-3">
        <input
          type="text"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Add a new memory..."
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
        />
        <div className="flex gap-2">
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          >
            <option value="general">General</option>
            <option value="personal">Personal</option>
            <option value="technical">Technical</option>
            <option value="preference">Preference</option>
          </select>
          <button
            type="submit"
            disabled={adding || !newContent.trim()}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
