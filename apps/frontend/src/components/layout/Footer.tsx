'use client';

import React from 'react';
import { Sparkles, Shield, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 px-6 text-xs text-slate-500 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg gradient-bg flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-extrabold text-slate-900 tracking-tight text-sm">AI Bid Copilot</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-medium">Autonomous Procurement Opportunity Intelligence</span>
        </div>

        <div className="flex items-center space-x-6 text-slate-600 font-semibold">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>SOC 2 Ready</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span>Gemini 1.5 Flash AI</span>
          </div>
        </div>

        <div className="text-slate-400 text-[11px] font-medium">
          © {new Date().getFullYear()} AI Bid Copilot SaaS Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
