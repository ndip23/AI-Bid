'use client';

import React from 'react';
import { useLanguage } from '../../lib/language-context';
import { Globe } from 'lucide-react';

interface Props {
  variant?: 'nav' | 'compact' | 'sidebar';
}

export const LanguageSwitcher: React.FC<Props> = ({ variant = 'nav' }) => {
  const { lang, setLang } = useLanguage();

  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-[11px] font-bold">
        <button
          type="button"
          onClick={() => setLang('en')}
          className={`px-2 py-1 rounded-lg transition-all ${
            lang === 'en'
              ? 'bg-white text-emerald-700 shadow-xs font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Switch to English"
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLang('fr')}
          className={`px-2 py-1 rounded-lg transition-all ${
            lang === 'fr'
              ? 'bg-white text-emerald-700 shadow-xs font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Passer en Français"
        >
          FR
        </button>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-600 font-semibold">
          <Globe className="w-3.5 h-3.5 text-emerald-600" />
          <span>{lang === 'fr' ? 'Langue' : 'Language'}</span>
        </div>
        <div className="inline-flex items-center rounded-lg bg-white p-0.5 border border-slate-200 text-[11px] font-bold shadow-2xs">
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`px-2 py-0.5 rounded-md transition-all ${
              lang === 'en'
                ? 'bg-emerald-600 text-white font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang('fr')}
            className={`px-2 py-0.5 rounded-md transition-all ${
              lang === 'fr'
                ? 'bg-emerald-600 text-white font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            FR
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-100/90 hover:bg-slate-100 border border-slate-200/80 text-xs font-bold transition-all">
      <Globe className="w-3.5 h-3.5 text-slate-500" />
      <div className="flex items-center space-x-1 text-[11px]">
        <button
          type="button"
          onClick={() => setLang('en')}
          className={`px-1.5 py-0.5 rounded-md transition-all ${
            lang === 'en'
              ? 'bg-white text-emerald-700 font-extrabold shadow-2xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
          title="English"
        >
          EN
        </button>
        <span className="text-slate-300">|</span>
        <button
          type="button"
          onClick={() => setLang('fr')}
          className={`px-1.5 py-0.5 rounded-md transition-all ${
            lang === 'fr'
              ? 'bg-white text-emerald-700 font-extrabold shadow-2xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
          title="Français"
        >
          FR
        </button>
      </div>
    </div>
  );
};
