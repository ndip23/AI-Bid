'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { TenderCard } from '../../components/tenders/TenderCard';
import { ApiClient } from '../../lib/api-client';
import { Tender } from '../../types';
import { SkeletonCard } from '../../components/ui';
import { Search, Sparkles, RefreshCw, Filter } from 'lucide-react';

export default function TendersDiscoveryPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('');
  const [country, setCountry] = useState('');
  const [minScore, setMinScore] = useState<number>(0);

  const fetchTenders = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.getTenders({
        search,
        industry: industry || undefined,
        country: country || undefined,
        minScore: minScore > 0 ? minScore : undefined,
      });
      setTenders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenders();
  }, [search, industry, country, minScore]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />

      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto min-w-0">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Search className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                African & Global Tender Discovery
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Browse all verified public procurement notices from ARMP, BPP, PPIP, AfDB, and global portals
              </p>
            </div>

            <button
              onClick={fetchTenders}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold shadow-xs flex items-center gap-1.5 self-start md:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Feed</span>
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="glass-panel rounded-2xl p-4 md:p-5 space-y-4 bg-white border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Search input */}
              <div className="relative md:col-span-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search all tenders, ref #, or buyer..."
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium shadow-sm"
                />
              </div>

              {/* Industry Filter */}
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-blue-600 font-medium shadow-sm"
              >
                <option value="">All Industries & Sectors</option>
                <option value="Cloud & IT Infrastructure">Cloud & IT Infrastructure</option>
                <option value="Civil Infrastructure & Construction">Civil Infrastructure & Construction</option>
                <option value="Smart City Infrastructure">Smart City Infrastructure</option>
                <option value="Healthcare & Healthtech Systems">Healthcare & Healthtech Systems</option>
                <option value="Renewable Energy & Solar Power">Renewable Energy & Solar Power</option>
                <option value="Transport & Port Logistics">Transport & Port Logistics</option>
                <option value="Education & Digital Infrastructure">Education & Digital Infrastructure</option>
              </select>

              {/* Country Filter */}
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-blue-600 font-medium shadow-sm"
              >
                <option value="">All African & Global Markets</option>
                <optgroup label="🌍 African Target Markets">
                  <option value="Cameroon">Cameroon (ARMP / COLEPS)</option>
                  <option value="Nigeria">Nigeria (BPP / Federal)</option>
                  <option value="Kenya">Kenya (PPIP / Counties)</option>
                  <option value="South Africa">South Africa (eTender)</option>
                  <option value="Pan-African">Pan-African (AfDB / UNGM)</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Rwanda">Rwanda</option>
                  <option value="Egypt">Egypt</option>
                </optgroup>
                <optgroup label="🌐 Global Markets">
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                </optgroup>
              </select>
            </div>

            {/* AI Match Score Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center space-x-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-500">Min AI Match Score:</span>
              </div>

              <div className="flex space-x-2">
                {[0, 70, 80, 90].map((score) => (
                  <button
                    key={score}
                    onClick={() => setMinScore(score)}
                    className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all ${
                      minScore === score
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {score === 0 ? 'All Matches' : `≥${score}%`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : tenders.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center space-y-3 bg-white border border-slate-200 shadow-sm">
              <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-slate-900 font-extrabold text-base">No tenders found for selected criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                Try resetting your country filter or search term to discover more tenders.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setIndustry('');
                  setCountry('');
                  setMinScore(0);
                }}
                className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs hover:bg-blue-100 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tenders.map((tender) => (
                <TenderCard key={tender.id} tender={tender} onSavedChange={fetchTenders} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
