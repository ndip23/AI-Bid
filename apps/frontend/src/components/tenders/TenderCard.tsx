'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Tender, SavedStatus } from '../../types';
import { ApiClient } from '../../lib/api-client';
import { useToast } from '../../lib/toast-context';
import { Bookmark, Calendar, Globe, Sparkles, ChevronRight, Check } from 'lucide-react';

interface Props {
  tender: Tender;
  onSavedChange?: () => void;
}

export const TenderCard: React.FC<Props> = ({ tender, onSavedChange }) => {
  const [isSaved, setIsSaved] = useState(tender.isSaved || false);
  const [savedStatus, setSavedStatus] = useState<SavedStatus>(tender.savedStatus || 'BOOKMARKED');
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (val: number, curr: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr || 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const calculateDaysLeft = (deadlineStr: string) => {
    const deadline = new Date(deadlineStr).getTime();
    const now = new Date().getTime();
    const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days left` : 'Expired';
  };

  const handleToggleSave = async (status: SavedStatus = 'BOOKMARKED') => {
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

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-4 relative flex flex-col justify-between group bg-white border border-slate-200 shadow-sm">
      <div>
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 tracking-wider">
              {tender.industry}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              {tender.buyerCountry}
            </span>
          </div>

          {/* Match Score Badge */}
          {tender.matchScore !== undefined && tender.matchScore !== null && (
            <div className={`px-2.5 py-1 rounded-xl border text-xs font-extrabold flex items-center space-x-1 ${getScoreBadgeColor(tender.matchScore)}`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{tender.matchScore}% Match</span>
            </div>
          )}
        </div>

        {/* Title */}
        <Link href={`/tenders/${tender.id}`} className="group-hover:text-blue-600 transition-colors">
          <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
            {tender.title}
          </h3>
        </Link>
        <p className="text-xs text-slate-500 mt-1 font-mono">{tender.refNumber} • {tender.buyerName}</p>

        {/* Snippet */}
        <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed font-medium">
          {tender.description}
        </p>
      </div>

      {/* Footer Details & Action Bar */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Budget</span>
            <span className="font-extrabold text-slate-900">
              {formatCurrency(tender.estimatedValue, tender.currency)}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Closing Date</span>
            <span className="font-bold text-sky-700 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {calculateDaysLeft(tender.deadline)}
            </span>
          </div>
        </div>

        {/* Save / Pipeline Button */}
        <div className="flex items-center space-x-2 relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all ${
              isSaved
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-600 text-blue-600' : ''}`} />
            <span>{isSaved ? savedStatus.replace('_', ' ') : 'Save Tender'}</span>
          </button>

          {showStatusMenu && (
            <div className="absolute right-0 bottom-10 w-40 bg-white border border-slate-200 rounded-xl shadow-xl p-1 z-50 text-xs">
              {(['BOOKMARKED', 'UNDER_REVIEW', 'BIDDING', 'PASSED'] as SavedStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => handleToggleSave(status)}
                  className="w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between font-bold"
                >
                  <span>{status.replace('_', ' ')}</span>
                  {savedStatus === status && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}

          <Link
            href={`/tenders/${tender.id}`}
            className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
