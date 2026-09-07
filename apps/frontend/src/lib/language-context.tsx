'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations, Language, TranslationKey } from './translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: TranslationKey | string, fallback?: string) => string;
  isFrench: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLang = localStorage.getItem('bidora_lang') as Language | null;
        if (savedLang === 'en' || savedLang === 'fr') {
          return savedLang;
        }
        const browserLang = (navigator.language || (navigator.languages && navigator.languages[0]) || 'en').toLowerCase();
        if (browserLang.startsWith('fr')) {
          return 'fr';
        }
      } catch (e) {
        // Storage access restricted
      }
    }
    return 'en';
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedLang = localStorage.getItem('bidora_lang') as Language | null;
      if (savedLang === 'en' || savedLang === 'fr') {
        setLangState(savedLang);
        document.documentElement.lang = savedLang;
      } else {
        const browserLang = (navigator.language || (navigator.languages && navigator.languages[0]) || 'en').toLowerCase();
        const initial = browserLang.startsWith('fr') ? 'fr' : 'en';
        setLangState(initial);
        document.documentElement.lang = initial;
      }
    } catch (e) {
      console.warn('Could not read browser language preferences:', e);
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'bidora_lang' && (e.newValue === 'en' || e.newValue === 'fr')) {
        setLangState(e.newValue as Language);
        document.documentElement.lang = e.newValue;
      }
    };

    const handleCustomLang = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === 'en' || detail === 'fr') {
        setLangState(detail);
        document.documentElement.lang = detail;
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('bidora_lang_changed', handleCustomLang);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('bidora_lang_changed', handleCustomLang);
    };
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('bidora_lang', newLang);
      document.documentElement.lang = newLang;
      window.dispatchEvent(new CustomEvent('bidora_lang_changed', { detail: newLang }));
    } catch (e) {
      // LocalStorage access restricted
    }
  };

  const toggleLang = () => {
    setLang(lang === 'en' ? 'fr' : 'en');
  };

  const t = (key: TranslationKey | string, fallback?: string): string => {
    const dict = translations[lang] as Record<string, string>;
    if (dict && dict[key]) {
      return dict[key];
    }
    const enDict = translations.en as Record<string, string>;
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        t,
        isFrench: lang === 'fr',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback safe dummy context during early render
    return {
      lang: 'en' as Language,
      setLang: () => {},
      toggleLang: () => {},
      t: (k: string, fallback?: string) => fallback || k,
      isFrench: false,
    };
  }
  return context;
};
