'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '../../../components/layout/Header';
import { Sidebar } from '../../../components/layout/Sidebar';
import { MatchScoreWidget } from '../../../components/tenders/MatchScoreWidget';
import { AISummaryView } from '../../../components/tenders/AISummaryView';
import { EligibilityChecklist } from '../../../components/tenders/EligibilityChecklist';
import { ApiClient } from '../../../lib/api-client';
import { Tender, SavedStatus } from '../../../types';
import { useToast } from '../../../lib/toast-context';
import {
  ArrowLeft,
  Bookmark,
  Globe,
  Sparkles,
  Award,
  ShieldCheck,
  FileText,
  ExternalLink,
  Check,
  Kanban,
  UserCheck,
  Plus,
  FileCheck2,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

interface BidTask {
  id: string;
  title: string;
  assignee: string;
  role: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

export default function TenderDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { toast } = useToast();

  const [tender, setTender] = useState<Tender | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'summary' | 'match' | 'checklist' | 'workspace' | 'raw'>('summary');
  const [isSaved, setIsSaved] = useState(false);
  const [savedStatus, setSavedStatus] = useState<SavedStatus>('BOOKMARKED');
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  // Collaborative Bid Workspace Tasks ("Jira for Bids")
  const [tasks, setTasks] = useState<BidTask[]>([
    { id: 't1', title: 'Review Mandatory ISO 27001 Certification & Legal Compliance', assignee: 'Lawyer / Legal', role: 'Compliance', status: 'DONE' },
    { id: 't2', title: 'Draft Technical System Architecture & Cloud Migration Blueprint', assignee: 'Lead Engineer', role: 'Technical', status: 'IN_PROGRESS' },
    { id: 't3', title: 'Compile 3 Years Audited Financial Statements & Tax Clearance', assignee: 'Accountant', role: 'Finance', status: 'TODO' },
    { id: 't4', title: 'Final Executive Sign-off & BPP/ARMP Registry Submission', assignee: 'Procurement VP / CEO', role: 'Executive', status: 'TODO' },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Technical Lead');

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.getTenderDetails(id);
      setTender(data);
      setIsSaved(data.isSaved || false);
      setSavedStatus(data.savedStatus || 'BOOKMARKED');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetails();
  }, [id]);

  const handleSave = async (status: SavedStatus) => {
    if (!tender) return;
    await ApiClient.saveTender(tender.id, status);
    setIsSaved(true);
    setSavedStatus(status);
    setShowStatusMenu(false);
    toast.success('Tender Saved to Pipeline!', `Moved to ${status.replace('_', ' ')} tracking stage.`);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const task: BidTask = {
      id: Math.random().toString(36).substring(2, 9),
      title: newTaskTitle.trim(),
      assignee: newTaskAssignee,
      role: 'Team Member',
      status: 'TODO',
    };
    setTasks([...tasks, task]);
    setNewTaskTitle('');
    toast.success('Task Assigned!', `Task assigned to ${newTaskAssignee}.`);
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          const nextStatus = t.status === 'TODO' ? 'IN_PROGRESS' : t.status === 'IN_PROGRESS' ? 'DONE' : 'TODO';
          toast.info(`Task Moved`, `Marked as ${nextStatus.replace('_', ' ')}`);
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const handlePullFromVault = () => {
    toast.success('Company Knowledge Vault Linked!', 'Auto-filled team CVs, ISO 27001 certificate, and 3 past African project references.');
  };

  if (loading || !tender) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Header />
        <div className="flex flex-1 max-w-7xl w-full mx-auto">
          <Sidebar />
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center space-y-3">
              <Sparkles className="w-8 h-8 text-blue-600 mx-auto animate-spin" />
              <p className="text-slate-500 text-xs font-bold">Loading tender details...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />

      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto min-w-0">
          {/* Back Button */}
          <Link
            href="/tenders"
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery</span>
          </Link>

          {/* Tender Header Banner */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden bg-white border border-slate-200 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                    {tender.industry}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    {tender.buyerCountry}
                  </span>
                  <span className="text-xs font-mono text-slate-500 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 font-bold">
                    {tender.refNumber}
                  </span>
                </div>

                <h1 className="text-xl md:text-3xl font-extrabold text-slate-900 leading-snug">
                  {tender.title}
                </h1>
                <p className="text-xs font-bold text-blue-600">Buyer: {tender.buyerName}</p>
              </div>

              {/* Action Bar & Score Pill */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                {tender.matchScore !== undefined && (
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center shadow-sm">
                    <div className="text-2xl font-black text-slate-900">{tender.matchScore}%</div>
                    <div className="text-[10px] uppercase font-extrabold text-blue-600">Match Score</div>
                  </div>
                )}

                <div className="relative">
                  <button
                    onClick={() => setShowStatusMenu(!showStatusMenu)}
                    className="px-5 py-3 rounded-2xl gradient-bg text-white font-extrabold text-xs shadow-md shadow-blue-600/20 flex items-center space-x-2 hover:opacity-95 transition-opacity"
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                    <span>{isSaved ? savedStatus.replace('_', ' ') : 'Save Tender'}</span>
                  </button>

                  {showStatusMenu && (
                    <div className="absolute right-0 top-14 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-50 text-xs">
                      {(['BOOKMARKED', 'UNDER_REVIEW', 'BIDDING', 'PASSED'] as SavedStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleSave(st)}
                          className="w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between font-bold"
                        >
                          <span>{st.replace('_', ' ')}</span>
                          {savedStatus === st && <Check className="w-4 h-4 text-blue-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Value</span>
                <span className="text-sm font-extrabold text-slate-900">
                  ${tender.estimatedValue.toLocaleString()} {tender.currency}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Closing Deadline</span>
                <span className="text-sm font-extrabold text-sky-700">
                  {new Date(tender.deadline).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {tender.status}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Source Portal</span>
                {tender.sourceUrl ? (
                  <a
                    href={tender.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>View Official Specs</span> <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-xs font-semibold text-slate-500">Verified Direct</span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 space-x-2 md:space-x-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('summary')}
              className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 shrink-0 transition-colors ${
                activeTab === 'summary'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              AI Executive Summary
            </button>
            <button
              onClick={() => setActiveTab('match')}
              className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 shrink-0 transition-colors ${
                activeTab === 'match'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4" />
              Company Match Score
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 shrink-0 transition-colors ${
                activeTab === 'checklist'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Eligibility Checklist
            </button>
            <button
              onClick={() => setActiveTab('workspace')}
              className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 shrink-0 transition-colors ${
                activeTab === 'workspace'
                  ? 'border-blue-600 text-blue-600 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-4 h-4 text-indigo-600" />
              <span>Bid Workspace (Jira for Bids)</span>
              <span className="px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                Team
              </span>
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 shrink-0 transition-colors ${
                activeTab === 'raw'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              Raw Specs
            </button>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'summary' && <AISummaryView summary={tender.aiSummary} />}
            {activeTab === 'match' && (
              <MatchScoreWidget matchDetails={tender.matchDetails} overallScore={tender.matchScore} />
            )}
            {activeTab === 'checklist' && <EligibilityChecklist matchDetails={tender.matchDetails} />}

            {/* Collaborative Bid Workspace ("Jira for Bids") */}
            {activeTab === 'workspace' && (
              <div className="space-y-6 animate-fade-in">
                {/* Top Workspace Controls */}
                <div className="glass-panel rounded-2xl p-6 bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Kanban className="w-5 h-5 text-indigo-600" />
                      Collaborative Proposal Task Board
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Assign tasks to Legal, Engineering, Finance, and CEO for this bid. Track progress to submission.
                    </p>
                  </div>

                  <button
                    onClick={handlePullFromVault}
                    className="px-4 py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-2 shrink-0 shadow-xs"
                  >
                    <FileCheck2 className="w-4 h-4 text-indigo-600" />
                    <span>Auto-Reuse from Company Vault</span>
                  </button>
                </div>

                {/* Task Input Form */}
                <form onSubmit={handleAddTask} className="glass-panel rounded-2xl p-4 bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Assign new proposal task (e.g. Prepare Tax Clearance Certificate)..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium shadow-sm"
                  />
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 font-bold focus:outline-none focus:border-blue-600 shadow-sm"
                  >
                    <option value="Lead Engineer">Lead Engineer</option>
                    <option value="Lawyer / Legal">Lawyer / Legal</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Procurement VP / CEO">Procurement VP / CEO</option>
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl gradient-bg text-white font-extrabold text-xs shadow-sm hover:opacity-95 flex items-center gap-1 shrink-0 justify-center"
                  >
                    <Plus className="w-4 h-4" /> Add Task
                  </button>
                </form>

                {/* Kanban Task Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* TODO */}
                  <div className="glass-panel rounded-2xl p-4 bg-slate-50/80 border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between font-extrabold text-xs text-slate-700 border-b border-slate-200 pb-2">
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-600" /> To Do</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px]">
                        {tasks.filter((t) => t.status === 'TODO').length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {tasks
                        .filter((t) => t.status === 'TODO')
                        .map((t) => (
                          <div key={t.id} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                            <p className="text-xs font-bold text-slate-900 leading-snug">{t.title}</p>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-500 font-medium flex items-center gap-1">
                                <UserCheck className="w-3.5 h-3.5 text-blue-600" /> {t.assignee}
                              </span>
                              <button
                                onClick={() => toggleTaskStatus(t.id)}
                                className="text-xs font-bold text-blue-600 hover:underline"
                              >
                                Start →
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* IN PROGRESS */}
                  <div className="glass-panel rounded-2xl p-4 bg-blue-50/40 border border-blue-200/80 space-y-3">
                    <div className="flex items-center justify-between font-extrabold text-xs text-blue-800 border-b border-blue-200 pb-2">
                      <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-blue-600 animate-pulse" /> In Progress</span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px]">
                        {tasks.filter((t) => t.status === 'IN_PROGRESS').length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {tasks
                        .filter((t) => t.status === 'IN_PROGRESS')
                        .map((t) => (
                          <div key={t.id} className="p-3.5 rounded-xl bg-white border border-blue-200 shadow-xs space-y-2">
                            <p className="text-xs font-bold text-slate-900 leading-snug">{t.title}</p>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-500 font-medium flex items-center gap-1">
                                <UserCheck className="w-3.5 h-3.5 text-blue-600" /> {t.assignee}
                              </span>
                              <button
                                onClick={() => toggleTaskStatus(t.id)}
                                className="text-xs font-bold text-emerald-600 hover:underline"
                              >
                                Complete ✓
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* DONE */}
                  <div className="glass-panel rounded-2xl p-4 bg-emerald-50/40 border border-emerald-200/80 space-y-3">
                    <div className="flex items-center justify-between font-extrabold text-xs text-emerald-800 border-b border-emerald-200 pb-2">
                      <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Done & Verified</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
                        {tasks.filter((t) => t.status === 'DONE').length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {tasks
                        .filter((t) => t.status === 'DONE')
                        .map((t) => (
                          <div key={t.id} className="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-xs space-y-2">
                            <p className="text-xs font-bold text-slate-900 leading-snug line-through text-slate-500">{t.title}</p>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-emerald-700 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                              </span>
                              <button
                                onClick={() => toggleTaskStatus(t.id)}
                                className="text-xs text-slate-400 hover:text-slate-700"
                              >
                                Reopen
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'raw' && (
              <div className="glass-panel rounded-2xl p-6 space-y-4 bg-white border border-slate-200 shadow-sm">
                <h3 className="text-sm font-extrabold text-slate-900">Full Tender Specification Content</h3>
                <pre className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">
                  {tender.rawContent}
                </pre>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
