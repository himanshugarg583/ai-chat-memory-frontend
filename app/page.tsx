'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { User, Message, Memory, UsedMemory, MemoryChange } from '@/types';
import LoginModal from '@/components/LoginModal';
import Chat from '@/components/Chat';
import MemoryPanel from '@/components/MemoryPanel';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [memoryFilter, setMemoryFilter] = useState<'active' | 'all'>('active');
  const [error, setError] = useState<string | null>(null);

  // Load messages
  const loadMessages = useCallback(async () => {
    if (!user) return;
    try {
      const data = await api.getMessages();
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  }, [user]);

  // Load memories
  const loadMemories = useCallback(async () => {
    if (!user) return;
    try {
      const data = await api.getMemories(memoryFilter);
      setMemories(data.memories || []);
    } catch (err) {
      console.error('Failed to load memories:', err);
    }
  }, [user, memoryFilter]);

  // Initial load
  useEffect(() => {
    if (user) {
      loadMessages();
      loadMemories();
    }
  }, [user, loadMessages, loadMemories]);

  // Handle login
  const handleLogin = async (email: string, name?: string) => {
    const data = await api.login(email, name);
    setUser(data.user);
  };

  // Handle new session
  const handleNewSession = async () => {
    const data = await api.newSession();
    setUser(data.user);
    setMessages([]);
  };

  // Handle send message
  const handleSendMessage = async (message: string): Promise<{
    usedMemories: UsedMemory[];
    memoryChanges: MemoryChange[];
  } | null> => {
    try {
      setError(null);
      const data = await api.sendMessage(message);
      await loadMessages();
      
      // Refresh memories if there were changes
      const realChanges = data.memoryChanges.filter(
        c => !['unchanged', 'skipped_duplicate'].includes(c.action)
      );
      if (realChanges.length > 0) {
        await loadMemories();
      }
      
      return {
        usedMemories: data.usedMemories,
        memoryChanges: data.memoryChanges,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send message';
      setError(message);
      await loadMessages();
      return null;
    }
  };

  // Handle add memory
  const handleAddMemory = async (content: string, category: string) => {
    try {
      setError(null);
      await api.createMemory(content, category);
      await loadMemories();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add memory';
      setError(message);
    }
  };

  // Handle update memory
  const handleUpdateMemory = async (id: string, content: string) => {
    try {
      setError(null);
      await api.updateMemory(id, { content });
      await loadMemories();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update memory';
      setError(message);
    }
  };

  // Handle delete memory
  const handleDeleteMemory = async (id: string) => {
    try {
      setError(null);
      await api.deleteMemory(id);
      await loadMemories();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete memory';
      setError(message);
    }
  };

  // Handle filter change
  const handleFilterChange = (filter: 'active' | 'all') => {
    setMemoryFilter(filter);
  };

  return (
    <main className="h-screen flex flex-col">
      {/* Login Modal */}
      {!user && <LoginModal onLogin={handleLogin} />}

      {/* Error toast */}
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in-up">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 text-white/80 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Main content */}
      {user && (
        <div className="flex-1 flex gap-4 p-4 max-w-7xl mx-auto w-full">
          {/* Chat Panel */}
          <div className="flex-[2] bg-white rounded-2xl shadow-lg overflow-hidden">
            <Chat
              user={user}
              messages={messages}
              onSendMessage={handleSendMessage}
              onNewSession={handleNewSession}
            />
          </div>

          {/* Memory Panel */}
          <div className="flex-1 min-w-[320px] bg-white rounded-2xl shadow-lg overflow-hidden">
            <MemoryPanel
              memories={memories}
              filter={memoryFilter}
              onFilterChange={handleFilterChange}
              onRefresh={loadMemories}
              onAdd={handleAddMemory}
              onUpdate={handleUpdateMemory}
              onDelete={handleDeleteMemory}
            />
          </div>
        </div>
      )}
    </main>
  );
}
