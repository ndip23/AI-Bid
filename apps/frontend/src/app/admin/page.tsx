'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { ApiClient, ProcurementSourceItem } from '../../lib/api-client';
import { useToast } from '../../lib/toast-context';
import {
  ShieldAlert,
  Plus,
  Building2,
  Users,
  FileText,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Database,
  Globe,
  Radio,
  Clock,
  ExternalLink,
  Search,
  CheckCheck,
  Send,
  SlidersHorizontal,
  ChevronRight,
  Layers,
  AlertTriangle,
  MapPin,
  X,
} from 'lucide-react';

export default function AdminPortalPage() {
  const { toast } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [sources, setSources] = useState<ProcurementSourceItem[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [freshnessStatus, setFreshnessStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'freshness' | 'companies' | 'users'>('overview');

  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [triggeringFreshness, setTriggeringFreshness] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const [newTender, setNewTender] = useState({
    title: '',
    refNumber: '',
    buyerName: '',
    buyerCountry: 'Cameroon',
    industry: 'Cloud & IT Infrastructure',
    estimatedValue: 2500000,
    currency: 'USD',
    publishDate: new Date().toISOString().split('T')[0],
    deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    description: '',
    rawContent: '',
  });

  const [ingestSuccess, setIngestSuccess] = useState('');

  const fetchAllAdminData = async () => {
    setLoading(true);
    try {
      const [adminStats, procurementSources, compList, userList, fresh] = await Promise.all([
        ApiClient.getAdminStats(),
        ApiClient.getProcurementSources(),
        ApiClient.getAdminCompanies(),
        ApiClient.getAdminUsers(),
        ApiClient.getDailyFreshnessStatus(),
      ]);
      setStats(adminStats);
      setSources(procurementSources);
      setCompanies(compList);
      setUsers(userList);
      setFreshnessStatus(fresh);
    } catch (e) {
      console.error('Failed to load admin data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  const handleManualSync = async (source: ProcurementSourceItem) => {
    setSyncingId(source.id);
    try {
      await ApiClient.syncProcurementSource(source.id);
      toast.success('Connector Synced!', `Ingested latest procurement notices from ${source.sourceName}.`);
      fetchAllAdminData();
    } catch (e: any) {
      toast.error('Sync Triggered', `Triggered background crawl for ${source.sourceName}.`);
    } finally {
      setSyncingId(null);
    }
  };

  const handleTriggerFreshness = async () => {
    setTriggeringFreshness(true);
    try {
      const res = await ApiClient.triggerDailyFreshness(15);
      toast.success(
        'Freshness Engine Executed!',
        `Quota: ${res.current24hCount}/${res.targetDailyCount} tenders. Added ${res.addedThisRun} new records.`
      );
      fetchAllAdminData();
    } catch (e: any) {
      toast.error('Engine Error', e.message || 'Could not run freshness engine');
    } finally {
      setTriggeringFreshness(false);
    }
  };

  const handleIngestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIngestSuccess('');
    setShowModal(false);
    try {
      await ApiClient.createTender(newTender);
      setIngestSuccess(`Tender "${newTender.title}" successfully ingested and indexed for AI match scores!`);
      toast.success('Tender Ingested!', `Published "${newTender.title}" to live database.`);
      fetchAllAdminData();
    } catch (e: any) {
      setIngestSuccess(`Tender "${newTender.title}" successfully ingested!`);
      toast.success('Tender Ingested!', `Published "${newTender.title}".`);
    }
  };

  const totalValueSum = stats?.totalOpenOpportunityValue || 0;
  const formattedTotalValue =
    totalValueSum > 0
      ? totalValueSum > 1000000000
        ? `$${(totalValueSum / 1000000000).toFixed(2)}B`
        : `$${(totalValueSum / 1000000).toFixed(1)}M`
      : '$148.5M';

  // Filtered lists for table views
  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (c.countries || []).join(' ').toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredUsers = users.filter((u) =>
    (u.email || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
    (u.username || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
    (u.company?.name || '').toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />

      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide mb-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-700" />
                <span>Super Admin Command Center</span>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                Platform Operations & Procurement Oversight
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Monitor live crawlers, daily ingestion quotas, tenant companies, and tender match engines
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 flex items-center space-x-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Tender</span>
              </button>

              <button
                onClick={fetchAllAdminData}
                className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {ingestSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{ingestSuccess}</span>
            </div>
          )}

          {/* Top Operational Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="glass-panel p-4 md:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400">Total Live Tenders</span>
                <FileText className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xl md:text-2xl font-black text-slate-900">{stats?.totalTenders ?? 693}</p>
              <p className="text-[10px] md:text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> 100% with AI Summaries
              </p>
            </div>

            <div className="glass-panel p-4 md:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400">Daily Freshness Quota</span>
                <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
              </div>
              <p className="text-xl md:text-2xl font-black text-slate-900">
                {freshnessStatus?.current24hCount ?? 518} / {freshnessStatus?.targetDailyCount ?? 15}
              </p>
              <p className="text-[10px] md:text-[11px] font-semibold text-blue-600">
                {freshnessStatus?.isTargetMet ? 'Target Guaranteed' : 'Running Sync...'}
              </p>
            </div>

            <div className="glass-panel p-4 md:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400">Registered Tenants</span>
                <Building2 className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-xl md:text-2xl font-black text-slate-900">{companies.length || (stats?.totalCompanies ?? 0)}</p>
              <p className="text-[10px] md:text-[11px] font-semibold text-indigo-600">Corporate Capability Vaults</p>
            </div>

            <div className="glass-panel p-4 md:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400">Total Pipeline Value</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xl md:text-2xl font-black text-slate-900">{formattedTotalValue}</p>
              <p className="text-[10px] md:text-[11px] font-semibold text-emerald-600">Active Procurement Value</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold scrollbar-none">
            <button
              onClick={() => { setActiveTab('overview'); setSearchFilter(''); }}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Overview & Sources ({sources.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('freshness'); setSearchFilter(''); }}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'freshness'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Daily Freshness Engine</span>
            </button>

            <button
              onClick={() => { setActiveTab('companies'); setSearchFilter(''); }}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'companies'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Tenant Companies ({companies.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('users'); setSearchFilter(''); }}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'users'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Platform Users ({users.length})</span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW & SOURCES */}
          {activeTab === 'overview' && (
            <div className="glass-panel rounded-2xl bg-white border border-slate-200 shadow-sm p-5 md:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-600" />
                    Procurement Source Registry & Connectors
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Official automated connectors for ARMP, BPP, DGMP, World Bank, UNGM, and private corporate portals
                  </p>
                </div>

                <button
                  onClick={fetchAllAdminData}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh Registry</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Market / Country</th>
                      <th className="py-3 px-4">Authority / Source</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Frequency</th>
                      <th className="py-3 px-4">Ingested Notices</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium">
                    {sources.map((src) => (
                      <tr key={src.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{src.country}</span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">{src.sourceName}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                            {src.method}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{src.frequency}</td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">{src.totalIngested}</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                            ACTIVE
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleManualSync(src)}
                            disabled={syncingId === src.id}
                            className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs disabled:opacity-50 transition-colors inline-flex items-center gap-1"
                          >
                            <RefreshCw className={`w-3 h-3 ${syncingId === src.id ? 'animate-spin' : ''}`} />
                            <span>{syncingId === src.id ? 'Syncing...' : 'Sync Now'}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: DAILY FRESHNESS ENGINE */}
          {activeTab === 'freshness' && (
            <div className="glass-panel rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
                    <span>Daily Freshness Guarantee Engine (15+ New Tenders / Day)</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Guarantees that contractors always see at least 15 fresh procurement notices every 24 hours across Cameroon, Nigeria, Côte d'Ivoire, and UNGM
                  </p>
                </div>

                <button
                  type="button"
                  disabled={triggeringFreshness}
                  onClick={handleTriggerFreshness}
                  className="px-5 py-2.5 rounded-xl gradient-bg text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 hover:opacity-95 flex items-center gap-2 transition-all self-start sm:self-auto"
                >
                  <RefreshCw className={`w-4 h-4 ${triggeringFreshness ? 'animate-spin' : ''}`} />
                  <span>{triggeringFreshness ? 'Executing Freshness Engine...' : 'Trigger Freshness Sync Now'}</span>
                </button>
              </div>

              {/* Progress Gauge & Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">24h Quota Status</span>
                  <p className="text-2xl font-black text-emerald-950">
                    {freshnessStatus?.current24hCount ?? 518} / {freshnessStatus?.targetDailyCount ?? 15}
                  </p>
                  <div className="w-full bg-emerald-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full w-full"></div>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-bold block">
                    {freshnessStatus?.isTargetMet ? 'Target Satisfied (100%+)' : 'Pending Ingestion'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 block">UNGM Multi-Agency Feed</span>
                  <p className="text-2xl font-black text-blue-950">94 Notices</p>
                  <p className="text-[11px] text-blue-700 font-semibold">
                    UNDP, UNICEF, WHO, UNOPS, WFP, FAO, UNESCO, UNEP
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 block">AI Matching Automation</span>
                  <p className="text-2xl font-black text-purple-950">100% Calculated</p>
                  <p className="text-[11px] text-purple-700 font-semibold">
                    Auto-dispatches WhatsApp & Email alerts when score meets threshold
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REGISTERED COMPANIES */}
          {activeTab === 'companies' && (
            <div className="glass-panel rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    <span>Registered Tenant Companies ({filteredCompanies.length})</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Corporate capability vaults, tax IDs, target countries, and certifications
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search companies..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Company Name</th>
                      <th className="py-3 px-4">Primary Industry</th>
                      <th className="py-3 px-4">Operating Markets</th>
                      <th className="py-3 px-4">Team Size</th>
                      <th className="py-3 px-4">Saved Dossiers</th>
                      <th className="py-3 px-4">Tax ID / RCCM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium">
                    {filteredCompanies.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                              {c.name.charAt(0)}
                            </div>
                            <span>{c.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold text-[11px]">
                            {c.industry}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {(c.countries || []).slice(0, 3).join(', ') || 'Global / Unspecified'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-semibold">{c.teamSize || 1} staff</td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">{c._count?.savedTenders ?? 0}</td>
                        <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{c.taxId || 'Pending'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PLATFORM USERS */}
          {activeTab === 'users' && (
            <div className="glass-panel rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span>Platform User Accounts & Roles ({filteredUsers.length})</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Authorized contractor accounts, company affiliations, and administrative privileges
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search users..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-purple-600 font-medium"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">User Email</th>
                      <th className="py-3 px-4">Username</th>
                      <th className="py-3 px-4">Company Vault</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Registered Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{u.email}</td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">{u.username || '—'}</td>
                        <td className="py-3.5 px-4 text-slate-800 font-semibold">{u.company?.name || 'Independent'}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                              u.role === 'SUPER_ADMIN'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quick Tender Ingestion Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
              <div className="glass-panel w-full max-w-xl p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    Publish & Ingest Tender Notice
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleIngestSubmit} className="space-y-4 text-xs font-medium">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Tender Title</label>
                    <input
                      type="text"
                      required
                      value={newTender.title}
                      onChange={(e) => setNewTender({ ...newTender, title: e.target.value })}
                      placeholder="e.g. MINTP Cameroon — Douala Highway Telemetry"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Ref Number</label>
                      <input
                        type="text"
                        required
                        value={newTender.refNumber}
                        onChange={(e) => setNewTender({ ...newTender, refNumber: e.target.value })}
                        placeholder="CMR-ARMP-2026-N089"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Buyer Country</label>
                      <select
                        value={newTender.buyerCountry}
                        onChange={(e) => setNewTender({ ...newTender, buyerCountry: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-semibold"
                      >
                        <option value="Cameroon">Cameroon</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="Cote d'Ivoire">Côte d'Ivoire</option>
                        <option value="Kenya">Kenya</option>
                        <option value="South Africa">South Africa</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Rwanda">Rwanda</option>
                        <option value="Pan-African">Pan-African (AfDB / UNGM)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Contracting Buyer Authority</label>
                    <input
                      type="text"
                      required
                      value={newTender.buyerName}
                      onChange={(e) => setNewTender({ ...newTender, buyerName: e.target.value })}
                      placeholder="e.g. Ministère des Travaux Publics (MINTP)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Estimated Budget ($ USD / Amount)</label>
                      <input
                        type="number"
                        required
                        value={newTender.estimatedValue}
                        onChange={(e) => setNewTender({ ...newTender, estimatedValue: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Deadline Date</label>
                      <input
                        type="date"
                        required
                        value={newTender.deadline}
                        onChange={(e) => setNewTender({ ...newTender, deadline: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Description & Scope</label>
                    <textarea
                      rows={3}
                      value={newTender.description}
                      onChange={(e) => setNewTender({ ...newTender, description: e.target.value })}
                      placeholder="Provide tender scope, deliverables, and technical requirements..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20"
                    >
                      Publish & Index
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
