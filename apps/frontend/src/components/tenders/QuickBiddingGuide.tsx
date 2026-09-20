'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  FileCheck2,
  Send,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  FolderArchive,
  ArrowRight,
  ShieldCheck,
  Building,
  Info,
} from 'lucide-react';
import { Tender } from '../../types';
import { useLanguage } from '../../lib/language-context';

interface Props {
  tender: Tender;
  activeTab: string;
  onSelectTab: (tab: 'summary' | 'specs' | 'docs' | 'match' | 'checklist' | 'workspace') => void;
  onOpenSubmitModal: () => void;
}

export const QuickBiddingGuide: React.FC<Props> = ({
  tender,
  activeTab,
  onSelectTab,
  onOpenSubmitModal,
}) => {
  const { isFrench } = useLanguage();
  const [showFaq, setShowFaq] = useState(false);

  const officialUrl =
    tender.sourceUrl ||
    `https://projects.worldbank.org/en/projects-operations/project-detail/${tender.refNumber}`;

  return (
    <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-5 md:p-6 shadow-md border border-slate-700/60 space-y-5">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase tracking-wider">
              {isFrench ? 'Guide de Soumission Pas-à-Pas' : 'Self-Service Bidding Guide'}
            </span>
            <span className="text-xs text-slate-300 font-medium">
              {isFrench ? 'Postulez en 3 étapes simples' : 'Apply in 3 simple steps'}
            </span>
          </div>
          <h2 className="text-sm md:text-base font-extrabold text-white">
            {isFrench
              ? 'Comment Postuler à cet Appel d’Offres (Sans Assistance)'
              : 'How to Bid on this Tender (Autonomous & Simple)'}
          </h2>
        </div>

        <button
          onClick={() => setShowFaq(!showFaq)}
          className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/10"
        >
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isFrench ? 'Besoin d’Aide ? (FAQ Rapide)' : 'How it works (FAQ)'}</span>
          {showFaq ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 3 Interactive Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Step 1: Check Eligibility */}
        <div
          onClick={() => onSelectTab('summary')}
          className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
            activeTab === 'summary' || activeTab === 'checklist'
              ? 'bg-emerald-500/15 border-emerald-400 ring-1 ring-emerald-400/40'
              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
                1
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                {isFrench ? 'Étape 1 : Vérification' : 'Step 1 : Check'}
              </span>
            </div>
            <h3 className="text-xs font-bold text-white">
              {isFrench ? 'Vérifier votre Éligibilité' : 'Verify Your Eligibility'}
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isFrench
                ? 'L\'IA compare votre profil d\'entreprise avec les critères obligatoires du DAO.'
                : 'Review AI match score and required certifications before investing time.'}
            </p>
          </div>
          <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-400">
            <span>{isFrench ? 'Voir Résumé & Critères' : 'View AI Summary & Match'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Step 2: Prepare 3-Envelope Package */}
        <div
          onClick={() => onSelectTab('docs')}
          className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
            activeTab === 'docs'
              ? 'bg-sky-500/15 border-sky-400 ring-1 ring-sky-400/40'
              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-sky-400 text-slate-950 font-black text-xs flex items-center justify-center">
                2
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-300">
                {isFrench ? 'Étape 2 : Dossier' : 'Step 2 : Prepare'}
              </span>
            </div>
            <h3 className="text-xs font-bold text-white">
              {isFrench ? 'Rassembler le Dossier (12 Pièces)' : 'Assemble Dossier (12 Docs)'}
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isFrench
                ? 'Les 3 plis réglementaires : Administratif (RCCM, Fisc), Technique, et Financier.'
                : 'Complete the 3 envelopes: Admin (Tax, Social Security), Technical, and Financial.'}
            </p>
          </div>
          <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-sky-400">
            <span>{isFrench ? 'Ouvrir les 12 Pièces' : 'Open 12 Documents List'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Step 3: Finalize & Submit */}
        <div
          onClick={onOpenSubmitModal}
          className="p-4 rounded-xl border border-emerald-400/50 bg-gradient-to-br from-emerald-600/30 to-teal-700/30 hover:from-emerald-600/40 hover:to-teal-700/40 transition-all cursor-pointer relative flex flex-col justify-between shadow-sm"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center">
                3
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                {isFrench ? 'Étape 3 : Dépôt' : 'Step 3 : Submit'}
              </span>
            </div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{isFrench ? 'Déposer l’Offre / Soumissionner' : 'Submit Application / Bid'}</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-400 text-slate-900 text-[9px] font-black uppercase">
                {isFrench ? 'Direct' : 'Fast'}
              </span>
            </h3>
            <p className="text-[11px] text-slate-200 leading-relaxed">
              {isFrench
                ? 'Accédez directement au portail officiel acheteur ou téléchargez l’archive complète.'
                : 'Get the official portal upload link or download the bundled 3-envelope submission package.'}
            </p>
          </div>
          <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between text-xs font-black text-emerald-300">
            <span>{isFrench ? 'Lancer la Soumission' : 'Start Submission Now'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Expandable Fast FAQ for Beginners */}
      {showFaq && (
        <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 animate-fadeIn">
          <div className="space-y-1.5 bg-white/5 p-3 rounded-xl border border-white/10">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isFrench ? 'Où est déposée mon offre ?' : 'Where does my bid get submitted?'}</span>
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isFrench
                ? `Cette offre est émise par "${tender.buyerName}". Vous pouvez déposer en ligne sur le portail officiel de l’acheteur ou déposer physiquement au bureau des marchés avant la date limite.`
                : `This tender is issued by "${tender.buyerName}". You can submit online via the official portal or deliver the sealed package physically before the closing deadline.`}
            </p>
            {tender.sourceUrl && (
              <a
                href={tender.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:underline pt-1"
              >
                <span>{isFrench ? 'Voir le portail officiel de l\'acheteur' : 'Visit Official Buyer Portal'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="space-y-1.5 bg-white/5 p-3 rounded-xl border border-white/10">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isFrench ? 'Quels documents dois-je fournir ?' : 'What documents are needed?'}</span>
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isFrench
                ? 'Généralement : le registre de commerce (RCCM), le quitus fiscal (Non-Redevance < 3 mois), l’attestation CNPS, la caution de soumission (1-2%), votre méthodologie et votre devis quantitatif.'
                : 'Standard public contracts require: Trade registry (RCCM), tax clearance (< 3 months), social security certificate, a 1-2% bank bid bond, your technical methodology, and your price quote.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
