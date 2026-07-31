'use client';

import React from 'react';
import Link from 'next/link';
import { PublicNav } from '../../components/layout/PublicNav';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { Sparkles, FileText, Code, ShieldCheck, Terminal, ExternalLink, ArrowRight } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PublicNav />

      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-16 space-y-12 w-full">
        {/* Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Developer Hub & Documentation</span>
          </div>

          <h1 className="text-4xl font-black text-slate-900 tracking-tight">AI Bid Copilot API Reference</h1>
          <p className="text-sm text-slate-600 font-medium">
            Learn how to integrate our AI match engine and tender ingestion API into your enterprise apps.
          </p>
        </div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 1 */}
          <div className="glass-panel rounded-3xl p-6 bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">REST API Specification</h3>
                <p className="text-xs text-slate-500 font-medium">OpenAPI v3 Swagger Docs</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Explore interactive endpoints for user authentication, company capability profiles, tender ingestion, and saved bid pipeline updates.
            </p>
            <a
              href="http://localhost:4000/api/docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-xs font-extrabold text-blue-600 hover:text-blue-700 gap-1"
            >
              Open Swagger API Console <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Section 2 */}
          <div className="glass-panel rounded-3xl p-6 bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Quickstart Authentication</h3>
                <p className="text-xs text-slate-500 font-medium">JWT Bearer Auth</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] space-y-1">
              <div className="text-emerald-400"># Authenticate & retrieve JWT Token</div>
              <div>curl -X POST http://localhost:4000/api/v1/auth/login \</div>
              <div>  -H "Content-Type: application/json" \</div>
              <div>  -d '&#123;"email":"user@apextech.com","password":"..."&#125;'</div>
            </div>
          </div>
        </div>

        {/* User Guide Card */}
        <div className="glass-panel rounded-3xl p-8 bg-white border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Platform Architecture & AI Workflow Guide
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-medium text-slate-600">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-extrabold text-slate-900 text-sm">1. Tender Ingestion</div>
              <p className="leading-relaxed">
                Tenders from SAM.gov, TED Europe, or manual PDFs are parsed by Gemini 1.5 Flash into executive summaries, deliverables, cutoffs, and compliance constraints.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-extrabold text-slate-900 text-sm">2. Match Engine</div>
              <p className="leading-relaxed">
                The NestJS backend runs `MatchService` to score 4 capability vectors: industry sector, operating geography, ISO/SOC certifications, and past experience.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-extrabold text-slate-900 text-sm">3. Pipeline Tracking</div>
              <p className="leading-relaxed">
                Bids are saved to your company pipeline under Bookmarked, Under Review, Bidding, or Passed stages with automated deadline warning notifications.
              </p>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
