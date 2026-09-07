'use client';

import React from 'react';
import Link from 'next/link';
import { PublicNav } from '../../components/layout/PublicNav';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { useLanguage } from '../../lib/language-context';
import {
  Sparkles, ArrowRight, Users, Target, Globe, Rocket,
  ShieldCheck, Heart,
} from 'lucide-react';

export default function AboutPage() {
  const { isFrench } = useLanguage();

  const values = isFrench ? [
    {
      icon: Target,
      title: 'La Précision avant le Volume',
      desc: 'Nous sommes convaincus que les équipes d\'offres doivent concentrer leurs efforts sur les marchés qu\'elles peuvent remporter — et non perdre leur temps sur des centaines d\'avis inadaptés. Chaque outil sépare le signal utile du bruit.',
    },
    {
      icon: ShieldCheck,
      title: 'La Confiance comme Socle',
      desc: 'Les données d\'agréments et références de votre entreprise sont votre atout stratégique. Elles sont chiffrées, strictement cloisonnées, jamais divulguées ni exploitées pour l\'entraînement de modèles publics.',
    },
    {
      icon: Users,
      title: 'Conçu pour les Équipes Terrain',
      desc: 'Nous avons collaboré pendant des mois avec des directions de marchés avant de concevoir la plateforme. Chaque étape reproduit fidèlement les processus réels des directeurs de réponse aux appels d\'offres.',
    },
    {
      icon: Globe,
      title: 'Une Portée Internationale Native',
      desc: 'La commande publique dépasse les frontières. ARMP, TED Europe, UK Find-a-Tender, Banque Mondiale, UNGM — notre architecture a été pensée multirégionale dès le premier jour.',
    },
    {
      icon: Rocket,
      title: 'La Rapidité Fait Gagner des Marchés',
      desc: 'Une synthèse d\'appel d\'offres en 5 secondes contre 3 jours d\'analyse fastidieuse. Notre rapidité de traitement permet à votre équipe de soumissionner à davantage de marchés sans fatigue administrative.',
    },
    {
      icon: Heart,
      title: 'Le Succès Client est Notre Succès',
      desc: 'Nous mesurons notre impact au taux d\'adjudication réel de nos clients. Chaque amélioration technique est évaluée à l\'aune de son efficacité pour vous faire remporter des marchés.',
    },
  ] : [
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

  const stats = isFrench ? [
    { value: '500+', label: 'Équipes d\'offres actives' },
    { value: '48 Mrd$+', label: 'Volume de marchés suivi' },
    { value: '6', label: 'Bases de marchés publiques connectées' },
    { value: '94%', label: 'Précision moyenne d\'adéquation' },
  ] : [
    { value: '500+', label: 'Enterprise teams' },
    { value: '$48B+', label: 'Pipeline value tracked' },
    { value: '6', label: 'Global procurement databases' },
    { value: '94%', label: 'Average match accuracy' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <PublicNav />

      {/* ─── HERO ─── */}
      <section className="hero-mesh pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {isFrench ? (
              <>
                Nous avons conçu l&apos;outil que nous aurions rêvé d&apos;avoir<br />
                <span className="gradient-text">lorsque nous pilotions des appels d&apos;offres.</span>
              </>
            ) : (
              <>
                We built the tool we wished existed<br />
                <span className="gradient-text">when we ran bid desks.</span>
              </>
            )}
          </h1>
          <p className="text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            {isFrench
              ? 'L\'évaluation d\'appels d\'offres complexes exige des heures d\'analyse documentaire, de recoupement des critères administratifs éliminatoires et de vérification des capacités. Bidora a été développé pour lever ces blocages — en offrant aux équipes une intelligence documentaire instantanée, la vérification automatique de l\'éligibilité et un scoring d\'adéquation objectif.'
              : 'Evaluating complex RFPs requires hours of manual document parsing, cross-referencing compliance requirements, and verifying organizational capability. Bidora was engineered to eliminate this friction—empowering procurement and proposal teams with instant document intelligence, automated eligibility verification, and objective match scoring.'}
          </p>
          <p className="text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            {isFrench
              ? 'Grâce à notre pipeline IA double modèle de pointe (Gemini 1.5 Pro + GPT-4o), les responsables d\'appels d\'offres écartent immédiatement les dossiers non viables pour concentrer leurs forces sur les contrats à forte probabilité de succès.'
              : 'By leveraging advanced multi-model AI pipelines, we help capture managers filter out non-viable opportunities early and focus their resources on high-probability bids.'}
          </p>
        </div>
      </section>

      {/* ─── STATS BAND ─── */}
      <section className="bg-slate-900 py-12 px-6 md:px-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
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
            <h2 className="text-3xl font-black text-slate-900">
              {isFrench ? 'Ce en quoi nous croyons' : 'What we believe'}
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              {isFrench
                ? 'Les principes fondamentaux qui orientent chacune de nos évolutions produit.'
                : 'The principles that guide every product decision we make.'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="glass-panel glass-panel-hover rounded-3xl p-7 space-y-4 bg-white">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
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

      {/* ─── CTA ─── */}
      <section className="bg-slate-50 py-16 px-6 text-center border-b border-slate-200">
        <div className="max-w-xl mx-auto space-y-5">
          <h2 className="text-2xl font-black text-slate-900">
            {isFrench ? 'Rejoignez l\'aventure avec nous' : 'Join us on the mission'}
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="px-7 py-3.5 rounded-xl gradient-bg text-white font-extrabold text-sm gradient-glow hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
            >
              <span>{isFrench ? 'Démarrer l\'Essai Gratuit' : 'Start Free Trial'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-7 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-sm hover:border-slate-300 transition-all"
            >
              {isFrench ? 'Échanger avec l\'Équipe' : 'Talk to Sales'}
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
