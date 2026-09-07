'use client';

import React from 'react';
import Link from 'next/link';
import { Twitter, Linkedin, Github, ArrowRight } from 'lucide-react';
import { BidoraLogo } from '../ui/BidoraLogo';
import { useLanguage } from '../../lib/language-context';

export const PublicFooter: React.FC = () => {
  const { isFrench } = useLanguage();

  const footerLinks = {
    product: {
      title: isFrench ? 'Produit' : 'Product',
      links: [
        { label: isFrench ? 'Fonctionnalités' : 'Features', href: '/features' },
        { label: isFrench ? 'Tarifs' : 'Pricing', href: '/pricing' },
        { label: isFrench ? 'Documentation' : 'Documentation', href: '/docs' },
      ],
    },
    company: {
      title: isFrench ? 'Entreprise' : 'Company',
      links: [
        { label: isFrench ? 'À Propos' : 'About Us', href: '/about' },
        { label: isFrench ? 'Contact' : 'Contact', href: '/contact' },
      ],
    },
    legal: {
      title: isFrench ? 'Légal & Conformité' : 'Legal',
      links: [
        { label: isFrench ? 'Politique de Confidentialité' : 'Privacy Policy', href: '/privacy' },
        { label: isFrench ? 'Conditions d\'Utilisation' : 'Terms of Service', href: '/terms' },
        { label: isFrench ? 'Indépendance Gouvernementale' : 'Procurement Disclaimers', href: '/terms#government-independence' },
        { label: isFrench ? 'Charte Anti-Corruption' : 'Anti-Corruption Code', href: '/terms#anti-corruption' },
      ],
    },
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* CTA Strip */}
      <div className="gradient-bg py-14 px-6 text-center text-white">
        <div className="max-w-2xl mx-auto space-y-5">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            {isFrench ? 'Prêt à remporter plus de marchés publics ?' : 'Ready to win more contracts?'}
          </h2>
          <p className="text-blue-100 text-sm font-medium leading-relaxed">
            {isFrench
              ? 'Rejoignez plus de 500 équipes d\'appels d\'offres qui identifient des opportunités qualifiées plus rapidement grâce à l\'IA.'
              : 'Join 500+ enterprise bid management teams discovering matching procurement opportunities faster with AI.'}
          </p>
          <Link
            href="/register"
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-white text-emerald-800 font-extrabold text-sm shadow-lg hover:bg-emerald-50 hover:scale-105 transition-all"
          >
            <span>{isFrench ? 'Démarrer l\'Essai Gratuit de 14 Jours' : 'Start Free 14-Day Trial'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-5">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <BidoraLogo variant="dark" size="lg" showTagline={true} />
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed font-medium max-w-xs">
              {isFrench
                ? 'La plateforme d\'intelligence des marchés publics propulsée par l\'IA, approuvée par les directions d\'appels d\'offres pour découvrir, évaluer et remporter plus de contrats publics et privés.'
                : 'The AI-powered procurement intelligence platform trusted by enterprise bid desks to discover, evaluate, and win more government & enterprise contracts.'}
            </p>

            <div className="flex items-center space-x-3">
              {[
                { icon: Twitter, label: 'Twitter', href: '#' },
                { icon: Linkedin, label: 'LinkedIn', href: '#' },
                { icon: Github, label: 'GitHub', href: '#' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key} className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="space-y-1 text-center md:text-left">
            <span>&copy; {new Date().getFullYear()} Bidora, Inc. {isFrench ? 'Tous droits réservés.' : 'All rights reserved.'}</span>
            <p className="text-[11px] text-slate-500 max-w-2xl leading-relaxed">
              {isFrench
                ? 'Bidora est un fournisseur technologique indépendant et n\'est affilié à aucun ministère gouvernemental, organisme de marchés publics ou banque internationale de développement.'
                : 'Bidora is an independent private technology provider and is not affiliated with any sovereign government ministry, public procurement agency, or international development bank.'}
            </p>
          </div>
          <div className="flex items-center space-x-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isFrench ? 'Tous les systèmes opérationnels' : 'All systems operational'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
