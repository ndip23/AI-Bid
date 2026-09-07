'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react';
import { BidoraLogo } from '../ui/BidoraLogo';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { useLanguage } from '../../lib/language-context';

export const PublicNav: React.FC = () => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { href: '/features', label: t('nav.features', 'Features') },
    { href: '/pricing', label: t('nav.pricing', 'Pricing') },
    { href: '/about', label: t('nav.about', 'About') },
    { href: '/contact', label: t('nav.contact', 'Contact') },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-18 flex items-center justify-between py-4">
        {/* Brand */}
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <BidoraLogo size="md" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA & Language Switcher */}
        <div className="hidden md:flex items-center space-x-3">
          <LanguageSwitcher />

          <Link
            href="/login"
            className="px-4 py-2 rounded-lg text-sm font-bold text-slate-700 hover:text-emerald-700 transition-colors"
          >
            {t('nav.signIn', 'Sign In')}
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-xl gradient-bg text-white font-bold text-sm gradient-glow hover:opacity-95 hover:scale-[1.02] transition-all flex items-center space-x-1.5"
          >
            <span>{t('nav.getStarted', 'Get Started Free')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher variant="compact" />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-6 py-4 space-y-2 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-all"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block w-full py-2.5 text-center text-sm font-bold text-slate-700 hover:text-emerald-700"
            >
              {t('nav.signIn', 'Sign In')}
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="block w-full py-2.5 text-center rounded-xl gradient-bg text-white font-bold text-sm shadow-md"
            >
              {t('nav.getStarted', 'Get Started Free')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
