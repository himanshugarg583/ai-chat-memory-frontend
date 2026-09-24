'use client';

import type { Memory } from '@/types';
import MemoryItem from './MemoryItem';
import EmptyState from './EmptyState';

interface MemoryListProps {
  memories: Memory[];
  editingId: string | null;
  editContent: string;
  onStartEdit: (memory: Memory) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: string) => void;
  onEditChange: (content: string) => void;
  onDelete: (id: string) => void;
}

export default function MemoryList({
  memories,
  editingId,
  editContent,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onEditChange,
  onDelete,
}: MemoryListProps) {
  if (memories.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {memories.map(memory => (
        <MemoryItem
          key={memory.id}
          memory={memory}
          editingId={editingId}
          editContent={editContent}
          onStartEdit={onStartEdit}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
          onEditChange={onEditChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
