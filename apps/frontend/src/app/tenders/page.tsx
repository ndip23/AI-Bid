'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { Footer } from '../../components/layout/Footer';
import { TenderCard } from '../../components/tenders/TenderCard';
import { BidBondCalculatorModal } from '../../components/tenders/BidBondCalculatorModal';
import { ApiClient } from '../../lib/api-client';
import { Tender } from '../../types';
import { SkeletonCard } from '../../components/ui';
import {
  Search,
  Sparkles,
  RefreshCw,
  Filter,
  TrendingUp,
  Clock,
  Building2,
  ShieldCheck,
  Calculator,
  Globe2,
  Server,
  Zap,
  Briefcase,
  GraduationCap,
  Truck,
  Sprout,
  Activity,
  ArrowUpDown,
  SlidersHorizontal,
  X,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useLanguage } from '../../lib/language-context';

export default function TendersDiscoveryPage() {
  const { t, lang } = useLanguage();
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [opportunityType, setOpportunityType] = useState('');
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'match' | 'deadline' | 'value' | 'newest'>('match');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [calculatorTender, setCalculatorTender] = useState<Tender | null>(null);

  const SECTORS = [
    { id: '', name: 'All Sectors', fr: 'Tous Secteurs', icon: Layers },
    { id: 'Cloud & IT Infrastructure', name: 'Cloud & IT', fr: 'Cloud & IT', icon: Server },
    { id: 'Civil Infrastructure & Construction', name: 'Construction', fr: 'BTP & Génie Civil', icon: Building2 },
    { id: 'Renewable Energy & Solar Power', name: 'Energy & Solar', fr: 'Énergie & Solaire', icon: Zap },
    { id: 'Healthcare & Medical Systems', name: 'Healthcare', fr: 'Santé & Médical', icon: Activity },
    { id: 'Agriculture & Water Resources', name: 'Agri & Water', fr: 'Agro & Hydraulique', icon: Sprout },
    { id: 'Transport & Logistics', name: 'Logistics', fr: 'Transport & Logistique', icon: Truck },
    { id: 'Consulting & Governance', name: 'Consulting', fr: 'Conseil & Gouvernance', icon: Briefcase },
    { id: 'Education & Training', name: 'Education', fr: 'Éducation & Formation', icon: GraduationCap },
  ];

  const MARKETS = [
    { id: '', name: 'All Markets', fr: 'Tous Marchés' },
    { id: 'Cameroon', name: 'Cameroon', fr: 'Cameroun' },
    { id: 'Nigeria', name: 'Nigeria', fr: 'Nigeria' },
    { id: "Cote d'Ivoire", name: "Côte d'Ivoire", fr: "Côte d'Ivoire" },
    { id: 'Pan-African', name: 'Global UNGM', fr: 'UN Global' },
  ];

  const fetchTenders = async (bypassCache = false) => {
    if (bypassCache) {
      ApiClient.clearTendersCache();
    }
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
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const paramCountry = searchParams.get('country');
      const paramIndustry = searchParams.get('industry');
      const paramRegion = searchParams.get('region');
      const paramType = searchParams.get('type') || searchParams.get('opportunityType');
      if (paramCountry) setCountry(paramCountry);
      if (paramIndustry) setIndustry(paramIndustry);
      if (paramRegion) setRegion(paramRegion);
      if (paramType) setOpportunityType(paramType);
    }
  }, []);

  useEffect(() => {
    fetchTenders();
  }, [search, industry, country, minScore]);

  // Client-side filtering for opportunity type and sub-region
  const displayedTenders = useMemo(() => {
    return tenders.filter((t) => {
      if (opportunityType) {
        if (opportunityType === 'PRIVATE_TENDER') {
          const isPrivate =
            t.opportunityType === 'PRIVATE_TENDER' ||
            t.opportunityType === 'REQUEST_FOR_PROPOSAL' ||
            t.opportunityType === 'REQUEST_FOR_QUOTATION' ||
            t.sourceCategory === 'PRIVATE_PROCUREMENT' ||
            t.buyerType === 'PRIVATE_COMPANY';
          if (!isPrivate) return false;
        } else if (opportunityType === 'SUBCONTRACTING') {
          if (t.opportunityType !== 'SUBCONTRACTING' && t.sourceCategory !== 'SUBCONTRACTING') return false;
        } else if (opportunityType === 'STATE_OWNED_ENTERPRISE') {
          if (t.sourceCategory !== 'STATE_OWNED_ENTERPRISE' && t.buyerType !== 'STATE_OWNED_ENTERPRISE') return false;
        } else if (opportunityType === 'PUBLIC_TENDER') {
          const isPublic = !t.opportunityType || t.opportunityType === 'PUBLIC_TENDER';
          if (!isPublic) return false;
        }
      }
      if (region) {
        const combined = `${t.title} ${t.description} ${t.buyerName} ${t.buyerCountry}`.toLowerCase();
        if (!combined.includes(region.toLowerCase())) return false;
      }
      return true;
    });
  }, [tenders, opportunityType, region]);

  // Sorted tenders based on active sort option
  const sortedTenders = useMemo(() => {
    return [...displayedTenders].sort((a, b) => {
      if (sortBy === 'match') {
        return (b.matchScore || 0) - (a.matchScore || 0);
      }
      if (sortBy === 'deadline') {
        const dateA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
        const dateB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
        return dateA - dateB;
      }
      if (sortBy === 'value') {
        const valA = a.estimatedValue || 0;
        const valB = b.estimatedValue || 0;
        return valB - valA;
      }
      if (sortBy === 'newest') {
        const pubA = a.publishDate ? new Date(a.publishDate).getTime() : 0;
        const pubB = b.publishDate ? new Date(b.publishDate).getTime() : 0;
        return pubB - pubA;
      }
      return 0;
    });
  }, [displayedTenders, sortBy]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    return [
      search ? 1 : 0,
      industry ? 1 : 0,
      country ? 1 : 0,
      region ? 1 : 0,
      opportunityType ? 1 : 0,
      minScore > 0 ? 1 : 0,
    ].reduce((a, b) => a + b, 0);
  }, [search, industry, country, region, opportunityType, minScore]);

  const clearAllFilters = () => {
    setSearch('');
    setIndustry('');
    setCountry('');
    setRegion('');
    setOpportunityType('');
    setMinScore(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />

      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 space-y-5 overflow-y-auto min-w-0">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100/70 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide mb-1.5">
                <Globe2 className="w-3 h-3 text-emerald-600" />
                <span>{t('tenders.badge', 'Pan-African Public Procurement Network')}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Search className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                {t('tenders.title', 'African & Global Tender Discovery')}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {t('tenders.subtitle', 'Browse verified procurement notices from ARMP, BPP, DGMP, AfDB, World Bank, UNGM and private corporate RFPs.')}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={() => {
                  if (tenders.length > 0) {
                    setCalculatorTender(tenders[0]);
                  } else {
                    setCalculatorTender({
                      id: 'calc-sample',
                      title: 'Public Infrastructure & Works Contract',
                      refNumber: 'DAO/MINMAP/2026/089',
                      buyerName: 'Ministry of Public Works / Contracting Authority',
                      buyerCountry: 'Cameroon',
                      industry: 'Civil Infrastructure & Construction',
                      estimatedValue: 750000,
                      currency: 'USD',
                      publishDate: new Date().toISOString(),
                      deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
                      description: 'Construction and modernization of key public infrastructure.',
                      rawContent: '',
                      status: 'OPEN',
                    });
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                title="Calculate Provisional Bid Bond and Bank Fees"
              >
                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('tenders.bidBondCalc', 'Bid Bond Calculator')}</span>
              </button>

              <button
                onClick={() => fetchTenders(true)}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{t('tenders.refresh', 'Refresh')}</span>
              </button>
            </div>
          </div>

          {/* Interactive Horizontal Scrolling Sector Pills */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-extrabold uppercase tracking-wider text-slate-500 text-[10px] flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                {lang === 'fr' ? 'Secteurs Clés' : 'Key Sectors'}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">{SECTORS.length - 1} {lang === 'fr' ? 'Secteurs Couverts' : 'Active Sectors'}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 text-xs scrollbar-none touch-pan-x">
              {SECTORS.map((sec) => {
                const isSelected = (!sec.id && !industry) || (industry && industry.toLowerCase() === sec.id.toLowerCase());
                const IconComp = sec.icon;
                return (
                  <button
                    key={sec.name}
                    onClick={() => setIndustry(sec.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap flex items-center space-x-1.5 transition-all shrink-0 text-xs ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span>{lang === 'fr' ? sec.fr : sec.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Target Market Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 text-xs scrollbar-none touch-pan-x">
            {MARKETS.map((m) => {
              const isSelected = (!m.id && !country) || (country && country.toLowerCase() === m.id.toLowerCase());
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setCountry(m.id);
                    setRegion('');
                  }}
                  className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 text-xs ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Globe2 className="w-3.5 h-3.5 shrink-0 opacity-75" />
                  <span>{lang === 'fr' ? m.fr : m.name}</span>
                </button>
              );
            })}

            {/* Quick Opportunity Type Pills */}
            <button
              onClick={() => setOpportunityType(opportunityType === 'PRIVATE_TENDER' ? '' : 'PRIVATE_TENDER')}
              className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 text-xs ${
                opportunityType === 'PRIVATE_TENDER'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 shrink-0 opacity-80" />
              <span>{lang === 'fr' ? 'Marchés Privés' : 'Private RFPs'}</span>
            </button>

            <button
              onClick={() => setOpportunityType(opportunityType === 'SUBCONTRACTING' ? '' : 'SUBCONTRACTING')}
              className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 text-xs ${
                opportunityType === 'SUBCONTRACTING'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 shrink-0 opacity-80" />
              <span>{lang === 'fr' ? 'Sous-Traitance' : 'Subcontracting'}</span>
            </button>
          </div>

          {/* Search, Mobile Drawer Toggle & Detailed Filters */}
          <div className="glass-panel rounded-2xl p-4 space-y-3 bg-white border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('tenders.searchPlaceholder', 'Search by keyword, ERP, hospital, ref #, buyer...')}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium shadow-xs"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Mobile filter toggle */}
              <button
                type="button"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className={`md:hidden px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  showMobileFilters || activeFiltersCount > 0
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'fr' ? 'Filtres Avancés' : 'Advanced Filters'}</span>
                {activeFiltersCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* Filter Dropdowns (Visible on desktop or when mobile drawer expanded) */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 ${showMobileFilters ? 'block' : 'hidden md:grid'}`}>
              {/* Opportunity Type / Sector Filter (Private, Subcontracting, SOE, Public) */}
              <select
                value={opportunityType}
                onChange={(e) => setOpportunityType(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-600 font-medium shadow-xs"
              >
                <option value="">{lang === 'fr' ? "Tous types d'opportunités" : 'All Opportunity Types'}</option>
                <option value="PRIVATE_TENDER">{lang === 'fr' ? 'Marchés Privés & RFPs (MTN, Orange...)' : 'Private Corporate RFPs'}</option>
                <option value="SUBCONTRACTING">{lang === 'fr' ? 'Sous-Traitance (BSTP-CMR)' : 'Subcontracting (BSTP)'}</option>
                <option value="STATE_OWNED_ENTERPRISE">{lang === 'fr' ? 'Entreprises Publiques (PAD, ENEO)' : 'State Enterprises (SOE)'}</option>
                <option value="PUBLIC_TENDER">{lang === 'fr' ? 'Marchés Publics & Bailleurs' : 'Public Procurement'}</option>
              </select>

              {/* Country Filter */}
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setRegion('');
                }}
                className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-600 font-medium shadow-xs"
              >
                <option value="">{t('tenders.allMarkets', 'All Target Markets')}</option>
                <optgroup label={lang === 'fr' ? 'Marchés Africains Cibles' : 'African Target Markets'}>
                  <option value="Cameroon">Cameroon (ARMP / COLEPS / BSTP / Privé)</option>
                  <option value="Nigeria">Nigeria (BPP / Federal / WB)</option>
                  <option value="Cote d'Ivoire">Côte d'Ivoire (DGMP / WB)</option>
                  <option value="Kenya">Kenya (PPIP / Counties)</option>
                  <option value="South Africa">South Africa (eTender)</option>
                  <option value="Pan-African">Pan-African (AfDB / UNGM)</option>
                  <option value="Ghana">Ghana (PPA)</option>
                  <option value="Rwanda">Rwanda (RPPA / Umucyo)</option>
                </optgroup>
                <optgroup label={lang === 'fr' ? 'Marchés Internationaux' : 'Global Markets'}>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                </optgroup>
              </select>

              {/* Regional Division Filter */}
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-600 font-medium shadow-xs"
              >
                <option value="">{t('tenders.allRegions', 'All Regions & Municipalities')}</option>
                <optgroup label={lang === 'fr' ? 'Régions Cameroun' : 'Cameroon Regions'}>
                  <option value="Littoral">Littoral (Douala, Sanaga-Maritime)</option>
                  <option value="Centre">Centre (Yaoundé, Mfoundi)</option>
                  <option value="Ouest">Ouest (Bafoussam, Hauts-Plateaux)</option>
                  <option value="Sud">Sud (Kribi Port, Ebolowa)</option>
                  <option value="Adamaoua">Adamaoua (Ngaoundéré)</option>
                  <option value="Nord">Nord (Garoua)</option>
                  <option value="Extrême-Nord">Extrême-Nord (Maroua)</option>
                  <option value="Est">Est (Bertoua)</option>
                  <option value="Nord-Ouest">Nord-Ouest (Bamenda)</option>
                  <option value="Sud-Ouest">Sud-Ouest (Buea, Limbe)</option>
                </optgroup>
                <optgroup label={lang === 'fr' ? 'Juridictions Nigéria' : 'Nigeria Jurisdictions'}>
                  <option value="Lagos">Lagos State & Ikeja</option>
                  <option value="Abuja">Abuja FCT & Federal Ministries</option>
                  <option value="Rivers">Rivers State & Port Harcourt</option>
                </optgroup>
                <optgroup label={lang === 'fr' ? "Régions Côte d'Ivoire" : "Côte d'Ivoire Regions"}>
                  <option value="Abidjan">Abidjan (Plateau, Cocody, Treichville)</option>
                  <option value="Yamoussoukro">Yamoussoukro</option>
                  <option value="San-Pedro">San-Pédro Port & Littoral</option>
                  <option value="Bouaké">Bouaké (Gbêkê)</option>
                </optgroup>
              </select>

              {/* AI Match Score Pills */}
              <div className="flex items-center justify-between gap-1 p-1 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <span className="text-[10px] font-bold text-slate-500 pl-1">Score:</span>
                {[0, 70, 80, 90].map((score) => (
                  <button
                    key={score}
                    onClick={() => setMinScore(score)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-black transition-all ${
                      minScore === score
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {score === 0 ? 'All' : `≥${score}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filter Chips & Clear All */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {lang === 'fr' ? 'Filtres Actifs :' : 'Active Filters:'}
                </span>

                {search && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-bold text-xs">
                    "{search}"
                    <button onClick={() => setSearch('')} className="hover:text-slate-950 p-0.5"><X className="w-3 h-3" /></button>
                  </span>
                )}

                {industry && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs">
                    {industry}
                    <button onClick={() => setIndustry('')} className="hover:text-emerald-950 p-0.5"><X className="w-3 h-3" /></button>
                  </span>
                )}

                {country && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold text-xs">
                    {country}
                    <button onClick={() => setCountry('')} className="hover:text-blue-950 p-0.5"><X className="w-3 h-3" /></button>
                  </span>
                )}

                {region && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 font-bold text-xs">
                    {region}
                    <button onClick={() => setRegion('')} className="hover:text-purple-950 p-0.5"><X className="w-3 h-3" /></button>
                  </span>
                )}

                {opportunityType && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-xs">
                    {opportunityType}
                    <button onClick={() => setOpportunityType('')} className="hover:text-amber-950 p-0.5"><X className="w-3 h-3" /></button>
                  </span>
                )}

                {minScore > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs">
                    Score ≥ {minScore}%
                    <button onClick={() => setMinScore(0)} className="hover:text-emerald-950 p-0.5"><X className="w-3 h-3" /></button>
                  </span>
                )}

                <button
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-slate-500 hover:text-emerald-700 underline ml-2"
                >
                  {lang === 'fr' ? 'Tout Effacer' : 'Clear All'}
                </button>
              </div>
            )}
          </div>

          {/* Results Summary & Sorting Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm">
                {sortedTenders.length} {lang === 'fr' ? 'Appels d\'offres trouvés' : 'Tenders Found'}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 font-medium">
                {t('tenders.verifiedLive', 'Verified live procurement records')}
              </span>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-slate-500">{lang === 'fr' ? 'Trier par :' : 'Sort by:'}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-emerald-600 shadow-2xs"
              >
                <option value="match">{lang === 'fr' ? 'Meilleur Score IA' : 'Best AI Match'}</option>
                <option value="deadline">{lang === 'fr' ? 'Clôture Plus Proche' : 'Nearest Deadline'}</option>
                <option value="value">{lang === 'fr' ? 'Plus Grand Budget' : 'Highest Value'}</option>
                <option value="newest">{lang === 'fr' ? 'Plus Récent' : 'Newest Added'}</option>
              </select>
            </div>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : sortedTenders.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center space-y-3 bg-white border border-slate-200 shadow-sm">
              <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-slate-900 font-extrabold text-base">{t('tenders.noTendersFound', 'No tenders found for selected criteria')}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                {lang === 'fr'
                  ? 'Essayez de réinitialiser vos filtres de pays, région ou recherche pour découvrir plus d\'opportunités.'
                  : 'Try resetting your country, region, or search term to discover more opportunities.'}
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs hover:bg-emerald-100 transition-colors"
              >
                {t('tenders.resetFilters', 'Reset All Filters')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedTenders.map((tender) => (
                <TenderCard key={tender.id} tender={tender} onSavedChange={() => fetchTenders(true)} />
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />

      {/* Bid Bond Calculator Modal */}
      {calculatorTender && (
        <BidBondCalculatorModal
          tender={calculatorTender}
          isOpen={!!calculatorTender}
          onClose={() => setCalculatorTender(null)}
        />
      )}
    </div>
  );
}
