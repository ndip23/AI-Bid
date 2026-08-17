'use client';

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, fullWidth = true, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={clsx('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full bg-white border text-sm text-slate-900 placeholder:text-slate-400 rounded-xl px-3.5 py-2.5 transition-all duration-200 shadow-sm',
              'focus:outline-none focus:ring-2 focus:border-emerald-600',
              error
                ? 'border-rose-300 focus:ring-rose-500/20'
                : 'border-slate-200 hover:border-slate-300 focus:ring-blue-500/20',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              className,
            )}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3 text-slate-400 pointer-events-none flex items-center">
              {rightIcon}
            </span>
          )}
        </div>

        {error && <p className="text-xs text-rose-600 font-medium flex items-center gap-1">⚠ {error}</p>}
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
