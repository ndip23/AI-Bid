'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Cpu } from 'lucide-react';
import { BidoraLogo } from '../ui/BidoraLogo';
import { useLanguage } from '../../lib/language-context';

export const Footer: React.FC = () => {
  const { isFrench } = useLanguage();

  return (
    <footer className="border-t border-slate-200 bg-white py-8 px-6 text-xs text-slate-500 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <BidoraLogo size="sm" />
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-medium">
            {isFrench
              ? 'Intelligence Autonome pour Marchés Publics & Privés'
              : 'Autonomous Procurement Opportunity Intelligence'}
          </span>
        </div>

        <div className="flex items-center space-x-4 text-slate-600 font-semibold">
          <Link href="/privacy" className="hover:text-emerald-600 transition-colors">
            {isFrench ? 'Confidentialité' : 'Privacy'}
          </Link>
          <Link href="/terms" className="hover:text-emerald-600 transition-colors">
            {isFrench ? 'Conditions' : 'Terms'}
          </Link>
          <Link href="/docs" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isFrench ? 'Documentation API' : 'API Docs'}</span>
          </Link>
        </div>

        <div className="text-slate-400 text-[11px] font-medium flex flex-wrap items-center gap-2">
          <span>
            © {new Date().getFullYear()} Bidora SaaS Platform. {isFrench ? 'Tous droits réservés.' : 'All rights reserved.'}
          </span>
          <span className="text-slate-300">•</span>
          <span className="font-bold text-slate-600 flex items-center gap-1">
            <span>{isFrench ? 'Propulsé par' : 'Powered by'}</span>
            <span className="text-emerald-600 font-black tracking-wide">MasCode</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
