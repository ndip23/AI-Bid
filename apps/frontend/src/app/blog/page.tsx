'use client';

import React from 'react';
import { PublicNav } from '../../components/layout/PublicNav';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { BookOpen, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

const articles = [
  {
    title: 'How Dual AI Pipelines (Gemini 1.5 Flash + GPT-4o) Cut RFP Evaluation Time by 90%',
    category: 'Procurement AI',
    date: 'August 14, 2026',
    excerpt: 'Analyzing 100+ page procurement documents manually causes bid bottlenecks. Here is how modern enterprise teams use automated deliverable and requirement extraction.',
  },
  {
    title: 'Navigating Public Procurement Portals Across West & Central Africa (ARMP, BPP, PPIP)',
    category: 'Market Intelligence',
    date: 'August 02, 2026',
    excerpt: 'A comprehensive guide for technology primes bidding on government contracts in Cameroon, Nigeria, Kenya, and South Africa.',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PublicNav />

      <main className="flex-1 max-w-5xl mx-auto px-6 md:px-10 pt-20 pb-16 space-y-10 w-full">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Procurement & AI Intelligence Blog
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Insights, market analysis, and capture management strategy for enterprise bid teams.
          </p>
        </div>

        {/* Articles List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((art, idx) => (
            <div key={idx} className="glass-panel rounded-3xl p-6 bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:border-emerald-300 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    {art.category}
                  </span>
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {art.date}
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 leading-snug">{art.title}</h2>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{art.excerpt}</p>
              </div>

              <Link href="/features" className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 pt-2">
                <span>Read Full Article</span> <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
