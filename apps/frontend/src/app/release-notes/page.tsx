'use client';

import React from 'react';
import { PublicNav } from '../../components/layout/PublicNav';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { Sparkles, CheckCircle2, Tag } from 'lucide-react';

const updates = [
  {
    version: 'v1.4.0',
    date: 'August 17, 2026',
    title: 'Fast PostgreSQL Response Caching & Tender AI Executive Summarizer Normalization',
    items: [
      'Implemented sub-millisecond database query caching on NestJS backend API',
      'Added robust requirements & deliverables normalization engine in AISummaryView',
      'Updated company capability matrix for African target markets (Cameroon, Nigeria, Kenya, South Africa, Ghana, Rwanda)',
    ],
  },
  {
    version: 'v1.3.0',
    date: 'August 10, 2026',
    title: 'Multi-Source Procurement Crawlers (World Bank & UNGM)',
    items: [
      'Ingested 160+ live procurement notices directly into Neon PostgreSQL DB',
      'Added automated AI risk matrix assessment (HIGH / MEDIUM severity badges)',
    ],
  },
];

export default function ReleaseNotesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PublicNav />

      <main className="flex-1 max-w-4xl mx-auto px-6 md:px-10 pt-20 pb-16 space-y-10 w-full">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Release Notes & Platform Changelog
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Stay up to date with new features, performance updates, and crawler additions.
          </p>
        </div>

        <div className="space-y-6">
          {updates.map((up) => (
            <div key={up.version} className="glass-panel rounded-3xl p-6 md:p-8 bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-black text-xs border border-emerald-200">
                    {up.version}
                  </span>
                  <h2 className="text-base font-bold text-slate-900">{up.title}</h2>
                </div>
                <span className="text-xs text-slate-400 font-semibold">{up.date}</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 font-semibold">
                {up.items.map((item, i) => (
                  <li key={i} className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
