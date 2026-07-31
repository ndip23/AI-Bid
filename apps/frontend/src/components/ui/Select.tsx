'use client';

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, hint, fullWidth = true, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={clsx('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={selectId} className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={clsx(
              'w-full bg-white border text-sm text-slate-900 rounded-xl px-3.5 py-2.5 appearance-none pr-9 transition-all duration-200 shadow-sm font-medium',
              'focus:outline-none focus:ring-2 focus:border-blue-600',
              error
                ? 'border-rose-300 focus:ring-rose-500/20'
                : 'border-slate-200 hover:border-slate-300 focus:ring-blue-500/20',
              className,
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-white text-slate-900 font-medium">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {error && <p className="text-xs text-rose-600 font-medium flex items-center gap-1">⚠ {error}</p>}
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';
