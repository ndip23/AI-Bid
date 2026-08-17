'use client';

import React from 'react';
import { PublicNav } from '../../components/layout/PublicNav';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { FileText, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PublicNav />

      <main className="flex-1 max-w-4xl mx-auto px-6 md:px-10 pt-20 pb-16 space-y-8 w-full">
        {/* Header */}
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-emerald-600" />
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500 font-semibold">
            Last updated: August 17, 2026 • Effective Date: January 1, 2026
          </p>
        </div>

        {/* Content Body */}
        <div className="glass-panel rounded-3xl p-6 md:p-10 space-y-8 bg-white border border-slate-200 shadow-sm text-sm text-slate-700 leading-relaxed font-medium">
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900">1. Acceptance of Terms</h2>
            <p className="text-xs">
              By accessing or using the <strong>Bidora</strong> platform, you agree to be bound by these Terms of Service. Bidora provides an AI-powered procurement intelligence SaaS platform for discovering, evaluating, and tracking public and enterprise procurement opportunities.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-lg font-extrabold text-slate-900">2. Service Level Agreement & AI Output</h2>
            <p className="text-xs">
              Bidora ingests public procurement notices from authorized global and regional portals (including World Bank, UNGM, SAM.gov, ARMP, BPP, and PPIP). AI match scores and executive summaries are generated algorithmically to assist your bid desk. Final proposal verification and submission remain the sole responsibility of the user organization.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-lg font-extrabold text-slate-900">3. Intellectual Property & Tenant Isolation</h2>
            <p className="text-xs">
              All platform software, algorithms, designs, and brand trademarks belong exclusively to Bidora, Inc. All company capability matrices, saved pipelines, and custom notes uploaded by customer organizations remain the exclusive property of the customer.
            </p>
          </section>

          <section className="space-y-2 border-t border-slate-100 pt-6 text-xs text-slate-500">
            <p>For questions regarding our Terms of Service, reach out to <strong className="text-slate-900 font-bold">legal@bidora.io</strong>.</p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
