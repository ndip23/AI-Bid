'use client';

import React from 'react';
import { PublicNav } from '../../components/layout/PublicNav';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { ShieldCheck, CheckCircle2, Lock, Globe } from 'lucide-react';

export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PublicNav />

      <main className="flex-1 max-w-4xl mx-auto px-6 md:px-10 pt-20 pb-16 space-y-8 w-full">
        {/* Header */}
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Globe className="w-8 h-8 text-emerald-600" />
            GDPR & Global Privacy Statement
          </h1>
          <p className="text-xs text-slate-500 font-semibold">
            EU GDPR & UK Data Protection Act Compliance Statement
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 md:p-10 space-y-6 bg-white border border-slate-200 shadow-sm text-xs text-slate-700 leading-relaxed font-medium">
          <h2 className="text-base font-extrabold text-slate-900">Your Rights Under GDPR</h2>
          <p>
            Bidora complies fully with the European Union General Data Protection Regulation (EU 2016/679) and UK GDPR. Users have the right to access, rectify, export, or permanently delete personal account data.
          </p>

          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-extrabold">Right to Erasure (Right to be Forgotten):</strong> You may request full account and data deletion directly from your profile settings or by contacting privacy@bidora.io.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-extrabold">Data Portability:</strong> Export your company capability matrix and saved tender pipeline in structured JSON/CSV formats at any time.
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
