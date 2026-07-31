'use client';

import React from 'react';
import Link from 'next/link';
import { PublicNav } from '../../components/layout/PublicNav';
import { PublicFooter } from '../../components/layout/PublicFooter';
import {
  Sparkles, ArrowRight, Users, Target, Globe, Rocket,
  ShieldCheck, Award, Heart, Linkedin, Twitter,
} from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Precision Over Volume',
    desc: 'We believe bid teams should spend time on tenders they can win — not reading through hundreds they cannot. Every feature is built to filter signal from noise.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust as a Foundation',
    desc: 'Your capability data is your competitive moat. We treat it that way — encrypted, isolated, never shared, never used to train public models.',
  },
  {
    icon: Users,
    title: 'Built for Real Bid Desks',
    desc: 'We spent 18 months embedded in procurement teams before writing a single line of code. Every workflow reflects how actual capture managers work.',
  },
  {
    icon: Globe,
    title: 'Global by Design',
    desc: 'Procurement is global. SAM.gov, TED Europe, UK Find-a-Tender, UNGM — we built multi-region from day one, not as an afterthought.',
  },
  {
    icon: Rocket,
    title: 'Speed Wins Contracts',
    desc: 'A 5-second RFP summary versus a 3-day manual read-through. Our obsession with processing speed directly translates to more bids submitted per team.',
  },
  {
    icon: Heart,
    title: 'Customer Success = Our Success',
    desc: 'We measure ourselves on the win rates of our customers, not just platform uptime. Every feature request goes through a win-rate impact filter.',
  },
];

const team = [
  {
    name: 'Dr. Amara Osei',
    role: 'Co-Founder & CEO',
    bio: 'Former Director of Federal Capture at Booz Allen Hamilton. 14 years managing government bid desks totalling $2.4B in awarded contracts.',
    initials: 'AO',
    bg: 'from-blue-600 to-indigo-600',
  },
  {
    name: 'James Whitfield',
    role: 'Co-Founder & CTO',
    bio: 'Previously Staff ML Engineer at Google DeepMind. Led NLP research teams specialising in document understanding at enterprise scale.',
    initials: 'JW',
    bg: 'from-emerald-600 to-teal-600',
  },
  {
    name: 'Priya Chandrasekaran',
    role: 'VP of Product',
    bio: 'Former Head of Product at Periscope Data & Salesforce GovCloud. Obsessive about making complex enterprise workflows feel simple.',
    initials: 'PC',
    bg: 'from-violet-600 to-purple-600',
  },
  {
    name: 'Marcus Webb',
    role: 'Head of Customer Success',
    bio: 'Built and led global customer success at Procore and Brainware. Focused on measurable win-rate outcomes for every customer.',
    initials: 'MW',
    bg: 'from-sky-600 to-cyan-600',
  },
];

const milestones = [
  { year: '2021', event: 'Founded in London after 18 months of bid desk research across UK and US markets.' },
  { year: '2022', event: 'Seed round of $3.2M led by Notion Capital. First 50 enterprise customers onboarded.' },
  { year: '2023', event: 'Launched Gemini 1.5 Flash integration. Processing time drops from 45s to under 5s per RFP.' },
  { year: '2024', event: 'Series A of $14M. Expanded to 6 global procurement databases. 300+ enterprise teams.' },
  { year: '2025', event: 'Launched 4-vector match engine and Kanban pipeline tracker. Win rate analytics go live.' },
  { year: '2026', event: '500+ enterprise teams. $48B+ in pipeline value tracked. SOC 2 Type II certification awarded.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <PublicNav />

      {/* ─── HERO ─── */}
      <section className="hero-mesh pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            We built the tool we wished existed<br />
            <span className="gradient-text">when we ran bid desks.</span>
          </h1>
          <p className="text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Evaluating complex RFPs requires hours of manual document parsing, cross-referencing compliance requirements, and verifying organizational capability. AI Bid Copilot was engineered to eliminate this friction—empowering procurement and proposal teams with instant document intelligence, automated eligibility verification, and objective match scoring.
          </p>
          <p className="text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            By leveraging advanced multi-model AI pipelines, we help capture managers filter out non-viable opportunities early and focus their resources on high-probability bids.
          </p>
        </div>
      </section>

      {/* ─── STATS BAND ─── */}
      <section className="bg-slate-900 py-12 px-6 md:px-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '500+', label: 'Enterprise teams' },
            { value: '$48B+', label: 'Pipeline value tracked' },
            { value: '6', label: 'Global procurement databases' },
            { value: '94%', label: 'Average match accuracy' },
          ].map((s) => (
            <div key={s.label} className="space-y-2">
              <div className="text-3xl font-black text-white">{s.value}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── VALUES ─── */}
      <section className="bg-white py-20 px-6 md:px-10 border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black text-slate-900">What we believe</h2>
            <p className="text-sm text-slate-500 font-medium">The principles that guide every product decision we make.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="glass-panel glass-panel-hover rounded-3xl p-7 space-y-4 bg-white">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">{v.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TEAM ─── 
      <section className="bg-slate-50 py-20 px-6 md:px-10 border-b border-slate-200">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black text-slate-900">The team behind it</h2>
            <p className="text-sm text-slate-500 font-medium">
              Former bid desk leaders, AI researchers and enterprise product veterans.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {team.map((member) => (
              <div key={member.name} className="glass-panel rounded-3xl p-6 flex items-start space-x-5 bg-white glass-panel-hover">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${member.bg} flex items-center justify-center font-extrabold text-white text-lg shrink-0 shadow-md`}
                >
                  {member.initials}
                </div>
                <div className="space-y-1.5">
                  <div className="font-extrabold text-slate-900">{member.name}</div>
                  <div className="text-xs font-bold text-blue-600">{member.role}</div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{member.bio}</p>
                  <div className="flex items-center space-x-2 pt-1">
                    <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href="#" className="text-slate-400 hover:text-sky-500 transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>*/}

      {/* ─── TIMELINE ─── 
      <section className="bg-white py-20 px-6 md:px-10 border-b border-slate-200">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black text-slate-900">Our journey so far</h2>
          </div>
          <div className="relative space-y-0">
            {/* vertical line 
            <div className="absolute left-[88px] top-2 bottom-2 w-0.5 bg-slate-200" />
            {milestones.map((m, i) => (
              <div key={m.year} className="flex items-start space-x-6 pb-8 relative">
                <div className="w-20 shrink-0 text-right">
                  <span className="text-sm font-extrabold text-blue-600">{m.year}</span>
                </div>
                <div className="relative shrink-0 mt-1">
                  <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md z-10 relative" />
                </div>
                <p className="text-sm text-slate-700 font-medium leading-relaxed pt-0.5">{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>*/}

      {/* ─── CTA ─── */}
      <section className="bg-slate-50 py-16 px-6 text-center border-b border-slate-200">
        <div className="max-w-xl mx-auto space-y-5">
          <h2 className="text-2xl font-black text-slate-900">Join us on the mission</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="px-7 py-3.5 rounded-xl gradient-bg text-white font-extrabold text-sm gradient-glow hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-7 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-sm hover:border-slate-300 transition-all"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
