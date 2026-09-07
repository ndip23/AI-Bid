'use client';

import React, { useState } from 'react';
import { Tender } from '../../types';
import {
  FileText,
  DollarSign,
  Building2,
  Calendar,
  Layers,
  ExternalLink,
  Code2,
  CheckCircle2,
  PieChart,
  ShieldCheck,
  MapPin,
  User,
  HelpCircle,
} from 'lucide-react';

interface Props {
  tender: Tender;
}

export const TenderSpecificationView: React.FC<Props> = ({ tender }) => {
  const [showRawJson, setShowRawJson] = useState(false);

  // Try parsing raw content as JSON (World Bank or structured procurement data)
  let parsedJson: any = null;
  if (tender.rawContent) {
    try {
      parsedJson = JSON.parse(tender.rawContent);
    } catch {
      parsedJson = null;
    }
  }

  // Extract structured fields if JSON
  const isStructured = parsedJson && typeof parsedJson === 'object';

  // Sectors
  const sectors = isStructured
    ? [
        parsedJson.sector1?.Name ? { name: parsedJson.sector1.Name, percent: parsedJson.sector1.Percent || 50 } : null,
        parsedJson.sector2?.Name ? { name: parsedJson.sector2.Name, percent: parsedJson.sector2.Percent || 50 } : null,
        parsedJson.sector3?.Name ? { name: parsedJson.sector3.Name, percent: parsedJson.sector3.Percent || 25 } : null,
      ].filter(Boolean)
    : [];

  // Themes
  const themes = isStructured
    ? [
        parsedJson.theme1 ? parsedJson.theme1.split('!$!')[0] : null,
        parsedJson.theme2 ? parsedJson.theme2.split('!$!')[0] : null,
      ].filter(Boolean)
    : [];

  const projectId = isStructured ? parsedJson.id || tender.refNumber : tender.refNumber;
  const projectName = isStructured ? parsedJson.project_name || tender.title : tender.title;
  const borrower = isStructured ? parsedJson.borrower || `Government of ${tender.buyerCountry}` : `Government of ${tender.buyerCountry}`;
  const agency = isStructured ? parsedJson.impagency || tender.buyerName : tender.buyerName;
  const teamLead = isStructured ? parsedJson.teamleadname : null;
  const lendingInstr = isStructured ? parsedJson.lendinginstr || parsedJson.prodlinetext : null;
  const approvalDate = isStructured && parsedJson.boardapprovaldate ? new Date(parsedJson.boardapprovaldate).toLocaleDateString() : null;
  const closingDate = tender.deadline ? new Date(tender.deadline).toLocaleDateString() : 'Active Window';
  const officialUrl = isStructured && parsedJson.url ? parsedJson.url : tender.sourceUrl;
  const envCategory = isStructured ? parsedJson.envassesmentcategorycode || 'B - Standard' : 'Standard Compliance';

  // Commitments
  const totalCommitment = isStructured && parsedJson.curr_total_commitment
    ? `$${Number(parsedJson.curr_total_commitment).toLocaleString()}M USD`
    : `$${(tender.estimatedValue / 1_000_000).toFixed(1)}M ${tender.currency}`;

  const idaCommitment = isStructured && parsedJson.curr_ida_commitment
    ? `$${Number(parsedJson.curr_ida_commitment).toLocaleString()}M USD`
    : null;

  const ibrdCommitment = isStructured && parsedJson.curr_ibrd_commitment
    ? `$${Number(parsedJson.curr_ibrd_commitment).toLocaleString()}M USD`
    : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Overview Card */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200 mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Official Procurement Specifications</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
              {projectName}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Project Identifier: <strong className="text-slate-800 font-mono">{projectId}</strong> • Financed by World Bank & Regional Authorities
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {officialUrl && (
              <a
                href={officialUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl gradient-bg text-white font-bold text-xs shadow-sm hover:opacity-95 transition-all flex items-center gap-1.5"
              >
                <span>Official Project Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
              title="Inspect Raw System JSON"
            >
              <Code2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{showRawJson ? 'Hide JSON' : 'View Code'}</span>
            </button>
          </div>
        </div>

        {/* Financial & Commitment Breakdown Grid */}
        <div>
          <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Financing Structure & Commitments
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 block">Total Program Budget</span>
              <div className="text-xl font-black text-emerald-950">{totalCommitment}</div>
              <p className="text-[10px] text-emerald-700 font-medium">Verified contract budget envelope</p>
            </div>

            {idaCommitment && (
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-1">
                <span className="text-[11px] font-bold text-sky-800 block">IDA Concessional Funding</span>
                <div className="text-xl font-black text-sky-950">{idaCommitment}</div>
                <p className="text-[10px] text-sky-700 font-medium">International Development Association</p>
              </div>
            )}

            {ibrdCommitment && (
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-1">
                <span className="text-[11px] font-bold text-blue-800 block">IBRD Allocation</span>
                <div className="text-xl font-black text-blue-950">{ibrdCommitment}</div>
                <p className="text-[10px] text-blue-700 font-medium">World Bank Reconstruction Bank</p>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
              <span className="text-[11px] font-bold text-amber-800 block">Environmental Risk Rating</span>
              <div className="text-xl font-black text-amber-950">Category {envCategory}</div>
              <p className="text-[10px] text-amber-700 font-medium">ESCP Compliance Required</p>
            </div>
          </div>
        </div>

        {/* Stakeholder & Authority Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Implementing Agency & Authority */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Contracting Authority & Execution Agency
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Borrower / Country:</span>
                <span className="font-extrabold text-slate-900">{borrower}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Executing Agency:</span>
                <span className="font-extrabold text-slate-900 text-right max-w-[240px]">{agency}</span>
              </div>
              {teamLead && (
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Task Team Leader:</span>
                  <span className="font-bold text-slate-800">{teamLead}</span>
                </div>
              )}
              {lendingInstr && (
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Procurement Instrument:</span>
                  <span className="font-bold text-slate-800">{lendingInstr}</span>
                </div>
              )}
            </div>
          </div>

          {/* Project Milestones & Schedule */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              Procurement Windows & Key Dates
            </h4>
            <div className="space-y-2 text-xs">
              {approvalDate && (
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Board Approval Date:</span>
                  <span className="font-extrabold text-slate-900">{approvalDate}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Tender Submission Cutoff:</span>
                <span className="font-extrabold text-rose-600 font-mono">{closingDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Operational Geography:</span>
                <span className="font-bold text-slate-800">{tender.buyerCountry}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Procurement Status:</span>
                <span className="font-extrabold text-emerald-600 uppercase">{tender.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sector Allocation Breakdown */}
        {sectors.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-600" />
              Sector Allocation & Weighting
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {sectors.map((sec, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800 truncate pr-2">{sec?.name}</span>
                    <span className="font-extrabold text-indigo-600">{sec?.percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all"
                      style={{ width: `${sec?.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Thematic Scope */}
        {themes.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Core Strategic Pillars & Themes
            </span>
            <div className="flex flex-wrap gap-2">
              {themes.map((theme, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {theme}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Narrative Description (if present) */}
        {tender.description && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Scope of Work & Objectives
            </span>
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-normal bg-slate-50 p-4 rounded-xl border border-slate-200">
              {tender.description}
            </p>
          </div>
        )}

        {/* Raw JSON Developer Toggle Drawer */}
        {showRawJson && (
          <div className="space-y-2 pt-4 border-t border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>Raw JSON Specifications Output</span>
              <span className="font-mono text-[11px]">{tender.rawContent?.length || 0} bytes</span>
            </div>
            <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
              {tender.rawContent}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
