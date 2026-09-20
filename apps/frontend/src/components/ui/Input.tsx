'use client';

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={clsx('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-bold text-slate-700 tracking-wide"
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
              'w-full rounded-xl border bg-white px-3 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                : 'border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-emerald-100',
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

        {error && (
          <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
