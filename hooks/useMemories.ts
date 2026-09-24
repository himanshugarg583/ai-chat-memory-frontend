'use client';

import { useState, useCallback } from 'react';
import { api, MemoryConflictError } from '@/lib/api';
import type { Memory, ConflictingMemory } from '@/types';

interface MemoryConflict {
  content: string;
  category: string;
  existing: ConflictingMemory;
}

interface UseMemoriesReturn {
  memories: Memory[];
  filter: 'active' | 'all';
  loading: boolean;
  error: string | null;
  conflict: MemoryConflict | null;
  loadMemories: () => Promise<void>;
  setFilter: (filter: 'active' | 'all') => void;
  addMemory: (content: string, category: string) => Promise<boolean>;
  replaceMemory: () => Promise<boolean>;
  dismissConflict: () => void;
  updateMemory: (id: string, content: string) => Promise<boolean>;
  deleteMemory: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export function useMemories(): UseMemoriesReturn {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [filter, setFilter] = useState<'active' | 'all'>('active');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflict, setConflict] = useState<MemoryConflict | null>(null);

  const loadMemories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getMemories(filter);
      setMemories(data.memories || []);
    } catch (err) {
      console.error('Failed to load memories:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const addMemory = useCallback(async (content: string, category: string): Promise<boolean> => {
    setError(null);
    setConflict(null);
    try {
      await api.createMemory(content, category);
      await loadMemories();
      return true;
    } catch (err) {
      if (err instanceof MemoryConflictError) {
        setConflict({ content, category, existing: err.existing });
        return false;
      }
      const message = err instanceof Error ? err.message : 'Failed to add memory';
      setError(message);
      return false;
    }
  }, [loadMemories]);

  const replaceMemory = useCallback(async (): Promise<boolean> => {
    if (!conflict) return false;
    setError(null);
    try {
      await api.createMemory(conflict.content, conflict.category, undefined, conflict.existing.id);
      setConflict(null);
      await loadMemories();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to replace memory';
      setError(message);
      return false;
    }
  }, [conflict, loadMemories]);

  const dismissConflict = useCallback(() => {
    setConflict(null);
  }, []);

  const updateMemory = useCallback(async (id: string, content: string): Promise<boolean> => {
    setError(null);
    try {
      await api.updateMemory(id, { content });
      await loadMemories();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update memory';
      setError(message);
      return false;
    }
  }, [loadMemories]);

  const deleteMemory = useCallback(async (id: string): Promise<boolean> => {
    setError(null);
    try {
      await api.deleteMemory(id);
      await loadMemories();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete memory';
      setError(message);
      return false;
    }
  }, [loadMemories]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    memories,
    filter,
    loading,
    error,
    conflict,
    loadMemories,
    setFilter,
    addMemory,
    replaceMemory,
    dismissConflict,
    updateMemory,
    deleteMemory,
    clearError,
  };
}
