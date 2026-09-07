'use client';

import React from 'react';
import Link from 'next/link';
import { PublicNav } from '../../components/layout/PublicNav';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { useLanguage } from '../../lib/language-context';
import { Sparkles, FileText, Code, ShieldCheck, Terminal, ExternalLink, ArrowRight } from 'lucide-react';

export default function DocsPage() {
  const { isFrench } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PublicNav />

      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-16 space-y-10 w-full">
        {/* Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {isFrench ? 'Référence de l\'API Bidora' : 'Bidora API Reference'}
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            {isFrench
              ? 'Découvrez comment interconnecter notre moteur d\'adéquation par IA et l\'ingestion d\'appels d\'offres à vos progiciels d\'entreprise.'
              : 'Learn how to integrate our AI match engine and tender ingestion API into your enterprise apps.'}
          </p>
        </div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 1 */}
          <div className="glass-panel rounded-3xl p-6 bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {isFrench ? 'Spécification de l\'API REST' : 'REST API Specification'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">OpenAPI v3 Swagger Docs</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {isFrench
                ? 'Explorez les points de terminaison interactifs pour l\'authentification, les matrices de compétences, l\'ingestion de DAO et la gestion du pipeline d\'offres.'
                : 'Explore interactive endpoints for user authentication, company capability profiles, tender ingestion, and saved bid pipeline updates.'}
            </p>
            <a
              href="http://localhost:4000/api/docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-xs font-extrabold text-emerald-600 hover:text-emerald-700 gap-1"
            >
              <span>{isFrench ? 'Ouvrir la Console Swagger' : 'Open Swagger API Console'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Section 2 */}
          <div className="glass-panel rounded-3xl p-6 bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {isFrench ? 'Authentification Rapide' : 'Quickstart Authentication'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">JWT Bearer Auth</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] space-y-1">
              <div className="text-slate-500">{isFrench ? '# Authentification' : '# Authenticate'}</div>
              <div>curl -X POST /api/auth/login \</div>
              <div className="pl-4">-H &quot;Content-Type: application/json&quot; \</div>
              <div className="pl-4">-d &apos;{JSON.stringify({ email: "team@company.com", password: "••••••" })}&apos;</div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {isFrench
                ? 'Passez le token JWT renvoyé dans l\'en-tête Authorization Bearer pour toutes les requêtes ultérieures.'
                : 'Pass the returned JWT bearer token in the Authorization header for all subsequent API requests.'}
            </p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
