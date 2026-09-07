'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
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
  const [minScore, setMinScore] = useState<number>(0);
  const [calculatorTender, setCalculatorTender] = useState<Tender | null>(null);

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
      if (paramCountry) setCountry(paramCountry);
      if (paramIndustry) setIndustry(paramIndustry);
      if (paramRegion) setRegion(paramRegion);
    }
  }, []);

  useEffect(() => {
    fetchTenders();
  }, [search, industry, country, minScore]);

  // Client-side region filter matching title, description, buyerName, buyerCountry
  const displayedTenders = tenders.filter((t) => {
    if (!region) return true;
    const combined = `${t.title} ${t.description} ${t.buyerName} ${t.buyerCountry}`.toLowerCase();
    return combined.includes(region.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />

      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto min-w-0">
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
                {t('tenders.subtitle', 'Browse verified public procurement notices from ARMP/COLEPS, BPP, PPIP, AfDB, World Bank, and municipal authorities')}
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
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{t('tenders.refresh', 'Refresh Feed')}</span>
              </button>
            </div>
          </div>

          {/* Bidora Procurement Market Intelligence Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  {t('tenders.activePipeline', 'Active Market Pipeline')}
                </span>
                <p className="text-sm font-black text-slate-900 truncate">$148.5M+ USD</p>
                <span className="text-[10px] text-emerald-600 font-semibold">{lang === 'fr' ? '320+ Offres Récentes' : '320+ Live Notices'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  {t('tenders.avgWindow', 'Avg. Submission Window')}
                </span>
                <p className="text-sm font-black text-slate-900 truncate">{lang === 'fr' ? '24,5 Jours Restants' : '24.5 Days Left'}</p>
                <span className="text-[10px] text-blue-600 font-semibold">{t('tenders.sufficientEnvelopes', 'Sufficient for 3 Envelopes')}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  {t('tenders.topBuyers', 'Top Buyers Active')}
                </span>
                <p className="text-sm font-black text-slate-900 truncate">MINTP, AfDB, FEICOM</p>
                <span className="text-[10px] text-purple-600 font-semibold">{t('tenders.highCredibility', 'High Credibility')}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  {t('tenders.bidBondRequirement', 'Bid Bond Requirement')}
                </span>
                <p className="text-sm font-black text-slate-900 truncate">1.5% - 2.0%</p>
                <span className="text-[10px] text-amber-600 font-semibold">{t('tenders.tier1Guarantee', 'Tier-1 Bank Guarantee')}</span>
              </div>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="glass-panel rounded-2xl p-4 md:p-5 space-y-4 bg-white border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('tenders.searchPlaceholder', 'Search tenders, ref #, buyer...')}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium shadow-xs"
                />
              </div>

              {/* Industry Filter */}
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-600 font-medium shadow-xs"
              >
                <option value="">{t('tenders.allIndustries', 'All Industries & Sectors (8 Sectors)')}</option>
                <option value="Cloud & IT Infrastructure">{lang === 'fr' ? 'Cloud & Infrastructure IT (72)' : 'Cloud & IT Infrastructure (72)'}</option>
                <option value="Civil Infrastructure & Construction">{lang === 'fr' ? 'BTP, Génie Civil & Construction (33)' : 'Civil Infrastructure & Construction (33)'}</option>
                <option value="Renewable Energy & Solar Power">{lang === 'fr' ? 'Énergie Renouvelable & Solaire (13)' : 'Renewable Energy & Solar Power (13)'}</option>
                <option value="Consulting & Governance">{lang === 'fr' ? 'Conseil & Gouvernance (15)' : 'Consulting & Governance (15)'}</option>
                <option value="Healthcare & Medical Systems">{lang === 'fr' ? 'Santé & Équipements Médicaux (8)' : 'Healthcare & Medical Systems (8)'}</option>
                <option value="Education & Training">{lang === 'fr' ? 'Éducation & Formation (7)' : 'Education & Training (7)'}</option>
                <option value="Transport & Logistics">{lang === 'fr' ? 'Transport & Logistique (7)' : 'Transport & Logistics (7)'}</option>
                <option value="Agriculture & Water Resources">{lang === 'fr' ? 'Agriculture & Hydraulique (6)' : 'Agriculture & Water Resources (6)'}</option>
              </select>

              {/* Country Filter */}
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setRegion(''); // Reset sub-region when country changes
                }}
                className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-600 font-medium shadow-xs"
              >
                <option value="">{t('tenders.allMarkets', 'All Target Markets')}</option>
                <optgroup label={lang === 'fr' ? 'Marchés Africains Cibles' : 'African Target Markets'}>
                  <option value="Cameroon">Cameroon (ARMP / COLEPS / MINMAP)</option>
                  <option value="Nigeria">Nigeria (BPP / Federal)</option>
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

              {/* Bidora Regional / Administrative Division Filter */}
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-600 font-medium shadow-xs"
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
                  <option value="Lagos">Lagos State &amp; Ikeja</option>
                  <option value="Abuja">Abuja FCT &amp; Federal Ministries</option>
                  <option value="Rivers">Rivers State &amp; Port Harcourt</option>
                </optgroup>
                <optgroup label={lang === 'fr' ? 'Comtés Kenya' : 'Kenya Counties'}>
                  <option value="Nairobi">Nairobi County</option>
                  <option value="Mombasa">Mombasa Coastal Region</option>
                </optgroup>
                <optgroup label={lang === 'fr' ? 'Bailleurs Internationaux' : 'International Donors'}>
                  <option value="World Bank">{lang === 'fr' ? 'Projets Banque Mondiale' : 'World Bank Projects'}</option>
                  <option value="AfDB">{lang === 'fr' ? 'Banque Africaine de Développement (BAD)' : 'African Development Bank'}</option>
                  <option value="FEICOM">{lang === 'fr' ? 'Communes FEICOM' : 'FEICOM Municipalities'}</option>
                </optgroup>
              </select>
            </div>

            {/* AI Match Score Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center space-x-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-500">{t('tenders.minMatchScore', 'Min AI Match Score:')}</span>
              </div>

              <div className="flex items-center space-x-2">
                {[0, 70, 80, 90].map((score) => (
                  <button
                    key={score}
                    onClick={() => setMinScore(score)}
                    className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all ${
                      minScore === score
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {score === 0 ? t('tenders.allMatches', 'All Matches') : `≥${score}%`}
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
          ) : displayedTenders.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center space-y-3 bg-white border border-slate-200 shadow-sm">
              <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-slate-900 font-extrabold text-base">{t('tenders.noTendersFound', 'No tenders found for selected criteria')}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                {lang === 'fr'
                  ? 'Essayez de réinitialiser vos filtres de pays, région ou recherche pour découvrir plus d\'opportunités.'
                  : 'Try resetting your country, region, or search term to discover more opportunities.'}
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setIndustry('');
                  setCountry('');
                  setRegion('');
                  setMinScore(0);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs hover:bg-emerald-100 transition-colors"
              >
                {t('tenders.resetFilters', 'Reset All Filters')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedTenders.map((tender) => (
                <TenderCard key={tender.id} tender={tender} onSavedChange={() => fetchTenders(true)} />
              ))}
            </div>
          )}
        </main>
      </div>

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
