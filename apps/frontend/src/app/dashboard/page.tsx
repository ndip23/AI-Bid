'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { TenderCard } from '../../components/tenders/TenderCard';
import { useAuth } from '../../lib/auth-context';
import { ApiClient } from '../../lib/api-client';
import { Tender } from '../../types';
import { SkeletonDashboard } from '../../components/ui';
import { Sparkles, BookmarkCheck, Calendar, TrendingUp, Search, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, company } = useAuth();
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.getTenders();
      setTenders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const savedCount = tenders.filter((t) => t.isSaved).length;
  const highMatchCount = tenders.filter((t) => (t.matchScore || 0) >= 80).length;

  const totalValueSum = tenders.reduce((acc, t) => acc + (t.estimatedValue || 0), 0);
  const formattedPipelineValue = totalValueSum > 0 ? `$${(totalValueSum / 1000000).toFixed(1)}M` : '$0';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />

      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 space-y-6 md:space-y-8 overflow-y-auto min-w-0">
          {loading ? (
            <SkeletonDashboard />
          ) : (
            <>
              {/* Welcome Banner */}
              <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white border border-slate-200 shadow-sm animate-fade-in">
                <div className="space-y-2 z-10">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                    <span>AI Copilot Engine Active</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                    Welcome back, {user?.firstName || 'Partner'}!
                  </h1>
                  <p className="text-xs md:text-sm text-slate-600 max-w-xl font-medium">
                    Evaluating opportunities for{' '}
                    <strong className="text-blue-600 font-bold">{company?.name || user?.email || 'Your Organization'}</strong>.
                    You have <span className="text-emerald-600 font-extrabold">{highMatchCount} high-matching tenders</span> ready for review.
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0 z-10">
                  <Link
                    href="/tenders"
                    className="px-5 py-3 rounded-2xl gradient-bg text-white font-extrabold text-xs shadow-md shadow-blue-600/20 hover:opacity-95 transition-all flex items-center space-x-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Explore Opportunities</span>
                  </Link>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {/* Matching Opportunities */}
                <div className="glass-panel rounded-2xl p-5 space-y-2 bg-white border border-slate-200 shadow-sm glass-panel-hover">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <span>Matching Opportunities</span>
                    <Sparkles className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{highMatchCount}</div>
                  <p className="text-[11px] text-emerald-600 font-bold">≥80% capability alignment</p>
                </div>

                {/* Saved Tenders */}
                <div className="glass-panel rounded-2xl p-5 space-y-2 bg-white border border-slate-200 shadow-sm glass-panel-hover">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <span>Saved Tenders</span>
                    <BookmarkCheck className="w-4 h-4 text-sky-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{savedCount}</div>
                  <p className="text-[11px] text-slate-500 font-medium">In active review pipeline</p>
                </div>

                {/* Closing Soon */}
                <div className="glass-panel rounded-2xl p-5 space-y-2 bg-white border border-slate-200 shadow-sm glass-panel-hover">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <span>Closing Soon</span>
                    <Calendar className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {tenders.filter((t) => t.status === 'OPEN').length}
                  </div>
                  <p className="text-[11px] text-amber-600 font-bold">Active procurement windows</p>
                </div>

                {/* Open Budget */}
                <div className="glass-panel rounded-2xl p-5 space-y-2 bg-white border border-slate-200 shadow-sm glass-panel-hover">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <span>Total Pipeline Value</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{formattedPipelineValue}</div>
                  <p className="text-[11px] text-slate-500 font-medium">Combined procurement budget</p>
                </div>
              </div>

              {/* Main Opportunities Feed */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base md:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-blue-600" />
                      Top Recommended Opportunities
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Scored specifically against your company certifications & operating geography
                    </p>
                  </div>

                  <Link
                    href="/tenders"
                    className="text-xs font-extrabold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>View All Tenders</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {tenders.length === 0 ? (
                  <div className="glass-panel rounded-2xl p-8 md:p-12 text-center space-y-3 bg-white border border-slate-200 shadow-sm animate-fade-in">
                    <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
                    <h3 className="text-slate-900 font-extrabold text-base">No live tenders in database yet</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                      Use the Super Admin portal to ingest new tenders or trigger the live SAM.gov feed.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tenders.map((tender) => (
                      <TenderCard key={tender.id} tender={tender} onSavedChange={loadData} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
