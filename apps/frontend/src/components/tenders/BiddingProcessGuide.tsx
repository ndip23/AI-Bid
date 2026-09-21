'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../lib/language-context';
import {
  Compass,
  FileCheck2,
  Calculator,
  Send,
  Truck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const BiddingProcessGuide: React.FC = () => {
  const { isFrench } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-3xl border border-slate-800 text-white p-5 md:p-7 shadow-xl relative overflow-hidden transition-all duration-300">
      {/* Background Subtle Accent Gradients */}
      <div className="absolute -right-20 -top-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                {isFrench ? 'Guide de Soumission' : 'Bidding Roadmap'}
              </span>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                {isFrench ? '3 étapes simples pour remporter vos marchés' : '3 simple steps to win procurement contracts'}
              </span>
            </div>
            <h3 className="text-base md:text-lg font-black tracking-tight text-white mt-0.5">
              {isFrench ? 'Comment Fonctionne Bidora : Gagner un Marché en 3 Étapes' : 'How Bidora Works: Win & Submit Bids in 3 Steps'}
            </h3>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer"
        >
          <span>{isOpen ? (isFrench ? 'Masquer le Guide' : 'Hide Guide') : (isFrench ? 'Afficher le Guide' : 'Show Guide')}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable Steps Section */}
      {isOpen && (
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10 animate-fade-in">
          {/* Step 1: Match & Qualify */}
          <div className="bg-slate-800/60 hover:bg-slate-800/90 rounded-2xl p-4 md:p-5 border border-slate-700/60 hover:border-emerald-500/40 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-black text-xs flex items-center justify-center border border-emerald-500/30">
                  01
                </span>
                <Sparkles className="w-4 h-4 text-emerald-400 opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
              <h4 className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors">
                {isFrench ? '1. Évaluation & Adéquation IA' : '1. AI Match & Qualification'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isFrench
                  ? 'Le Copilote compare instantanément votre entreprise aux critères d\'éligibilité (chiffre d\'affaires, agréments ARMP, conformité fiscale).'
                  : 'AI scans live procurement notices against your company profile (turnover, licenses, tax clearance, technical capabilities).'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-[11px] font-bold text-emerald-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isFrench ? 'Score ≥ 80% recommandé' : 'Target score ≥ 80%'}
              </span>
              <Link href="/tenders?minScore=80" className="hover:underline flex items-center gap-0.5">
                {isFrench ? 'Explorer' : 'Explore'} &rarr;
              </Link>
            </div>
          </div>

          {/* Step 2: AI Dossier & Caution Calculator */}
          <div className="bg-slate-800/60 hover:bg-slate-800/90 rounded-2xl p-4 md:p-5 border border-slate-700/60 hover:border-sky-500/40 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 font-mono font-black text-xs flex items-center justify-center border border-sky-500/30">
                  02
                </span>
                <Calculator className="w-4 h-4 text-sky-400 opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
              <h4 className="text-sm font-black text-white group-hover:text-sky-300 transition-colors">
                {isFrench ? '2. Dossier & Calcul de Caution' : '2. Dossier & Bid Bond Calculation'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isFrench
                  ? 'Consultez la synthèse des pièces exigées, les clauses éliminatoires et calculez la caution bancaire (1% à 2%) avec les banques agréées.'
                  : 'Review required technical documents, eliminatory clauses, and calculate mandatory bank guarantees (1-2% bid bonds).'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-[11px] font-bold text-sky-400">
              <span className="flex items-center gap-1">
                <FileCheck2 className="w-3.5 h-3.5" />
                {isFrench ? 'Checklist administrative' : 'Compliance checklist'}
              </span>
              <span className="text-slate-400 font-mono text-[10px]">COBAC / CEMAC</span>
            </div>
          </div>

          {/* Step 3: Physical Submission or Runner Dispatch */}
          <div className="bg-slate-800/60 hover:bg-slate-800/90 rounded-2xl p-4 md:p-5 border border-slate-700/60 hover:border-amber-500/40 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-black text-xs flex items-center justify-center border border-amber-500/30">
                  03
                </span>
                <Truck className="w-4 h-4 text-amber-400 opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
              <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                {isFrench ? '3. Dépôt Physique ou Coursier Dédié' : '3. Physical Drop-off or Runner Service'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isFrench
                  ? 'Imprimez les étiquettes officielles à 3 plis scellés (Admin, Technique, Financière) ou mandatez notre coursier assermenté à Yaoundé / Douala.'
                  : 'Print official 3-envelope sealed labels (Admin, Technical, Financial) or dispatch our certified physical filing runner in Yaoundé / Douala.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-[11px] font-bold text-amber-400">
              <a
                href="https://wa.me/237683616584?text=Bonjour%20Bidora%20Runner,%20j%27ai%20besoin%20d%27assistance%20pour%20le%20d%C3%A9p%C3%B4t%20physique%20d%27un%20dossier%20d%27appel%20d%27offres."
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
              >
                <Send className="w-3 h-3" />
                <span>+237 683 616 584</span>
              </a>
              <span className="text-slate-400 text-[10px] font-mono">
                {isFrench ? 'Guichet ARMP' : 'ARMP Desk'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
