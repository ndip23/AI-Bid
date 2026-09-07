'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { TenderCard } from '../../components/tenders/TenderCard';
import { useAuth } from '../../lib/auth-context';
import { useLanguage } from '../../lib/language-context';
import { ApiClient } from '../../lib/api-client';
import { Tender } from '../../types';
import { SkeletonDashboard } from '../../components/ui';
import { formatPipelineValue } from '../../lib/formatters';
import {
  Sparkles,
  BookmarkCheck,
  Calendar,
  TrendingUp,
  Search,
  ArrowRight,
  ShieldCheck,
  Globe,
  Filter,
  X,
  Briefcase,
  Layers,
  Server,
  Building2,
  Zap,
  BarChart3,
  Activity,
  GraduationCap,
  Truck,
  Sprout,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, company } = useAuth();
  const { isFrench } = useLanguage();
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');

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

  // Display name capitalized (Partner -> Spektralsoft)
  const rawOrgName = company?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Spektralsoft');
  const orgDisplayName = rawOrgName.charAt(0).toUpperCase() + rawOrgName.slice(1);

  // Extract unique countries with their tender counts
  const countryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tenders.forEach((t) => {
      const c = (t.buyerCountry || 'Unspecified').trim();
      counts[c] = (counts[c] || 0) + 1;
    });
    return counts;
  }, [tenders]);

  const sortedCountries = useMemo(() => {
    return Object.keys(countryCounts).sort((a, b) => countryCounts[b] - countryCounts[a]);
  }, [countryCounts]);

  // Extract unique industries with their tender counts
  const industryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tenders.forEach((t) => {
      const ind = (t.industry || 'Other').trim();
      counts[ind] = (counts[ind] || 0) + 1;
    });
    return counts;
  }, [tenders]);

  // Sector list with clean Lucide vector icons
  const sectorsList = [
    { name: 'Cloud & IT Infrastructure', icon: Server, short: isFrench ? 'Cloud & IT' : 'Cloud & IT' },
    { name: 'Civil Infrastructure & Construction', icon: Building2, short: isFrench ? 'BTP & Construction' : 'Construction' },
    { name: 'Renewable Energy & Solar Power', icon: Zap, short: isFrench ? 'Énergies Renouv.' : 'Renewable Energy' },
    { name: 'Consulting & Governance', icon: BarChart3, short: isFrench ? 'Conseil & Gouvernance' : 'Consulting & Gov' },
    { name: 'Healthcare & Medical Systems', icon: Activity, short: isFrench ? 'Santé & Médical' : 'Healthcare' },
    { name: 'Education & Training', icon: GraduationCap, short: isFrench ? 'Éducation & Formation' : 'Education' },
    { name: 'Transport & Logistics', icon: Truck, short: isFrench ? 'Transport & Logistique' : 'Logistics' },
    { name: 'Agriculture & Water Resources', icon: Sprout, short: isFrench ? 'Agro & Eau' : 'Agri & Water' },
  ];

  // Top featured markets for quick-select chips (clean country codes, no emojis)
  const featuredMarkets = [
    { name: 'Cameroon', code: 'CM', fr: 'Cameroun' },
    { name: 'Nigeria', code: 'NG', fr: 'Nigeria' },
    { name: 'Benin', code: 'BJ', fr: 'Bénin' },
    { name: "Cote d'Ivoire", code: 'CI', fr: "Côte d'Ivoire" },
    { name: 'Kenya', code: 'KE', fr: 'Kenya' },
    { name: 'Rwanda', code: 'RW', fr: 'Rwanda' },
    { name: 'Togo', code: 'TG', fr: 'Togo' },
    { name: 'Ukraine', code: 'UA', fr: 'Ukraine' },
  ];

  // Filter tenders based on selected country and sector
  const filteredTenders = useMemo(() => {
    return tenders.filter((t) => {
      const matchesCountry =
        !selectedCountry || (t.buyerCountry || '').toLowerCase() === selectedCountry.toLowerCase();
      const matchesIndustry =
        !selectedIndustry || (t.industry || '').toLowerCase() === selectedIndustry.toLowerCase();
      return matchesCountry && matchesIndustry;
    });
  }, [tenders, selectedCountry, selectedIndustry]);

  // Filtered metrics calculation
  const savedCount = filteredTenders.filter((t) => t.isSaved).length;
  const highMatchCount = filteredTenders.filter((t) => (t.matchScore || 0) >= 80).length;
  const activeCount = filteredTenders.filter((t) => t.status === 'OPEN').length;

  // Pipeline sum in USD (converts XAF at 600 for normalized combined amount)
  const totalPipelineSumUSD = useMemo(() => {
    return filteredTenders.reduce((acc, t) => {
      const val = t.estimatedValue || 0;
      const valUSD = t.currency === 'XAF' ? val / 600 : val;
      return acc + valUSD;
    }, 0);
  }, [filteredTenders]);

  const formattedPipelineValue = formatPipelineValue(totalPipelineSumUSD);

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
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                    <span>{isFrench ? 'Moteur Copilote IA Actif' : 'AI Copilot Engine Active'}</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                    {isFrench ? `Bienvenue, ${orgDisplayName} !` : `Welcome back, ${orgDisplayName}!`}
                  </h1>
                  <p className="text-xs md:text-sm text-slate-600 max-w-xl font-medium">
                    {isFrench ? (
                      <>
                        Évaluation continue pour{' '}
                        <strong className="text-emerald-600 font-bold">{orgDisplayName}</strong>.
                        Vous avez{' '}
                        <span className="text-emerald-600 font-extrabold">
                          {highMatchCount} opportunités à forte adéquation
                        </span>{' '}
                        prêtes à être examinées.
                      </>
                    ) : (
                      <>
                        Evaluating opportunities for{' '}
                        <strong className="text-emerald-600 font-bold">{orgDisplayName}</strong>.
                        You have{' '}
                        <span className="text-emerald-600 font-extrabold">
                          {highMatchCount} high-matching tenders
                        </span>{' '}
                        ready for review.
                      </>
                    )}
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0 z-10">
                  <Link
                    href={`/tenders${
                      selectedIndustry || selectedCountry
                        ? `?${new URLSearchParams({
                            ...(selectedIndustry ? { industry: selectedIndustry } : {}),
                            ...(selectedCountry ? { country: selectedCountry } : {}),
                          }).toString()}`
                        : ''
                    }`}
                    className="px-5 py-3 rounded-2xl gradient-bg text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 hover:opacity-95 transition-all flex items-center space-x-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>{isFrench ? 'Explorer les Marchés' : 'Explore Opportunities'}</span>
                  </Link>
                </div>
              </div>

              {/* Multi-Sector & Target Country Filter Bar */}
              <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-sm space-y-4">
                {/* Sector / Industry Selector */}
                <div className="space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        {isFrench ? 'Filtre par Secteur d\'Activité (8 Secteurs Actifs)' : 'Industry & Sector Filter (8 Active Sectors)'}
                      </span>
                      {selectedIndustry && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {selectedIndustry} ({filteredTenders.length})
                          <button
                            onClick={() => setSelectedIndustry('')}
                            className="hover:text-emerald-950 p-0.5"
                            title="Clear industry filter"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                    </div>

                    {selectedIndustry && (
                      <button
                        onClick={() => setSelectedIndustry('')}
                        className="text-xs text-slate-500 hover:text-emerald-700 font-bold self-start sm:self-auto"
                      >
                        {isFrench ? 'Réinitialiser le Secteur' : 'Reset Sector'}
                      </button>
                    )}
                  </div>

                  {/* Sector Chips */}
                  <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 text-xs scrollbar-none touch-pan-x">
                    <button
                      onClick={() => setSelectedIndustry('')}
                      className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap flex items-center space-x-1.5 transition-all shrink-0 ${
                        !selectedIndustry
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>{isFrench ? 'Tous les Secteurs' : 'All Sectors'}</span>
                      <span className="text-[10px] ml-0.5 opacity-75">({tenders.length})</span>
                    </button>

                    {sectorsList.map((sec) => {
                      const count = industryCounts[sec.name] || 0;
                      if (count === 0) return null;
                      const isSelected = selectedIndustry.toLowerCase() === sec.name.toLowerCase();
                      const IconComp = sec.icon;

                      return (
                        <button
                          key={sec.name}
                          onClick={() => setSelectedIndustry(isSelected ? '' : sec.name)}
                          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap flex items-center space-x-1.5 transition-all shrink-0 ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <IconComp className="w-3.5 h-3.5" />
                          <span>{sec.short}</span>
                          <span
                            className={`text-[10px] ml-0.5 px-1.5 py-0.2 rounded-full font-mono ${
                              isSelected
                                ? 'bg-emerald-700 text-white'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2.5">
                  {/* Country Filter Header & Quick Chips */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        {isFrench ? 'Filtre par Pays Cible' : 'Target Country Filter'}
                      </span>
                      {selectedCountry && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {selectedCountry}
                          <button
                            onClick={() => setSelectedCountry('')}
                            className="hover:text-emerald-950 p-0.5"
                            title="Clear country filter"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-600 shadow-xs cursor-pointer"
                      >
                        <option value="">{isFrench ? 'Tous les Marchés' : 'All Markets'}</option>
                        {sortedCountries.map((c) => (
                          <option key={c} value={c}>
                            {c} ({countryCounts[c]})
                          </option>
                        ))}
                      </select>

                      {(selectedCountry || selectedIndustry) && (
                        <button
                          onClick={() => {
                            setSelectedCountry('');
                            setSelectedIndustry('');
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors whitespace-nowrap"
                        >
                          {isFrench ? 'Effacer tous les filtres' : 'Clear All Filters'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Quick Country Selection Chips */}
                  <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 text-xs scrollbar-none touch-pan-x">
                    <button
                      onClick={() => setSelectedCountry('')}
                      className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap flex items-center space-x-1.5 transition-all shrink-0 ${
                        !selectedCountry
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{isFrench ? 'Tous les Pays' : 'All Countries'}</span>
                    </button>

                    {featuredMarkets.map((market) => {
                      const count = countryCounts[market.name] || 0;
                      if (count === 0) return null;
                      const isSelected = selectedCountry.toLowerCase() === market.name.toLowerCase();

                      return (
                        <button
                          key={market.name}
                          onClick={() => setSelectedCountry(isSelected ? '' : market.name)}
                          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap flex items-center space-x-1.5 transition-all shrink-0 ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <span
                            className={`text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded ${
                              isSelected
                                ? 'bg-emerald-700 text-emerald-100'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {market.code}
                          </span>
                          <span>{isFrench && market.fr ? market.fr : market.name}</span>
                          <span className="text-[10px] ml-0.5 opacity-75">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {/* Matching Opportunities */}
                <div className="glass-panel rounded-2xl p-5 space-y-2 bg-white border border-slate-200 shadow-sm glass-panel-hover">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <span>{isFrench ? 'Opportunités Qualifiées' : 'Matching Opportunities'}</span>
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{highMatchCount}</div>
                  <p className="text-[11px] text-emerald-600 font-bold">
                    {isFrench
                      ? `≥80% d'adéquation des capacités ${selectedCountry ? `(${selectedCountry})` : ''}`
                      : `≥80% capability alignment ${selectedCountry ? `in ${selectedCountry}` : ''}`}
                  </p>
                </div>

                {/* Saved Tenders */}
                <div className="glass-panel rounded-2xl p-5 space-y-2 bg-white border border-slate-200 shadow-sm glass-panel-hover">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <span>{isFrench ? 'Offres Sauvegardées' : 'Saved Tenders'}</span>
                    <BookmarkCheck className="w-4 h-4 text-sky-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{savedCount}</div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {isFrench ? 'Dans le pipeline d\'examen actif' : 'In active review pipeline'}
                  </p>
                </div>

                {/* Closing Soon */}
                <div className="glass-panel rounded-2xl p-5 space-y-2 bg-white border border-slate-200 shadow-sm glass-panel-hover">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <span>{isFrench ? 'Clôture Imminente' : 'Closing Soon'}</span>
                    <Calendar className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{activeCount}</div>
                  <p className="text-[11px] text-amber-600 font-bold">
                    {isFrench
                      ? `Dossiers en cours de soumission ${selectedCountry ? `(${selectedCountry})` : ''}`
                      : `Active procurement windows ${selectedCountry ? `(${selectedCountry})` : ''}`}
                  </p>
                </div>

                {/* Open Budget */}
                <div className="glass-panel rounded-2xl p-5 space-y-2 bg-white border border-slate-200 shadow-sm glass-panel-hover">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <span>{isFrench ? 'Valeur Suivie du Pipeline' : 'Total Pipeline Value'}</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{formattedPipelineValue}</div>
                  <p className="text-[11px] text-slate-500 font-medium truncate">
                    {isFrench
                      ? `Estimé sur ${filteredTenders.length} opportunités actives`
                      : `Combined across ${filteredTenders.length} active opportunities`}
                  </p>
                </div>
              </div>

              {/* Main Opportunities Feed */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base md:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <span>
                        {isFrench
                          ? `Meilleures Opportunités Qualifiées ${selectedIndustry ? `(${selectedIndustry})` : ''} ${selectedCountry ? `• ${selectedCountry}` : ''}`
                          : `Top Recommended Opportunities ${selectedIndustry ? `in ${selectedIndustry}` : ''} ${selectedCountry ? `• ${selectedCountry}` : ''}`}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      {isFrench
                        ? `Scorées spécifiquement pour les capacités & agréments de ${orgDisplayName}`
                        : `Scored specifically for ${orgDisplayName} capabilities & operating requirements`}
                    </p>
                  </div>

                  <Link
                    href={`/tenders${
                      selectedIndustry || selectedCountry
                        ? `?${new URLSearchParams({
                            ...(selectedIndustry ? { industry: selectedIndustry } : {}),
                            ...(selectedCountry ? { country: selectedCountry } : {}),
                          }).toString()}`
                        : ''
                    }`}
                    className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>
                      {isFrench
                        ? `Voir Toutes les Offres ${selectedIndustry || selectedCountry ? 'Correspondantes' : ''}`
                        : `View All ${selectedIndustry || selectedCountry ? 'Matching ' : ''}Tenders`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {filteredTenders.length === 0 ? (
                  <div className="glass-panel rounded-2xl p-8 md:p-12 text-center space-y-3 bg-white border border-slate-200 shadow-sm animate-fade-in">
                    <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
                    <h3 className="text-slate-900 font-extrabold text-base">
                      {isFrench
                        ? `Aucun appel d'offres trouvé pour ${selectedIndustry || selectedCountry || 'ces critères'}`
                        : `No tenders found for ${selectedIndustry || selectedCountry || 'selected criteria'}`}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                      {isFrench
                        ? 'Réinitialisez votre filtre sectoriel ou géographique pour afficher tous les avis disponibles.'
                        : 'Reset your industry or country filter to explore all global procurement notices.'}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCountry('');
                        setSelectedIndustry('');
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs hover:bg-emerald-100 transition-colors"
                    >
                      {isFrench ? 'Afficher Toutes les Offres' : 'Show All Tenders'}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredTenders.map((tender) => (
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
