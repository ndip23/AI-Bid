'use client';

import React, { createContext, useContext, useCallback } from 'react';
import hotToast, { Toaster, ToastOptions } from 'react-hot-toast';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastContextType {
  toast: {
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
  };
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const triggerHotToast = useCallback((type: ToastType, title: string, message?: string) => {
    hotToast.custom(
      (t) => (
        <div
          className={`flex items-start space-x-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-md transition-all duration-300 transform ${
            t.visible ? 'animate-enter scale-100 opacity-100' : 'animate-leave scale-95 opacity-0'
          } ${
            type === 'success'
              ? 'bg-white border-emerald-200 text-emerald-950'
              : type === 'error'
              ? 'bg-white border-rose-200 text-rose-950'
              : type === 'warning'
              ? 'bg-white border-amber-200 text-amber-950'
              : 'bg-white border-emerald-200 text-slate-900'
          } max-w-sm w-full font-sans`}
        >
          {/* Icon */}
          <div className="shrink-0 mt-0.5">
            {type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            {type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600" />}
            {type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
            {type === 'info' && <Info className="w-5 h-5 text-emerald-600" />}
          </div>

          {/* Text Content */}
          <div className="flex-1 space-y-0.5">
            <h4 className="text-xs font-black tracking-tight text-slate-900">{title}</h4>
            {message && <p className="text-[11px] font-medium text-slate-600 leading-relaxed">{message}</p>}
          </div>

          {/* Close Button */}
          <button
            onClick={() => hotToast.dismiss(t.id)}
            className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ),
      { duration: 4000 }
    );
  }, []);

  const toast = {
    success: (title: string, message?: string) => triggerHotToast('success', title, message),
    error: (title: string, message?: string) => triggerHotToast('error', title, message),
    info: (title: string, message?: string) => triggerHotToast('info', title, message),
    warning: (title: string, message?: string) => triggerHotToast('warning', title, message),
  };

  const removeToast = useCallback((id: string) => {
    hotToast.dismiss(id);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'font-sans',
          style: {
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
          },
        }}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export { hotToast };
