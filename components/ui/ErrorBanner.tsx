'use client';

import { AlertCircle, X, RefreshCw } from 'lucide-react';
import Button from './Button';

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorBanner({ message, onDismiss, onRetry, className = '' }: ErrorBannerProps) {
  return (
    <div className={`bg-white text-red-600 px-6 py-4 rounded-2xl shadow-soft animate-fade-in-up flex items-center gap-3 border border-red-100 ${className}`}>
      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
        <AlertCircle className="w-4 h-4 text-red-500" />
      </div>
      <span className="font-medium flex-1">{message}</span>
      {onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry} icon={<RefreshCw className="w-4 h-4" />}>
          Retry
        </Button>
      )}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-red-50 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-red-400" />
        </button>
      )}
    </div>
  );
}
