'use client';

import React from 'react';
import { MatchCalculation } from '../../types';
import { CheckCircle2, XCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Props {
  matchDetails?: MatchCalculation | null;
}

export const EligibilityChecklist: React.FC<Props> = ({ matchDetails }) => {
  if (!matchDetails) return null;

  const met = matchDetails.metRequirements || [];
  const missing = matchDetails.missingRequirements || [];

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-6 bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Eligibility & Compliance Checklist
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Automated verification of company capabilities against tender specifications
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            ✔ {met.length} Met
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
            ❌ {missing.length} Missing
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Met Requirements */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Met Requirements ({met.length})
          </h4>
          {met.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 font-medium">
              No matching requirements verified.
            </div>
          ) : (
            <div className="space-y-2">
              {met.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-start space-x-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Missing Requirements */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
            <XCircle className="w-4 h-4" />
            Missing Requirements ({missing.length})
          </h4>
          {missing.length === 0 ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              100% Full Eligibility Coverage! All mandatory requirements satisfied.
            </div>
          ) : (
            <div className="space-y-2">
              {missing.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 font-semibold flex items-start space-x-2.5"
                >
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="leading-relaxed block">{item}</span>
                    <span className="text-[10px] text-rose-600 italic block font-medium">
                      Recommendation: Add partner or update capability profile.
                    </span>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <Link
                  href="/company"
                  className="inline-flex items-center text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Update Company Capability Profile <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
