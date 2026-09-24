'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { ChatScreen } from '@/features/chat';
import { MemoriesScreen } from '@/features/memories';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [ready, setReady] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const sessionStarted = useRef(false);

  // Auto-start anonymous session
  useEffect(() => {
    if (sessionStarted.current) return;
    sessionStarted.current = true;
    api.startSession()
      .then(() => setReady(true))
      .catch((err) => {
        console.error('Failed to start session:', err);
        setReady(true); // proceed anyway, hooks will show error
      });
  }, []);

  const handleNewSession = async () => {
    await api.newSession();
    setRefreshKey(k => k + 1);
  };

  const handleMemoriesChanged = () => {
    setRefreshKey(k => k + 1);
  };

  if (!ready) {
    return (
      <main className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-white/30 rounded-2xl animate-pulse-slow"></div>
            <div className="absolute inset-2 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          </div>
          <p className="text-white/90 font-medium">Starting your session...</p>
          <p className="text-white/60 text-sm mt-1">This won&apos;t take long</p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen flex flex-col p-4 md:p-6">
      <div className="flex-1 flex gap-5 max-w-[1600px] mx-auto w-full h-full">
        <div className="flex-[2.5] glass rounded-3xl shadow-glow overflow-hidden animate-fade-in">
          <ChatScreen onNewSession={handleNewSession} onMemoriesChanged={handleMemoriesChanged} />
        </div>
        <div className="flex-1 min-w-[350px] max-w-[400px] glass rounded-3xl shadow-glow-sm overflow-hidden animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <MemoriesScreen refreshKey={refreshKey} />
        </div>
      </div>
    </main>
  );
}
