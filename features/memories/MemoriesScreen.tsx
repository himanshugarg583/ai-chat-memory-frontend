'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, Brain, AlertTriangle, X } from 'lucide-react';
import { useMemories } from '@/hooks/useMemories';
import ErrorBanner from '@/components/ui/ErrorBanner';
import MemoryList from './MemoryList';
import MemoryForm from './MemoryForm';
import ConflictDialog from './ConflictDialog';
import type { Memory } from '@/types';

interface MemoriesScreenProps {
  refreshKey: number;
}

export default function MemoriesScreen({ refreshKey }: MemoriesScreenProps) {
  const {
    memories, filter, loading, error, conflict,
    loadMemories, setFilter, addMemory, replaceMemory, dismissConflict, updateMemory, deleteMemory, clearError,
  } = useMemories();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [replacing, setReplacing] = useState(false);

  useEffect(() => { loadMemories(); }, [loadMemories]);
  useEffect(() => { if (refreshKey > 0) loadMemories(); }, [refreshKey, loadMemories]);

  const activeCount = memories.filter(m => m.status === 'active').length;
  const displayMemories = filter === 'active' ? memories.filter(m => m.status === 'active') : memories;
  const isDuplicateError = error?.includes('DUPLICATE') || error?.includes('duplicate');

  function startEdit(memory: Memory) { setEditingId(memory.id); setEditContent(memory.content); }
  function cancelEdit() { setEditingId(null); setEditContent(''); }
  async function saveEdit(id: string) { if (editContent.trim() && await updateMemory(id, editContent.trim())) cancelEdit(); }
  async function handleDelete(id: string) { if (window.confirm('Delete this memory?')) await deleteMemory(id); }
  async function handleReplace() { setReplacing(true); try { await replaceMemory(); } finally { setReplacing(false); } }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white relative">
      {error && !isDuplicateError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
          <ErrorBanner message={error} onDismiss={clearError} />
        </div>
      )}

      {isDuplicateError && (
        <div className="absolute top-4 left-4 right-4 z-50 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-amber-800 font-medium">Duplicate memory detected</p>
              <p className="text-xs text-amber-600 mt-1">This memory is too similar to an existing one.</p>
            </div>
            <button onClick={clearError} className="p-1 hover:bg-amber-100 rounded-lg"><X className="w-4 h-4 text-amber-500" /></button>
          </div>
        </div>
      )}

      {conflict && <ConflictDialog existing={conflict.existing} onReplace={handleReplace} onDismiss={dismissConflict} replacing={replacing} />}

      {/* Header */}
      <div className="px-5 py-5 border-b border-gray-100/80 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-900">Memories</h2>
              <p className="text-gray-500 text-xs">{filter === 'active' ? activeCount : `${activeCount} active / ${memories.length} total`}</p>
            </div>
          </div>
          <button onClick={loadMemories} disabled={loading} className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-gray-700">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          <button onClick={() => setFilter('active')} className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${filter === 'active' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Active</button>
          <button onClick={() => setFilter('all')} className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>All</button>
        </div>
      </div>

      <MemoryList
        memories={displayMemories}
        editingId={editingId}
        editContent={editContent}
        onStartEdit={startEdit}
        onCancelEdit={cancelEdit}
        onSaveEdit={saveEdit}
        onEditChange={setEditContent}
        onDelete={handleDelete}
      />

      <MemoryForm onAdd={addMemory} />
    </div>
  );
}

