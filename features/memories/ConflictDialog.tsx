'use client';

import { AlertTriangle, X, RefreshCw } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';
import type { ConflictingMemory } from '@/types';

interface ConflictDialogProps {
  existing: ConflictingMemory;
  onReplace: () => void;
  onDismiss: () => void;
  replacing?: boolean;
}

export default function ConflictDialog({
  existing,
  onReplace,
  onDismiss,
  replacing = false,
}: ConflictDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-fade-in-up">
        <div className="bg-amber-50 px-6 py-4 border-b border-amber-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Memory Conflict</h3>
              <p className="text-sm text-gray-500">A similar memory already exists</p>
            </div>
            <button
              onClick={onDismiss}
              className="ml-auto p-1 hover:bg-amber-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-medium text-gray-500 mb-2">Existing Memory</p>
            <p className="font-mono text-sm text-indigo-600 mb-1">{existing.memoryKey}</p>
            <p className="text-sm text-gray-700">{existing.content}</p>
            <p className="text-xs text-gray-400 mt-2">
              Similarity: {(existing.similarity * 100).toFixed(1)}%
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onDismiss}
              disabled={replacing}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onReplace}
              disabled={replacing}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl text-sm font-medium text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {replacing ? <Spinner size="sm" /> : <RefreshCw className="w-4 h-4" />}
              Replace It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
