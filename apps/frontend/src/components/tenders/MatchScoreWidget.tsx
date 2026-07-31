'use client';

import React from 'react';
import { MatchCalculation } from '../../types';
import { Award, CheckCircle2, Globe, Layers, ShieldCheck, XCircle } from 'lucide-react';

interface Props {
  matchDetails?: MatchCalculation | null;
  overallScore?: number | null;
}

export const MatchScoreWidget: React.FC<Props> = ({ matchDetails, overallScore }) => {
  const score = overallScore ?? matchDetails?.overallScore ?? 0;

  const getScoreColor = (val: number) => {
    if (val >= 85) return 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm';
    if (val >= 70) return 'bg-sky-50 text-sky-700 border-sky-300 shadow-sm';
    if (val >= 50) return 'bg-amber-50 text-amber-700 border-amber-300';
    return 'bg-rose-50 text-rose-700 border-rose-300';
  };

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-6 bg-white border border-slate-200 shadow-sm">
      {/* Header & Overall Dial */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Company Match Score
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Algorithmic score based on capability matrix & compliance parameters
          </p>
        </div>

        {/* Circular Percentage Badge */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-2xl font-black tracking-tight text-slate-900">{score}%</div>
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-blue-600">
              Match Score
            </div>
          </div>
          <div
            className={`w-14 h-14 rounded-2xl border flex items-center justify-center font-black text-xl shadow-sm ${getScoreColor(
              score,
            )}`}
          >
            {score}%
          </div>
        </div>
      </div>

      {/* Breakdown Metrics Bars */}
      {matchDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Industry Match */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                Industry Alignment
              </span>
              <span className="text-slate-900 font-extrabold">{matchDetails.industryMatchScore}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${matchDetails.industryMatchScore}%` }}
              />
            </div>
          </div>

          {/* Country Match */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-sky-600" />
                Geographic Coverage
              </span>
              <span className="text-slate-900 font-extrabold">{matchDetails.countryMatchScore}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${matchDetails.countryMatchScore}%` }}
              />
            </div>
          </div>

          {/* Certifications Match */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Certification Mandates
              </span>
              <span className="text-slate-900 font-extrabold">{matchDetails.certMatchScore}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${matchDetails.certMatchScore}%` }}
              />
            </div>
          </div>

          {/* Experience Match */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                Capability Overlap
              </span>
              <span className="text-slate-900 font-extrabold">{matchDetails.experienceScore}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${matchDetails.experienceScore}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Match Reasons List */}
      {matchDetails?.reasons && matchDetails.reasons.length > 0 && (
        <div className="space-y-2 pt-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Evaluation Explanations
          </span>
          <div className="space-y-2">
            {matchDetails.reasons.map((reason, idx) => {
              const isPositive = !reason.includes('Deficit') && !reason.includes('Mismatch') && !reason.includes('Gap') && !reason.includes('Exclusion');
              return (
                <div
                  key={idx}
                  className={`flex items-start space-x-2.5 p-3 rounded-xl text-xs border ${
                    isPositive
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  {isPositive ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-relaxed font-semibold">{reason}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
