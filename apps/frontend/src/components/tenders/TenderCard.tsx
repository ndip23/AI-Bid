'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Tender, SavedStatus } from '../../types';
import { ApiClient } from '../../lib/api-client';
import { useToast } from '../../lib/toast-context';
import { useAuth } from '../../lib/auth-context';
import { checkProfileCompleteness } from '../../lib/profile-utils';
import { IncompleteProfileModal } from '../ui';
import { formatCurrency } from '../../lib/formatters';
import { Bookmark, Calendar, Globe, Sparkles, ChevronRight, Check } from 'lucide-react';
import { useLanguage } from '../../lib/language-context';

interface Props {
  tender: Tender;
  onSavedChange?: () => void;
}

export const TenderCard: React.FC<Props> = ({ tender, onSavedChange }) => {
  const { t, lang } = useLanguage();
  const [isSaved, setIsSaved] = useState(tender.isSaved || false);
  const [savedStatus, setSavedStatus] = useState<SavedStatus>(tender.savedStatus || 'BOOKMARKED');
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const { toast } = useToast();
  const { company } = useAuth();
  const router = useRouter();

  const calculateDaysLeft = (deadlineStr: string) => {
    const deadline = new Date(deadlineStr).getTime();
    const now = new Date().getTime();
    const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    return diffDays > 0
      ? (lang === 'fr' ? `${diffDays} j restants` : `${diffDays} days left`)
      : (lang === 'fr' ? 'Clôturé' : 'Expired');
  };

  const getStatusLabel = (st: SavedStatus) => {
    if (lang === 'fr') {
      switch (st) {
        case 'BOOKMARKED': return 'Favoris';
        case 'UNDER_REVIEW': return 'À l\'Étude';
        case 'BIDDING': return 'En Soumission';
        case 'PASSED': return 'Non Retenu';
      }
    }
    return st.replace('_', ' ');
  };

  const handleToggleSave = async (status: SavedStatus = 'BOOKMARKED') => {
    if (status === 'BIDDING') {
      const completeness = checkProfileCompleteness(company);
      if (!completeness.isComplete) {
        setShowStatusMenu(false);
        setShowIncompleteModal(true);
        toast.error('Capability Profile Incomplete', 'You must fill and submit your company credentials to enter the Bidding stage.');
        return;
      }
    }

    try {
      await ApiClient.saveTender(tender.id, status);
      setIsSaved(true);
      setSavedStatus(status);
      setShowStatusMenu(false);
      toast.success('Tender Saved to Pipeline!', `Moved to ${status.replace('_', ' ')} tracking stage.`);
      onSavedChange?.();
    } catch (e) {
      toast.error('Failed to save tender');
    }
  };

  const getScoreBadgeColor = (score: number | null | undefined) => {
    if (!score) return 'bg-slate-100 text-slate-500 border-slate-200';
    if (score >= 85) return 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm';
    if (score >= 70) return 'bg-sky-50 text-sky-700 border-sky-300 shadow-sm';
    return 'bg-amber-50 text-amber-700 border-amber-300';
  };

  const handleCardClick = () => {
    router.push(`/tenders/${tender.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-4 relative flex flex-col justify-between group bg-white border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-all hover:border-emerald-300"
    >
      <div>
        {/* Top Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 tracking-wider">
              {tender.industry}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              {tender.buyerCountry}
            </span>
          </div>

          {/* Match Score Badge */}
          {tender.matchScore !== undefined && tender.matchScore !== null && (
            <div className={`px-2.5 py-1 rounded-xl border text-xs font-extrabold flex items-center space-x-1 shrink-0 ${getScoreBadgeColor(tender.matchScore)}`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{tender.matchScore}% {lang === 'fr' ? 'Adéquation' : 'Match'}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <Link href={`/tenders/${tender.id}`} onClick={(e) => e.stopPropagation()} className="group-hover:text-emerald-700 transition-colors">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 leading-snug">
            {tender.title}
          </h3>
        </Link>
        <p className="text-xs text-slate-500 mt-1 font-mono truncate">{tender.refNumber} • {tender.buyerName}</p>

        {/* Snippet */}
        <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed font-medium">
          {tender.description}
        </p>
      </div>

      {/* Footer Details & Action Bar */}
      <div className="pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Budget</span>
            <span className="font-extrabold text-slate-900">
              {formatCurrency(tender.estimatedValue, tender.currency)}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Closing Date</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {calculateDaysLeft(tender.deadline)}
            </span>
          </div>
        </div>

        {/* Save / Pipeline Button */}
        <div className="flex items-center space-x-2 relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowStatusMenu(!showStatusMenu);
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all ${
              isSaved
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-600 text-emerald-600' : ''}`} />
            <span>{isSaved ? getStatusLabel(savedStatus) : (lang === 'fr' ? 'Enregistrer' : 'Save Tender')}</span>
          </button>

          {showStatusMenu && (
            <div className="absolute right-0 bottom-10 w-40 bg-white border border-slate-200 rounded-xl shadow-xl p-1 z-50 text-xs">
              {(['BOOKMARKED', 'UNDER_REVIEW', 'BIDDING', 'PASSED'] as SavedStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleSave(status);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center justify-between font-bold"
                >
                  <span>{getStatusLabel(status)}</span>
                  {savedStatus === status && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              ))}
            </div>
          )}

          <Link
            href={`/tenders/${tender.id}`}
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Warning Modal if Capability Profile is Incomplete */}
      <IncompleteProfileModal
        isOpen={showIncompleteModal}
        onClose={() => setShowIncompleteModal(false)}
        missingFields={checkProfileCompleteness(company).missingFields}
        companyName={company?.name || 'your company'}
      />
    </div>
  );
};

