'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PublicNav } from '../components/layout/PublicNav';
import { PublicFooter } from '../components/layout/PublicFooter';
import { ApiClient } from '../lib/api-client';
import {
  Sparkles,
  ArrowRight,
  Search,
  Award,
  ShieldCheck,
  Cpu,
  Globe,
  TrendingUp,
  CheckCircle2,
  Star,
  ChevronRight,
  Zap,
  BarChart3,
  Clock,
  FileText,
} from 'lucide-react';

/* ─── Animated counter hook ─── */
function useCounter(end: number, duration: number = 1800, start: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

/* ─── Stats Section ─── */
const stats = [
  { value: 500, suffix: '+', label: 'Enterprise Teams', icon: BarChart3 },
  { value: 94, suffix: '%', label: 'Average Match Accuracy', icon: Award },
  { value: 12, suffix: 'x', label: 'Faster RFP Evaluation', icon: Zap },
  { value: 48, suffix: 'B+', label: 'Pipeline Value Tracked', icon: TrendingUp, prefix: '$' },
];

/* ─── Feature cards ─── */
const features = [
  {
    icon: Cpu,
    color: 'blue',
    title: 'AI Executive Summarizer',
    desc: 'Gemini 1.5 Flash and GPT-4o parse 100+ page RFPs into crisp executive summaries with key deliverables, deadlines and compliance risks extracted in seconds.',
    bullets: ['Dual AI model pipeline (Gemini + GPT-4o)', 'Structured SOW & deliverable extraction', 'Penalty clause and risk flagging'],
  },
  {
    icon: Award,
    color: 'emerald',
    title: '4-Vector Match Engine',
    desc: 'Stop guessing. Our weighted algorithm scores every tender against your company profile across industry, geography, certifications, and capabilities.',
    bullets: ['ISO / SOC / FedRAMP certification matching', 'Operational country & region scoring', 'Real-time score recalibration on profile update'],
  },
  {
    icon: ShieldCheck,
    color: 'sky',
    title: 'Eligibility Checklist',
    desc: 'Instantly know if you qualify. Side-by-side verification of mandatory requirements vs your company credentials before spending a single hour on a proposal.',
    bullets: ['Green / amber / red requirement breakdown', 'Missing certification gap analysis', 'Exportable compliance report'],
  },
  {
    icon: Globe,
    color: 'violet',
    title: 'Global Tender Discovery',
    desc: 'SAM.gov, Find-a-Tender UK, TED Europe, UN Global Marketplace and more — unified into one intelligent, searchable feed with filters that actually work.',
    bullets: ['50,000+ live procurement notices', 'Advanced filters: sector, value, deadline', 'Automated new match alerts'],
  },
  {
    icon: FileText,
    color: 'amber',
    title: 'Bid Pipeline Tracker',
    desc: 'Kanban-style pipeline moves opportunities from discovery to submitted bid. Never miss a deadline with automated 30-day, 7-day and 1-day alerts.',
    bullets: ['Bookmarked → Reviewing → Bidding → Passed', 'Deadline countdown notifications', 'Team comment threads per opportunity'],
  },
  {
    icon: BarChart3,
    color: 'rose',
    title: 'Win Rate Analytics',
    desc: "Track your team's bid success over time. Understand which sectors and geographies deliver the highest ROI and where to focus capacity next quarter.",
    bullets: ['Win/loss rate by sector and geography', 'Effort vs value heatmaps', 'Export to CSV and PowerPoint'],
  },
];

const colorMap: Record<string, string> = {
  blue:   'bg-emerald-50 border-emerald-200 text-emerald-700',
  emerald:'bg-emerald-50 border-emerald-200 text-emerald-700',
  sky:    'bg-sky-50 border-sky-200 text-sky-700',
  violet: 'bg-violet-50 border-violet-200 text-violet-700',
  amber:  'bg-amber-50 border-amber-200 text-amber-700',
  rose:   'bg-rose-50 border-rose-200 text-rose-700',
};

/* ─── Testimonials ─── */
const testimonials = [
  {
    quote: 'Bidora cut our RFP evaluation time from three days to under an hour. We went from reviewing 10 tenders a month to 60.',
    name: 'Sarah Chen',
    role: 'VP of Business Development, Nexus Federal Solutions',
    rating: 5,
  },
  {
    quote: 'The 4-vector match score is genuinely accurate. It predicted our win probability within 4% of actual results across 12 bids.',
    name: 'Marcus Obi',
    role: 'Director of Capture Management, TechArc UK',
    rating: 5,
  },
  {
    quote: 'We used to miss tenders because we simply couldn\'t read them fast enough. Now our pipeline has tripled without adding headcount.',
    name: 'Priya Nair',
    role: 'Head of Procurement, InfraCloud GmbH',
    rating: 5,
  },
];

/* ─── FAQ ─── */
const faqs = [
  {
    q: 'How does the AI match score actually work?',
    a: 'Our engine evaluates four weighted dimensions: Industry Alignment (35%), Operational Geography (25%), Mandatory Certification Coverage — ISO 27001, SOC 2, FedRAMP etc. (25%), and Past Capability Overlap (15%). The score is recalculated live whenever you update your company capability profile.',
  },
  {
    q: 'Is my company data used to train public AI models?',
    a: 'Absolutely not. All capability data and RFP documents are encrypted at rest (AES-256) and in transit (TLS 1.3). We enforce strict enterprise tenant isolation and a zero-data-sharing policy. We are SOC 2 Type II compliant.',
  },
  {
    q: 'Which procurement databases do you connect to?',
    a: 'We currently pull from SAM.gov (US), Find-a-Tender (UK), TED Europe, UN Global Marketplace, and AusTender (Australia). Direct API integrations with Salesforce and HubSpot CRM are available on the Professional tier.',
  },
  {
    q: 'How long does onboarding take?',
    a: 'Most teams are live in under 30 minutes. You fill in your company capability profile, upload your existing certifications, and the match engine is immediately active against our full tender database.',
  },
  {
    q: 'Can I try it before paying?',
    a: 'Yes — every plan starts with a fully functional 14-day free trial, no credit card required. You get access to all Professional tier features during the trial period.',
  },
];

/* ════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════ */
export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [liveStats, setLiveStats] = useState<any>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ApiClient.getAdminStats().then((data) => {
      if (data) setLiveStats(data);
    }).catch(console.error);
  }, []);

  const totalTendersVal = liveStats?.totalTenders || 160;
  const totalCompaniesVal = liveStats?.totalCompanies || 50;

  const dynamicStats: Array<{ value: number; suffix: string; label: string; icon: any; prefix?: string }> = [
    { value: totalTendersVal, suffix: '+', label: 'Ingested Procurement Notices', icon: BarChart3, prefix: '' },
    { value: 94, suffix: '%', label: 'Average Match Accuracy', icon: Award, prefix: '' },
    { value: 12, suffix: 'x', label: 'Faster RFP Evaluation', icon: Zap, prefix: '' },
    { value: totalCompaniesVal, suffix: '+', label: 'Enterprise Teams', icon: TrendingUp, prefix: '' },
  ];

  const c1 = useCounter(dynamicStats[0].value, 1600, statsVisible);
  const c2 = useCounter(dynamicStats[1].value, 1800, statsVisible);
  const c3 = useCounter(dynamicStats[2].value, 1400, statsVisible);
  const c4 = useCounter(dynamicStats[3].value, 1600, statsVisible);
  const counters = [c1, c2, c3, c4];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden">
      <PublicNav />

      {/* ─── HERO ─── */}
      <section className="hero-mesh relative pt-16 pb-12 px-6 md:px-10 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-emerald-100/60 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-56 h-56 rounded-full bg-cyan-100/50 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left */}
          <div className="lg:col-span-7 space-y-6 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl lg:text-[64px] font-black text-slate-900 tracking-tight leading-[1.05]">
              Win More Bids.<br />
              <span className="gradient-text">Waste Zero Time.</span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed font-medium max-w-xl">
              Bidora automatically reads, scores and tracks government & enterprise procurement opportunities — so your bid team focuses on winning, not reading.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/register"
                className="group flex items-center space-x-2 px-8 py-4 rounded-2xl gradient-bg text-white font-extrabold text-base gradient-glow hover:scale-[1.02] transition-all"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/features"
                className="flex items-center space-x-2 px-8 py-4 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:text-emerald-600 hover:border-emerald-300 font-bold text-base shadow-sm transition-all"
              >
                <span>See How It Works</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Social proof strip */}
            <div className="flex flex-wrap items-center gap-5 pt-2">
              <div className="flex items-center space-x-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-sm font-extrabold text-slate-800 ml-1">4.9</span>
                <span className="text-xs text-slate-500 font-medium">/ 5 on G2</span>
              </div>
              <span className="w-px h-4 bg-slate-300" />
              <span className="text-xs text-slate-500 font-semibold">No credit card required</span>
              <span className="w-px h-4 bg-slate-300" />
              <span className="text-xs text-slate-500 font-semibold">14-day free trial</span>
            </div>
          </div>

          {/* Right — Live preview card */}
          <div className="lg:col-span-5 animate-fade-in-up animate-delay-200">
            <div className="animate-float">
              <div className="glassmorphic rounded-3xl p-6 space-y-5 shadow-2xl">
                {/* Card Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 ml-1">Live Match Preview</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[11px] font-extrabold">
                    94% MATCH
                  </span>
                </div>

                {/* Tender Snippet */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold">
                      US FEDERAL · $18.4M
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    VA Cloud Migration & Zero-Trust Architecture
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                    FedRAMP High. Hybrid cloud migration across 12 VA medical centers. SOC 2 Type II mandatory. Deadline: 45 days.
                  </p>
                </div>

                {/* Match Breakdown */}
                <div className="space-y-2.5">
                  {[
                    { label: 'Industry Alignment', pct: 100, color: 'bg-blue-500' },
                    { label: 'Geographic Presence', pct: 100, color: 'bg-sky-500' },
                    { label: 'Certifications Met', pct: 100, color: 'bg-emerald-500' },
                    { label: 'Capability Overlap', pct: 76, color: 'bg-amber-400' },
                  ].map((bar) => (
                    <div key={bar.label} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-600">
                        <span>{bar.label}</span>
                        <span>{bar.pct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${bar.color} rounded-full`}
                          style={{ width: `${bar.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Eligibility */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {[
                    { label: 'ISO 27001', ok: true },
                    { label: 'SOC 2 Type II', ok: true },
                    { label: 'FedRAMP High', ok: false },
                    { label: 'US Operations', ok: true },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold ${
                        item.ok
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                          : 'bg-rose-50 border border-rose-200 text-rose-700'
                      }`}
                    >
                      <span>{item.ok ? '✓' : '✗'}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LOGO STRIP / TRUST ─── */}
      <section className="bg-slate-50 border-y border-slate-200 py-8 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Trusted by procurement teams at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {['Nexus Federal', 'TechArc UK', 'InfraCloud GmbH', 'Apex Defense', 'StratoSystems'].map((name) => (
              <span key={name} className="text-slate-400 font-extrabold text-sm tracking-tight">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="bg-white py-16 px-6 md:px-10" ref={statsRef}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {dynamicStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-blue-100 flex items-center justify-center mx-auto">
                  <Icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-slate-900 stat-number">
                  {stat.prefix || ''}{counters[i]}{stat.suffix}
                </div>
                <div className="text-xs font-bold text-slate-500">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── FEATURES GRID ─── */}
      <section className="bg-slate-50 py-16 px-6 md:px-10 border-t border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Built for high-stakes procurement, not spreadsheets
            </h2>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              Every feature is designed around one goal: help enterprise bid teams evaluate faster, qualify smarter, and submit fewer losing bids.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="glass-panel glass-panel-hover rounded-3xl p-7 space-y-4 bg-white"
                >
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${colorMap[f.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">{f.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{f.desc}</p>
                  <ul className="space-y-1.5 pt-1">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-start space-x-2 text-xs font-semibold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              href="/features"
              className="inline-flex items-center space-x-2 text-sm font-extrabold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <span>See full feature list</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="bg-white py-20 px-6 md:px-10 border-t border-slate-200">
        <div className="max-w-5xl mx-auto space-y-14">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              From discovery to dashboard in 3 steps
            </h2>
            <p className="text-slate-500 text-sm font-medium">No complex setup. No consultants. Live in under 30 minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-slate-200" />

            {[
              {
                step: '01',
                icon: Building2Icon,
                title: 'Build Your Capability Profile',
                desc: 'Add your certifications (ISO 27001, SOC 2), service areas, team size, and operating countries once. The AI match engine is immediately calibrated.',
              },
              {
                step: '02',
                icon: SearchIcon,
                title: 'Discover & Score Tenders',
                desc: 'Browse 50,000+ live procurement notices from 6 global databases. Every tender shows an instant AI match score against your specific profile.',
              },
              {
                step: '03',
                icon: CheckIcon,
                title: 'Track Bids & Win',
                desc: 'Move qualified opportunities through your Kanban pipeline. Never miss a deadline with built-in 30/7/1 day countdown alerts.',
              },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="flex flex-col items-center text-center space-y-4 relative">
                  <div className="w-20 h-20 rounded-3xl gradient-bg flex items-center justify-center shadow-lg shadow-emerald-600/15 relative z-10">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-black text-4xl text-slate-100 -mt-2 select-none">{s.step}</div>
                  <h3 className="text-base font-extrabold text-slate-900">{s.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-xs">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="bg-slate-50 py-20 px-6 md:px-10 border-t border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              What bid teams are saying
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-panel rounded-3xl p-7 space-y-5 bg-white glass-panel-hover">
                <div className="flex space-x-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 font-medium leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <div className="font-extrabold text-sm text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500 font-medium">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="bg-white py-20 px-6 md:px-10 border-t border-slate-200">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Frequently asked questions</h2>
            <p className="text-sm text-slate-500 font-medium">
              Have another question?{' '}
              <Link href="/contact" className="text-emerald-600 font-bold hover:underline">
                Contact our team
              </Link>
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="glass-panel rounded-2xl overflow-hidden bg-white">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between"
                  >
                    <span className="font-bold text-sm text-slate-900 pr-4">{faq.q}</span>
                    <ChevronRight
                      className={`w-5 h-5 text-emerald-600 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed font-medium border-t border-slate-100 pt-4 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

/* Inline icon helpers for how-it-works to avoid import collision */
function Building2Icon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14M9 21V12h6v9" />
    </svg>
  );
}
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197A7.5 7.5 0 1 0 5.196 5.196L21 21Z" />
    </svg>
  );
}
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}
