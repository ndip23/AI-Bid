'use client';

import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  title,
  description,
  action,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden min-w-0">
          {(title || description || action) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                {title && <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h1>}
                {description && <p className="text-sm text-slate-500 mt-1 leading-relaxed">{description}</p>}
              </div>
              {action && <div className="flex-shrink-0">{action}</div>}
            </div>
          )}
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};
