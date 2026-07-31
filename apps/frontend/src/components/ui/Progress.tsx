'use client';

import React from 'react';
import { clsx } from 'clsx';

interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'indigo' | 'emerald' | 'cyan' | 'amber' | 'rose';
  className?: string;
}

const colorClasses = {
  indigo: 'bg-blue-600 shadow-blue-500/30',
  emerald: 'bg-emerald-600 shadow-emerald-500/30',
  cyan: 'bg-sky-500 shadow-sky-500/30',
  amber: 'bg-amber-500 shadow-amber-500/30',
  rose: 'bg-rose-500 shadow-rose-500/30',
};

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  color = 'indigo',
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className={clsx('w-full flex flex-col gap-1.5', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs font-bold">
          {label && <span className="text-slate-600">{label}</span>}
          {showValue && <span className="text-slate-900">{percentage}%</span>}
        </div>
      )}
      <div className={clsx('w-full bg-slate-100 border border-slate-200 rounded-full overflow-hidden p-0.5', sizeClasses[size])}>
        <div
          className={clsx('h-full rounded-full transition-all duration-500 shadow-sm', colorClasses[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
