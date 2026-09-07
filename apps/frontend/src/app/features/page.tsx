'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PublicNav } from '../../components/layout/PublicNav';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { useLanguage } from '../../lib/language-context';
import {
  Cpu, Award, ShieldCheck, Globe, FileText, BarChart3,
  CheckCircle2, ArrowRight, Zap, Lock, Bell,
} from 'lucide-react';

export default function FeaturesPage() {
  const { isFrench } = useLanguage();

  const tabs = isFrench
    ? ['Moteur IA de Pointe', 'Scoring & Adéquation', 'Pipeline & Workflow', 'Sécurité & Conformité']
    : ['Core AI Engine', 'Match & Scoring', 'Pipeline & Workflow', 'Security & Compliance'];

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const tabContentEn = [
    {
      heading: 'Gemini 1.5 Pro + OpenAI o3-mini & GPT-4o Dual-Model Pipeline',
      sub: 'Next-generation frontier AI models. One purpose-built African & global procurement engine.',
      features: [
        { icon: Cpu, title: 'Executive Summarizer', desc: 'Converts any RFP — regardless of format or length — into a crisp, structured executive summary with deliverables, milestones, and risks.' },
        { icon: Zap, title: 'Sub-5-Second Processing', desc: 'Parallel document parsing across both models ensures results are ready before your next coffee sip.' },
        { icon: FileText, title: 'SOW Extractor', desc: 'Statement of Work, technical requirements, and submission instructions pulled out as structured data, not just text.' },
      ],
      bullets: [
        'Dual-model reasoning: Gemini 1.5 Pro deep document context + OpenAI o3-mini / GPT-4o evaluation engine',
        'Multi-page PDF, Word and HTML document support',
        'Mandatory vs optional requirement categorisation',
        'Liquidated damages & penalty clause identification',
        'Exportable summary as PDF or Word document',
      ],
    },
    {
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
    {
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
    {
      heading: 'Enterprise-Grade Security. Zero Compromise.',
      sub: 'Your company data is your competitive advantage. We protect it like it.',
      features: [
        { icon: Lock, title: 'Encryption at Rest & Transit', desc: 'AES-256 encryption for all stored data. TLS 1.3 enforced for every API call and browser session.' },
        { icon: ShieldCheck, title: 'SOC 2 Type II Compliant', desc: 'Annual independent audit of our security controls, availability, and confidentiality commitments.' },
        { icon: Globe, title: 'Data Residency Options', desc: 'US, EU and African cloud tenancy zones available on Enterprise. Data never leaves your selected region.' },
      ],
      bullets: [
        'SAML 2.0 SSO (Okta, Azure AD, Google)',
        'Role-based access control (RBAC)',
        'Full audit log — every action recorded',
        'GDPR and local data protection compliant',
        'No customer data used for public model training',
      ],
    },
  ];

  const tabContentFr = [
    {
      heading: 'Pipeline Double Modèle IA : Gemini 1.5 Pro + OpenAI o3-mini & GPT-4o',
      sub: 'Les modèles d\'IA frontière les plus performants au monde. Un moteur dédié aux marchés publics africains et internationaux.',
      features: [
        { icon: Cpu, title: 'Synthèse Exécutive IA', desc: 'Transforme tout DAO ou dossier d\'appel d\'offres en une synthèse claire avec livrables clés, étapes jalons et risques juridiques.' },
        { icon: Zap, title: 'Traitement en Moins de 5 Secondes', desc: 'L\'analyse parallèle des deux modèles traite les dossiers de 100+ pages instantanément.' },
        { icon: FileText, title: 'Extraction Structurée du CCTP', desc: 'Le cahier des charges, les spécifications techniques et les exigences de dépôt sont extraits sous forme de données exploitables.' },
      ],
      bullets: [
        'Raisonnement double modèle : contexte long Gemini 1.5 Pro + moteur de validation critique OpenAI o3-mini / GPT-4o',
        'Prise en charge native des formats PDF, Word et archives volumineuses',
        'Classification des critères éliminatoires vs critères facultatifs',
        'Identification automatique des pénalités de retard et retenues de garantie',
        'Exportation de la fiche de synthèse au format PDF ou Word',
      ],
    },
    {
      heading: 'Algorithme d\'Adéquation Pondéré à 4 Vecteurs',
      sub: 'Un score objectif et basé sur vos données pour savoir exactement où vous vous situez.',
      features: [
        { icon: Award, title: 'Alignement Sectoriel (35%)', desc: 'Valide vos codes d\'activité et prestations principales par rapport à l\'expérience exigée par le maître d\'ouvrage.' },
        { icon: Globe, title: 'Couverture Géographique (25%)', desc: 'Vérifie la présence de votre entreprise dans le pays ou la région d\'exécution du marché.' },
        { icon: ShieldCheck, title: 'Conformité des Agréments (25%)', desc: 'ISO 9001, 27001, agréments ministériels, ordres professionnels — vérifiés par rapport à vos pièces déposées.' },
      ],
      bullets: [
        'Recalibration automatique du score à chaque mise à jour du profil d\'entreprise',
        'Pondération des références de marchés similaires antérieurs (15%)',
        'Matrice comparative des exigences satisfaites vs manquantes',
        'Historique de scoring dans le temps par catégorie de marché',
        'Filtre de seuil minimum de qualification personnalisable',
      ],
    },
    {
      heading: 'Pipeline Kanban d\'Offres & Alertes Échéances',
      sub: 'De la détection jusqu\'au dépôt du pli — suivi, organisé et notifié.',
      features: [
        { icon: FileText, title: 'Étapes du Pipeline Kanban', desc: 'Faites progresser vos opportunités : Repéré → À l\'Étude → En Soumission → Déposé → Adjugé d\'un simple geste.' },
        { icon: Bell, title: 'Alertes d\'Échéance Intelligentes', desc: 'Rappels automatisés à 30 jours, 7 jours et 24 heures avant la clôture par email et WhatsApp.' },
        { icon: BarChart3, title: 'Analytique du Taux de Succès', desc: 'Suivez vos performances par secteur et zone géographique. Identifiez les offres à plus fort ROI.' },
      ],
      bullets: [
        'Fils de discussion et annotations d\'équipe par opportunité',
        'Exportation complète du pipeline au format CSV ou présentation',
        'Synchronisation CRM (Salesforce et HubSpot sur le forfait Pro)',
        'Grilles d\'aide à la décision Go / No-Go',
        'Suivi du temps et du budget engagé par offre',
      ],
    },
    {
      heading: 'Sécurité de Niveau Entreprise. Zéro Compromis.',
      sub: 'Les données de votre entreprise constituent votre avantage concurrentiel. Nous les protégeons avec la plus haute exigence.',
      features: [
        { icon: Lock, title: 'Chiffrement au Repos & en Transit', desc: 'Chiffrement AES-256 pour toutes les données stockées. TLS 1.3 imposé pour tous les flux.' },
        { icon: ShieldCheck, title: 'Conformité SOC 2 Type II', desc: 'Audit annuel indépendant de nos contrôles de sécurité, disponibilité et confidentialité.' },
        { icon: Globe, title: 'Résidence des Données', desc: 'Zones d\'hébergement dédiées. Vos données ne quittent jamais la région sélectionnée.' },
      ],
      bullets: [
        'Authentification SSO SAML 2.0 (Okta, Azure AD, Google Workspace)',
        'Gestion des accès par rôles (RBAC) pour les équipes d\'offres',
        'Journal d\'audit exhaustif : chaque consultation et export est tracé',
        'Conformité stricte RGPD et lois sur la protection des données',
        'Aucune donnée client n\'est utilisée pour entraîner des modèles publics',
      ],
    },
  ];

  const content = isFrench ? tabContentFr[activeTabIndex] : tabContentEn[activeTabIndex];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <PublicNav />

      {/* Hero */}
      <section className="hero-mesh pt-20 pb-10 px-6 md:px-10 text-center">
        <div className="max-w-3xl mx-auto space-y-4 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            {isFrench ? (
              <>
                Tous les outils dont votre équipe a besoin.<br />
                <span className="gradient-text">Rien de superflu.</span>
              </>
            ) : (
              <>
                Every tool your bid desk needs.<br />
                <span className="gradient-text">Nothing it doesn&apos;t.</span>
              </>
            )}
          </h1>
          <p className="text-base text-slate-600 font-medium leading-relaxed max-w-xl mx-auto">
            {isFrench
              ? 'Une suite complète d\'intelligence des marchés publics propulsée par l\'IA — de la détection du DAO jusqu\'au suivi de l\'adjudication.'
              : 'A complete AI-powered procurement intelligence stack — from raw RFP ingestion to winning submission tracking.'}
          </p>
          <Link
            href="/register"
            className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl gradient-bg text-white font-extrabold text-sm gradient-glow hover:scale-[1.02] transition-all"
          >
            <span>{isFrench ? 'Tester Toutes les Fonctionnalités' : 'Try All Features Free'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="sticky top-16 z-30 bg-white border-b border-slate-200 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex overflow-x-auto">
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveTabIndex(idx)}
              className={`px-5 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                activeTabIndex === idx
                  ? 'text-emerald-600 border-emerald-600'
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
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">{f.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="glass-panel rounded-3xl p-8 bg-slate-50 max-w-2xl mx-auto">
            <h4 className="text-sm font-extrabold text-slate-900 mb-4">
              {isFrench ? 'Également inclus :' : 'Also included:'}
            </h4>
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
          <h2 className="text-2xl font-black text-slate-900">
            {isFrench ? 'Prêt à le voir en action ?' : 'Ready to see it in action?'}
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            {isFrench
              ? 'Essai gratuit de 14 jours · Sans carte bancaire · Opérationnel en 30 minutes'
              : '14-day free trial · No credit card needed · Live in 30 minutes'}
          </p>
          <Link
            href="/register"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl gradient-bg text-white font-extrabold text-sm gradient-glow hover:scale-[1.02] transition-all"
          >
            <span>{isFrench ? 'Démarrer l\'Essai Gratuit' : 'Start Free Trial'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
