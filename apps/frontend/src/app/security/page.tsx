'use client';

import React from 'react';
import { PublicNav } from '../../components/layout/PublicNav';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { ShieldCheck, Lock, Cpu, Server, CheckCircle2 } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PublicNav />

      <main className="flex-1 max-w-4xl mx-auto px-6 md:px-10 pt-20 pb-16 space-y-8 w-full">
        {/* Header */}
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
            Enterprise Security Architecture
          </h1>
          <p className="text-xs text-slate-500 font-semibold">
            Bank-grade encryption, SOC 2 Type II compliance, and zero-trust tenant isolation
          </p>
        </div>

        {/* Security Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-emerald-700 font-extrabold text-sm">
              <Lock className="w-4.5 h-4.5 text-emerald-600" />
              <span>AES-256 & TLS 1.3 Encryption</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              All company profiles, RFP documents, and match scores are encrypted in transit via TLS 1.3 and at rest with AES-256 bit encryption keys.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-emerald-700 font-extrabold text-sm">
              <Server className="w-4.5 h-4.5 text-emerald-600" />
              <span>Strict Tenant Isolation</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Every organization operates within a logically isolated database context. Data access is enforced via JWT claims and automated row-level security.
            </p>
          </div>
        </div>

        {/* Compliance Badges */}
        <div className="glass-panel p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Certified Security & Compliance Standards
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-black text-slate-800">
              SOC 2 Type II
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-black text-slate-800">
              ISO 27001
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-black text-slate-800">
              GDPR Compliant
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-black text-slate-800">
              HIPAA Compliant
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
