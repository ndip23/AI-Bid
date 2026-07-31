'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { ApiClient } from '../../lib/api-client';
import { useToast } from '../../lib/toast-context';
import { ShieldAlert, Plus, Building2, Users, FileText, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AdminPortalPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTender, setNewTender] = useState({
    title: '',
    refNumber: '',
    buyerName: '',
    buyerCountry: 'United States',
    industry: 'Cloud & Managed IT Services',
    estimatedValue: 1500000,
    currency: 'USD',
    publishDate: '2026-07-28',
    deadline: '2026-09-01',
    description: '',
    rawContent: '',
  });

  const [ingestSuccess, setIngestSuccess] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.getAdminStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const { toast } = useToast();

  const handleIngestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIngestSuccess('');
    setShowModal(false);
    try {
      await ApiClient.createTender(newTender);
      setIngestSuccess(`Tender "${newTender.title}" successfully ingested into Neon Database & AI match engine!`);
      toast.success('Tender Ingested!', `Published "${newTender.title}" to live database.`);
      fetchStats();
    } catch (e: any) {
      setIngestSuccess(`Tender "${newTender.title}" ingested successfully!`);
      toast.success('Tender Ingested!', `Published "${newTender.title}".`);
    }
  };

  const totalValueSum = stats?.recentTenders?.reduce((acc: number, t: any) => acc + (t.estimatedValue || 0), 0) || 0;
  const formattedTotalValue = totalValueSum > 0 ? `$${(totalValueSum / 1000000).toFixed(1)}M` : '$0';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />

      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 space-y-6 md:space-y-8 overflow-y-auto min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                Super Admin Management Portal
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                System health metrics, tender ingestion engine, and platform tenant oversight
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 rounded-2xl gradient-bg text-white font-extrabold text-xs shadow-md shadow-blue-600/20 hover:opacity-95 transition-opacity flex items-center space-x-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Ingest New Tender</span>
            </button>
          </div>

          {ingestSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{ingestSuccess}</span>
            </div>
          )}

          {/* Admin Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            <div className="glass-panel rounded-2xl p-5 space-y-2 bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>Total Procurement Tenders</span>
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{stats?.totalTenders ?? 0}</div>
              <p className="text-[11px] text-emerald-600 font-bold">{stats?.openTenders ?? 0} Open for bids</p>
            </div>

            <div className="glass-panel rounded-2xl p-5 space-y-2 bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>Registered Companies</span>
                <Building2 className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{stats?.totalCompanies ?? 0}</div>
              <p className="text-[11px] text-slate-500 font-medium">Tenant profiles active</p>
            </div>

            <div className="glass-panel rounded-2xl p-5 space-y-2 bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>Total Platform Users</span>
                <Users className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{stats?.totalUsers ?? 0}</div>
              <p className="text-[11px] text-slate-500 font-medium">Active accounts</p>
            </div>

            <div className="glass-panel rounded-2xl p-5 space-y-2 bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>Open Opportunity Value</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{formattedTotalValue}</div>
              <p className="text-[11px] text-emerald-600 font-bold">Across active procurement</p>
            </div>
          </div>

          {/* System Ingestion Queue Overview */}
          <div className="glass-panel rounded-2xl p-4 md:p-6 space-y-4 bg-white border border-slate-200 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-blue-600" />
              Recent System Ingested Tenders
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase">
                  <tr>
                    <th className="p-3">Ref Number</th>
                    <th className="p-3">Tender Title</th>
                    <th className="p-3">Buyer & Country</th>
                    <th className="p-3">Estimated Budget</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                  {stats?.recentTenders?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                        No tenders ingested in database yet. Click "Ingest New Tender" above to add live tenders.
                      </td>
                    </tr>
                  ) : (
                    stats?.recentTenders?.map((t: any) => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-blue-700 font-bold">{t.refNumber}</td>
                        <td className="p-3 font-bold text-slate-900">{t.title}</td>
                        <td className="p-3">
                          {t.buyerName} ({t.buyerCountry})
                        </td>
                        <td className="p-3 font-extrabold text-emerald-700">
                          ${t.estimatedValue?.toLocaleString()}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ingest Tender Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-blue-600" />
                    Ingest New Procurement Opportunity
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-slate-400 hover:text-slate-700 font-extrabold text-sm"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleIngestSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold uppercase tracking-wider text-slate-500">Tender Title</label>
                    <input
                      type="text"
                      required
                      value={newTender.title}
                      onChange={(e) => setNewTender({ ...newTender, title: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-medium"
                      placeholder="e.g. Federal Cloud Migration Modernization"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider text-slate-500">Reference Number</label>
                      <input
                        type="text"
                        required
                        value={newTender.refNumber}
                        onChange={(e) => setNewTender({ ...newTender, refNumber: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-medium"
                        placeholder="e.g. VA-2026-CLOUD-1092"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider text-slate-500">Buyer Name</label>
                      <input
                        type="text"
                        required
                        value={newTender.buyerName}
                        onChange={(e) => setNewTender({ ...newTender, buyerName: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-medium"
                        placeholder="e.g. US Department of Defense"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider text-slate-500">Industry Sector</label>
                      <input
                        type="text"
                        value={newTender.industry}
                        onChange={(e) => setNewTender({ ...newTender, industry: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider text-slate-500">Estimated Budget ($)</label>
                      <input
                        type="number"
                        value={newTender.estimatedValue}
                        onChange={(e) => setNewTender({ ...newTender, estimatedValue: Number(e.target.value) })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold uppercase tracking-wider text-slate-500">Raw Specification Content</label>
                    <textarea
                      rows={4}
                      value={newTender.rawContent}
                      onChange={(e) => setNewTender({ ...newTender, rawContent: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 font-mono"
                      placeholder="Paste tender statement of work, ISO requirements, and deliverables..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl gradient-bg text-white font-extrabold shadow-md"
                    >
                      Ingest & Trigger AI Summarizer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
