'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowRight, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  missingFields: string[];
  companyName?: string;
}

export const IncompleteProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  missingFields,
  companyName = 'your company',
}) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleNavigate = () => {
    onClose();
    router.push('/company');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 z-10 space-y-6 animate-scale-in text-slate-900">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon + Title */}
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shadow-sm">
            <AlertTriangle className="w-6 h-6 text-amber-600 animate-pulse" />
          </div>

          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200">
              Action Required to Bid
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2">
              Complete Your Capability Profile
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed font-medium">
              To evaluate eligibility and prepare your bid dossier as <strong>{companyName}</strong>, please complete your self-declared capability profile. <em>Takes only 2 minutes — no confidential document upload required to start.</em>
            </p>
          </div>
        </div>

        {/* Missing Requirements List */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Missing Profile Information ({missingFields.length})
          </span>
          <ul className="space-y-2">
            {missingFields.map((field) => (
              <li key={field} className="flex items-start space-x-2 text-xs text-slate-800 font-medium">
                <span className="text-amber-600 font-bold text-sm leading-none">•</span>
                <span>{field}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Privacy & Trust Badge */}
        <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-[11px] text-emerald-900 flex items-center gap-2">
          <span className="text-sm">🔒</span>
          <span><strong>100% Confidential:</strong> Your information is strictly used for eligibility matching and proposal preparation. Never shared with third parties.</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleNavigate}
            className="w-full sm:flex-1 py-3 px-5 rounded-2xl gradient-bg text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 hover:opacity-95 transition-all flex items-center justify-center space-x-2"
          >
            <span>Complete Profile (2 mins)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            Review Tender First
          </button>
        </div>

        <p className="text-[10px] text-center text-slate-400 font-medium pt-1">
          Governed by Bidora&apos;s{' '}
          <a href="/terms" target="_blank" className="text-slate-600 underline font-bold hover:text-emerald-700">
            Terms of Service &amp; Procurement Disclaimers
          </a>
          .
        </p>
      </div>
    </div>
  );
};
