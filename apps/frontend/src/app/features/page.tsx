'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PublicNav } from '../../components/layout/PublicNav';
import { PublicFooter } from '../../components/layout/PublicFooter';
import {
  Cpu, Award, ShieldCheck, Globe, FileText, BarChart3,
  CheckCircle2, ArrowRight, Sparkles, Zap, Lock, Bell,
} from 'lucide-react';

const tabs = ['Core AI Engine', 'Match & Scoring', 'Pipeline & Workflow', 'Security & Compliance'];

const tabContent: Record<string, {
  heading: string;
  sub: string;
  features: { icon: React.ElementType; title: string; desc: string }[];
  bullets: string[];
}> = {
  'Core AI Engine': {
    heading: 'Gemini 1.5 Flash + GPT-4o Dual-Model Pipeline',
    sub: 'Two frontier AI models. One purpose-built procurement engine.',
    features: [
      { icon: Cpu, title: 'Executive Summarizer', desc: 'Converts any RFP — regardless of format or length — into a crisp, structured executive summary with deliverables, milestones, and risks.' },
      { icon: Zap, title: 'Sub-5-Second Processing', desc: 'Parallel document parsing across both models ensures results are ready before your next coffee sip.' },
      { icon: FileText, title: 'SOW Extractor', desc: 'Statement of Work, technical requirements, and submission instructions pulled out as structured data, not just text.' },
    ],
    bullets: [
      'Dual-model fallback: Gemini primary, GPT-4o secondary',
      'Multi-page PDF, Word and HTML document support',
      'Mandatory vs optional requirement categorisation',
      'Liquidated damages & penalty clause identification',
      'Exportable summary as PDF or Word document',
    ],
  },
  'Match & Scoring': {
    heading: '4-Vector Weighted Match Algorithm',
    sub: 'An objective, data-driven score that tells you exactly where you stand.',
    features: [
      { icon: Award, title: 'Industry Alignment (35%)', desc: 'Validates your primary and secondary sector codes against the tender\'s required industry experience.' },
      { icon: Globe, title: 'Geographic Coverage (25%)', desc: 'Checks operational country presence against mandatory delivery locations. Multi-region support included.' },
      { icon: ShieldCheck, title: 'Certification Match (25%)', desc: 'ISO 27001, SOC 2, FedRAMP, Cyber Essentials, G-Cloud — all cross-referenced against your uploaded credentials.' },
    ],
    bullets: [
      'Real-time score recalibration on profile change',
      'Past contract experience weighting (15%)',
      'Side-by-side met vs unmet requirement matrix',
      'Score history over time per tender category',
      'Minimum qualification threshold filter',
    ],
  },
  'Pipeline & Workflow': {
    heading: 'Kanban Bid Pipeline & Deadline Intelligence',
    sub: 'From discovery to submission — tracked, organised and alerted.',
    features: [
      { icon: FileText, title: 'Kanban Stages', desc: 'Move opportunities through Bookmarked → Under Review → Bidding → Submitted → Won/Lost with a single drag.' },
      { icon: Bell, title: 'Smart Deadline Alerts', desc: 'Automated notifications at 30, 7 and 1 days before submission deadline. Sent via email and in-app.' },
      { icon: BarChart3, title: 'Win Rate Analytics', desc: 'Track performance by sector, geography and team member. See which bid types produce the highest ROI.' },
    ],
    bullets: [
      'Team comment threads per opportunity',
      'Export pipeline to CSV or PowerPoint',
      'CRM sync (Salesforce & HubSpot — Professional)',
      'Go/No-Go decision templates',
      'Budget and effort tracking per bid',
    ],
  },
  'Security & Compliance': {
    heading: 'Enterprise-Grade Security. Zero Compromise.',
    sub: 'Your company data is your competitive advantage. We protect it like it.',
    features: [
      { icon: Lock, title: 'Encryption at Rest & Transit', desc: 'AES-256 encryption for all stored data. TLS 1.3 enforced for every API call and browser session.' },
      { icon: ShieldCheck, title: 'SOC 2 Type II Compliant', desc: 'Annual independent audit of our security controls, availability, and confidentiality commitments.' },
      { icon: Globe, title: 'Data Residency Options', desc: 'US, EU and UK data residency zones available on Enterprise. Data never leaves your selected region.' },
    ],
    bullets: [
      'SAML 2.0 SSO (Okta, Azure AD, Google)',
      'Role-based access control (RBAC)',
      'Full audit log — every action recorded',
      'GDPR and UK GDPR compliant',
      'No data used for public model training',
    ],
  },
};

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const content = tabContent[activeTab];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <PublicNav />

      {/* Hero */}
      <section className="hero-mesh pt-32 pb-16 px-6 md:px-10 text-center">
        <div className="max-w-3xl mx-auto space-y-5 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Capabilities</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Every tool your bid desk needs.<br />
            <span className="gradient-text">Nothing it doesn't.</span>
          </h1>
          <p className="text-base text-slate-600 font-medium leading-relaxed max-w-xl mx-auto">
            A complete AI-powered procurement intelligence stack — from raw RFP ingestion to winning submission tracking.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl gradient-bg text-white font-extrabold text-sm gradient-glow hover:scale-[1.02] transition-all"
          >
            <span>Try All Features Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="sticky top-16 z-30 bg-white border-b border-slate-200 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-500 border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-16 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto space-y-12 animate-fade-in">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-slate-900">{content.heading}</h2>
            <p className="text-slate-500 text-sm font-medium">{content.sub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="glass-panel glass-panel-hover rounded-3xl p-7 space-y-4 bg-white">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">{f.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="glass-panel rounded-3xl p-8 bg-slate-50 max-w-2xl mx-auto">
            <h4 className="text-sm font-extrabold text-slate-900 mb-4">Also included:</h4>
            <ul className="space-y-2.5">
              {content.bullets.map((b) => (
                <li key={b} className="flex items-center space-x-3 text-sm font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 border-t border-slate-200 py-16 px-6 text-center">
        <div className="max-w-xl mx-auto space-y-5">
          <h2 className="text-2xl font-black text-slate-900">Ready to see it in action?</h2>
          <p className="text-sm text-slate-500 font-medium">14-day free trial · No credit card needed · Live in 30 minutes</p>
          <Link
            href="/register"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl gradient-bg text-white font-extrabold text-sm gradient-glow hover:scale-[1.02] transition-all"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
