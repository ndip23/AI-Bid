'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PublicNav } from '../../components/layout/PublicNav';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { useLanguage } from '../../lib/language-context';
import { CheckCircle2, Sparkles, ArrowRight, HelpCircle } from 'lucide-react';

export default function PricingPage() {
  const { isFrench } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const starterPerks = isFrench ? [
    '50 Synthèses de DAO par IA / mois',
    '3 Utilisateurs d\'équipe inclus',
    'Moteur d\'adéquation profil & scoring',
    'Suivi du pipeline et alertes par email',
  ] : [
    '50 AI RFP Summaries / mo',
    '3 Team Seats Included',
    'Capability Profile Match Engine',
    'Saved Pipeline Tracking & Alerts',
  ];

  const proPerks = isFrench ? [
    'Synthèses de DAO illimitées par IA',
    '15 Utilisateurs d\'équipe inclus',
    'Pipeline IA Dual-Model Gemini 1.5 Pro + GPT-4o',
    'Flux marchés ARMP, Afrique, TED Europe & Banque Mondiale',
    'Génération de cautions de soumission et lettres d\'offre',
    'Support prioritaire par email et chat',
  ] : [
    'Unlimited AI RFP Summaries',
    '15 Team Seats Included',
    'Gemini 1.5 Pro + GPT-4o Dual-Model Pipeline',
    'ARMP, Africa, TED Europe & World Bank Feeds',
    'Bid Bond Calculation & Submission Package Generator',
    'Priority Email & Live Chat Support',
  ];

  const enterprisePerks = isFrench ? [
    'Export API REST personnalisée & Webhooks',
    'Nombre d\'utilisateurs illimité & Authentification SSO SAML',
    'Gestionnaire de compte dédié & SLA de disponibilité 99,9%',
    'Modèles d\'adéquation et analyse sur mesure',
    'Accompagnement d\'intégration sur site ou à distance',
  ] : [
    'Custom REST API & Webhook Export',
    'Unlimited Team Seats & SAML SSO Auth',
    'Dedicated Account Manager & 99.9% Uptime SLA',
    'Custom Fine-Tuned Match Models',
    'Dedicated Onboarding & Training Session',
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PublicNav />

      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-16 space-y-10 w-full">
        {/* Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {isFrench
              ? 'Choisissez le forfait adapté à votre équipe'
              : 'Choose the Plan Built for Your Team'}
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            {isFrench
              ? 'Développez votre détection d\'appels d\'offres, votre scoring d\'adéquation et vos synthèses de DAO sans frais cachés.'
              : 'Scale your tender discovery, match scoring, and RFP analysis with zero hidden fees.'}
          </p>

          <div className="inline-flex items-center bg-slate-200/80 p-1 rounded-xl text-xs font-bold pt-2">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              {isFrench ? 'Facturation Mensuelle' : 'Monthly Billing'}
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                billingCycle === 'annual' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              {isFrench ? 'Facturation Annuelle (Économisez 20%)' : 'Annual (Save 20%)'}
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter */}
          <div className="glass-panel rounded-3xl p-8 space-y-6 bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">Starter</span>
              <h3 className="text-3xl font-black text-slate-900">
                {billingCycle === 'annual' ? '$149' : '$189'}{' '}
                <span className="text-xs text-slate-500 font-normal">{isFrench ? '/ mois' : '/ month'}</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isFrench
                  ? 'Idéal pour les PME et bureaux d\'études qui répondent à des marchés locaux.'
                  : 'Great for boutique consultancies bidding on local tenders.'}
              </p>

              <ul className="space-y-3 text-xs font-semibold text-slate-700 pt-4 border-t border-slate-100">
                {starterPerks.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/register"
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs text-center block transition-all"
            >
              {isFrench ? 'Démarrer l\'Essai Gratuit' : 'Start Free Trial'}
            </Link>
          </div>

          {/* Professional Featured */}
          <div className="glass-panel rounded-3xl p-8 space-y-6 bg-white border-2 border-emerald-600 shadow-xl flex flex-col justify-between relative">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-md">
              {isFrench ? 'Le Plus Populaire' : 'Most Popular'}
            </span>
            <div className="space-y-4">
              <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">Professional</span>
              <h3 className="text-4xl font-black text-slate-900">
                {billingCycle === 'annual' ? '$399' : '$499'}{' '}
                <span className="text-xs text-slate-500 font-normal">{isFrench ? '/ mois' : '/ month'}</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isFrench
                  ? 'Pour les entreprises en croissance et directions des marchés actives.'
                  : 'For mid-market firms & active procurement desks.'}
              </p>

              <ul className="space-y-3 text-xs font-semibold text-slate-700 pt-4 border-t border-slate-100">
                {proPerks.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/register"
              className="w-full py-3 rounded-xl gradient-bg text-white font-extrabold text-xs text-center block shadow-md shadow-emerald-600/20 hover:opacity-95 transition-all"
            >
              {isFrench ? 'Choisir ce Forfait' : 'Get Started Now'}
            </Link>
          </div>

          {/* Enterprise */}
          <div className="glass-panel rounded-3xl p-8 space-y-6 bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">Enterprise</span>
              <h3 className="text-3xl font-black text-slate-900">{isFrench ? 'Sur Mesure' : 'Custom'}</h3>
              <p className="text-xs text-slate-500 font-medium">
                {isFrench
                  ? 'Pour les grands groupes, intégrateurs et soumissionnaires internationaux.'
                  : 'For defense prime contractors & large enterprises.'}
              </p>

              <ul className="space-y-3 text-xs font-semibold text-slate-700 pt-4 border-t border-slate-100">
                {enterprisePerks.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/contact"
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs text-center block transition-all"
            >
              {isFrench ? 'Contacter l\'Équipe Entreprise' : 'Contact Enterprise Sales'}
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
