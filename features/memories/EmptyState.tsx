'use client';

import { Brain } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12">
      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4">
        <Brain className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-gray-600 font-medium mb-1">No memories yet</p>
      <p className="text-sm text-gray-400 text-center px-4">Chat with AI to start building your memory bank</p>
    </div>
  );
}
