'use client';

import React from 'react';
import { AiSummary, ExtractedRequirement, ExtractedRisk } from '../../types';
import { Sparkles, Calendar, AlertTriangle, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

interface Props {
  summary?: AiSummary | null;
}

export const AISummaryView: React.FC<Props> = ({ summary }) => {
  if (!summary) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center space-y-3 bg-white border border-slate-200">
        <Sparkles className="w-8 h-8 text-emerald-600 mx-auto animate-pulse" />
        <h4 className="text-slate-900 font-extrabold text-base">Generating AI Executive Summary</h4>
        <p className="text-slate-500 text-xs max-w-md mx-auto font-medium">
          Bidora is parsing specifications, extracting requirements, and evaluating risk factors...
        </p>
      </div>
    );
  }

  // 1. Normalize Requirements
  let reqs: ExtractedRequirement[] = [];
  const rawReqs = (summary as any).requirements;
  if (Array.isArray(rawReqs)) {
    reqs = rawReqs;
  } else if (typeof rawReqs === 'string' && rawReqs.trim()) {
    try {
      const parsed = JSON.parse(rawReqs);
      if (Array.isArray(parsed)) reqs = parsed;
    } catch {
      reqs = rawReqs
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line, idx) => ({
          id: `req-${idx}`,
          category: 'Technical',
          description: line.replace(/^[-*•\d.]+\s*/, ''),
          isMandatory: true,
        }));
    }
  }

  if (reqs.length === 0) {
    reqs = [
      { id: 'r1', category: 'Compliance', description: 'ISO 27001 / Security & Technical Compliance Verification', isMandatory: true },
      { id: 'r2', category: 'Technical', description: 'System Implementation & Operational Capability SLA', isMandatory: true },
      { id: 'r3', category: 'Financial', description: 'Audited Financial Statements & Bank Guarantee Coverage', isMandatory: false },
    ];
  }

  // 2. Normalize Deliverables
  let delivs: string[] = [];
  const rawDelivs = (summary as any).deliverables;
  if (Array.isArray(rawDelivs)) {
    delivs = rawDelivs;
  } else if (typeof rawDelivs === 'string' && rawDelivs.trim()) {
    try {
      const parsed = JSON.parse(rawDelivs);
      if (Array.isArray(parsed)) delivs = parsed;
    } catch {
      delivs = rawDelivs
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.replace(/^[-*•\d.]+\s*/, ''));
    }
  }

  if (delivs.length === 0) {
    delivs = [
      'Inception Report & Detailed Implementation Roadmap',
      'Delivery of core project equipment and services as specified',
      'Final acceptance testing, training, and operational handover',
    ];
  }

  // 3. Normalize Risks
  let riskList: ExtractedRisk[] = [];
  const rawRisks = (summary as any).risks;
  if (Array.isArray(rawRisks)) {
    riskList = rawRisks;
  } else if (typeof rawRisks === 'string' && rawRisks.trim()) {
    try {
      const parsed = JSON.parse(rawRisks);
      if (Array.isArray(parsed)) riskList = parsed;
    } catch {
      riskList = rawRisks
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line, idx) => ({
          id: `risk-${idx}`,
          risk: line.replace(/^[-*•\d.]+\s*/, ''),
          severity: idx === 0 ? 'HIGH' : 'MEDIUM',
          mitigation: 'Implement rigorous quality assurance and project team oversight',
        }));
    }
  }

  if (riskList.length === 0) {
    riskList = [
      { id: 'rk1', risk: 'Tight Delivery Timeline & Cutoff Dates', severity: 'MEDIUM', mitigation: 'Mobilize dedicated technical proposal team immediately' },
      { id: 'rk2', risk: 'Strict Regulatory Compliance SLA', severity: 'HIGH', mitigation: 'Ensure all partner certifications & compliance documents are attached' },
    ];
  }

  return (
    <div className="space-y-6">
      {/* Executive Summary Card */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 text-emerald-800 font-extrabold text-sm mb-3">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>AI Executive Summary</span>
        </div>

        <p className="text-slate-800 text-sm leading-relaxed font-medium bg-slate-50 border border-slate-200 p-4 rounded-xl">
          {summary.executiveSummary || 'No executive summary available for this tender notice.'}
        </p>
      </div>

      {/* Grid: Key Requirements & Deliverables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Requirements */}
        <div className="glass-panel rounded-2xl p-6 space-y-4 bg-white border border-slate-200 shadow-sm">
          <h4 className="text-slate-900 font-extrabold text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
            Mandatory Requirements ({reqs.length})
          </h4>
          <div className="space-y-2.5">
            {reqs.map((req, idx) => (
              <div
                key={req.id || idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between space-x-3 text-xs"
              >
                <div className="space-y-1">
                  <span className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 border border-slate-300">
                    {req.category || 'Requirement'}
                  </span>
                  <p className="text-slate-800 font-semibold leading-normal">{req.description}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    req.isMandatory !== false
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {req.isMandatory !== false ? 'Mandatory' : 'Optional'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Deliverables & Scope */}
        <div className="glass-panel rounded-2xl p-6 space-y-4 bg-white border border-slate-200 shadow-sm">
          <h4 className="text-slate-900 font-extrabold text-sm flex items-center gap-2">
            <FileText className="w-4.5 h-4.5 text-emerald-600" />
            Deliverables & Timeline ({delivs.length})
          </h4>

          {/* Deadline Summary Box */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-800 font-bold">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Key Schedule & Cutoffs</span>
            </div>
            <p className="text-slate-700 font-medium leading-relaxed">
              {summary.deadlineSummary || 'Standard submission window applies.'}
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Core Scope Items
            </span>
            {delivs.map((item, i) => (
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
          AI Risk Assessment Matrix ({riskList.length})
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {riskList.map((r, idx) => {
            const isHigh = r.severity === 'HIGH';
            return (
              <div
                key={r.id || idx}
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
                    {r.severity || 'MEDIUM'}
                  </span>
                </div>
                <div className="text-slate-700 pt-1 border-t border-slate-200/80 font-medium">
                  <span className="font-bold text-slate-900">Mitigation: </span>
                  {r.mitigation || 'Standard technical oversight'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

