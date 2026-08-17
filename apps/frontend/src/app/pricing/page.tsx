'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PublicNav } from '../../components/layout/PublicNav';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { CheckCircle2, Sparkles, ArrowRight, HelpCircle } from 'lucide-react';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PublicNav />

      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-12 space-y-10 w-full">
        {/* Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Choose the Plan Built for Your Team</h1>
          <p className="text-sm text-slate-600 font-medium">
            Scale your tender discovery, match scoring, and RFP analysis with zero hidden fees.
          </p>

          <div className="inline-flex items-center bg-slate-200/80 p-1 rounded-xl text-xs font-bold pt-2">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                billingCycle === 'annual' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              Annual (Save 20%)
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
                <span className="text-xs text-slate-500 font-normal">/ month</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Great for boutique consultancies bidding on local tenders.</p>

              <ul className="space-y-3 text-xs font-semibold text-slate-700 pt-4 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 50 AI RFP Summaries / mo
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 3 Team Seats Included
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Capability Profile Match Engine
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Saved Pipeline Tracking
                </li>
              </ul>
            </div>
            <Link
              href="/register"
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs text-center block transition-all"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Professional Featured */}
          <div className="glass-panel rounded-3xl p-8 space-y-6 bg-white border-2 border-emerald-600 shadow-xl flex flex-col justify-between relative">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-md">
              Most Popular
            </span>
            <div className="space-y-4">
              <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">Professional</span>
              <h3 className="text-4xl font-black text-slate-900">
                {billingCycle === 'annual' ? '$399' : '$499'}{' '}
                <span className="text-xs text-slate-500 font-normal">/ month</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">For mid-market firms & active procurement desks.</p>

              <ul className="space-y-3 text-xs font-semibold text-slate-700 pt-4 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Unlimited AI RFP Summaries
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 15 Team Seats Included
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Gemini 1.5 Flash + GPT-4o Support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> SAM.gov, UK & EU Tender Feeds
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Priority Email & Chat Support
                </li>
              </ul>
            </div>
            <Link
              href="/register"
              className="w-full py-3 rounded-xl gradient-bg text-white font-extrabold text-xs text-center block shadow-md shadow-emerald-600/20 hover:opacity-95 transition-all"
            >
              Get Started Now
            </Link>
          </div>

          {/* Enterprise */}
          <div className="glass-panel rounded-3xl p-8 space-y-6 bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">Enterprise</span>
              <h3 className="text-3xl font-black text-slate-900">Custom</h3>
              <p className="text-xs text-slate-500 font-medium">For defense prime contractors & large enterprises.</p>

              <ul className="space-y-3 text-xs font-semibold text-slate-700 pt-4 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Custom REST API & Webhook Export
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Unlimited Team Seats & SAML SSO
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Dedicated Account Manager & SLA
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Custom Fine-Tuned Match Models
                </li>
              </ul>
            </div>
            <Link
              href="/docs"
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs text-center block transition-all"
            >
              Contact Enterprise Sales
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
