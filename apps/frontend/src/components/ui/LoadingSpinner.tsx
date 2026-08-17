'use client';

import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 p-4 ${className}`}>
      <div className="relative">
        <Loader2 className={`${sizeMap[size]} text-emerald-600 animate-spin`} />
        {size === 'lg' && (
          <Sparkles className="w-4 h-4 text-sky-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        )}
      </div>
      {text && (
        <p className="text-xs font-bold text-slate-500 animate-pulse tracking-wide">
          {text}
        </p>
      )}
    </div>
  );
};
