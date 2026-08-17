'use client';

import React from 'react';
import { PublicNav } from '../../components/layout/PublicNav';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { Briefcase, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const openRoles = [
  { title: 'Senior Full Stack Engineer (Next.js & NestJS)', location: 'Remote / London / Yaoundé', type: 'Full-time' },
  { title: 'AI Research & NLP Engineer (LLM Fine-tuning)', location: 'Remote', type: 'Full-time' },
  { title: 'Enterprise Account Executive (Procurement Tech)', location: 'Remote / Washington D.C.', type: 'Full-time' },
  { title: 'Lead Product Designer (UI/UX)', location: 'Remote', type: 'Full-time' },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PublicNav />

      <main className="flex-1 max-w-5xl mx-auto px-6 md:px-10 pt-20 pb-16 space-y-10 w-full">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Build the Future of Procurement Intelligence
          </h1>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            Join our mission to eliminate friction in global government & enterprise bidding.
          </p>
        </div>

        {/* Open Roles List */}
        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-600" />
            Open Positions ({openRoles.length})
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {openRoles.map((role, idx) => (
              <div
                key={idx}
                className="glass-panel rounded-2xl p-5 bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-emerald-300 transition-all"
              >
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">{role.title}</h3>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 font-medium mt-1">
                    <span>📍 {role.location}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">
                      {role.type}
                    </span>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-xs flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
