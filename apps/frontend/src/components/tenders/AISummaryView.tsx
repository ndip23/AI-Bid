'use client';

import React from 'react';
import { AiSummary } from '../../types';
import { Sparkles, Calendar, AlertTriangle, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

interface Props {
  summary?: AiSummary | null;
}

export const AISummaryView: React.FC<Props> = ({ summary }) => {
  if (!summary) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center space-y-3 bg-white border border-slate-200">
        <Sparkles className="w-8 h-8 text-blue-600 mx-auto animate-pulse" />
        <h4 className="text-slate-900 font-extrabold text-base">Generating AI Executive Summary</h4>
        <p className="text-slate-500 text-xs max-w-md mx-auto font-medium">
          AI Bid Copilot is parsing specifications, extracting requirements, and evaluating risk factors...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Executive Summary Card */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 text-blue-700 font-extrabold text-sm mb-3">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>AI Executive Summary</span>
        </div>

        <p className="text-slate-800 text-sm leading-relaxed font-medium bg-slate-50 border border-slate-200 p-4 rounded-xl">
          {summary.executiveSummary}
        </p>
      </div>

      {/* Grid: Key Requirements & Deliverables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Requirements */}
        <div className="glass-panel rounded-2xl p-6 space-y-4 bg-white border border-slate-200 shadow-sm">
          <h4 className="text-slate-900 font-extrabold text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
            Mandatory Requirements
          </h4>
          <div className="space-y-2.5">
            {summary.requirements.map((req) => (
              <div
                key={req.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between space-x-3 text-xs"
              >
                <div className="space-y-1">
                  <span className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 border border-slate-300">
                    {req.category}
                  </span>
                  <p className="text-slate-800 font-semibold leading-normal">{req.description}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    req.isMandatory
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {req.isMandatory ? 'Mandatory' : 'Optional'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Deliverables & Scope */}
        <div className="glass-panel rounded-2xl p-6 space-y-4 bg-white border border-slate-200 shadow-sm">
          <h4 className="text-slate-900 font-extrabold text-sm flex items-center gap-2">
            <FileText className="w-4.5 h-4.5 text-blue-600" />
            Deliverables & Timeline
          </h4>

          {/* Deadline Summary Box */}
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs space-y-1">
            <div className="flex items-center space-x-1.5 text-blue-700 font-bold">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Key Schedule & Cutoffs</span>
            </div>
            <p className="text-slate-700 font-medium leading-relaxed">{summary.deadlineSummary}</p>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Core Scope Items
            </span>
            {summary.deliverables.map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold flex items-center space-x-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Identified Risk Matrix */}
      <div className="glass-panel rounded-2xl p-6 space-y-4 bg-white border border-slate-200 shadow-sm">
        <h4 className="text-slate-900 font-extrabold text-sm flex items-center gap-2">
          <ShieldAlert className="w-4.5 h-4.5 text-rose-600" />
          AI Risk Assessment Matrix
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {summary.risks.map((r) => {
            const isHigh = r.severity === 'HIGH';
            return (
              <div
                key={r.id}
                className={`p-4 rounded-xl border text-xs space-y-2 ${
                  isHigh
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <AlertTriangle className={`w-3.5 h-3.5 ${isHigh ? 'text-rose-600' : 'text-amber-600'}`} />
                    {r.risk}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                      isHigh ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                    }`}
                  >
                    {r.severity}
                  </span>
                </div>
                <div className="text-slate-700 pt-1 border-t border-slate-200/80 font-medium">
                  <span className="font-bold text-slate-900">Mitigation: </span>
                  {r.mitigation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
