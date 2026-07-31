'use client';

import React from 'react';
import { Search, Filter, RotateCcw, Sparkles } from 'lucide-react';
import { Input, Select } from '../ui';

interface FilterSidebarProps {
  search: string;
  onSearchChange: (v: string) => void;
  industry: string;
  onIndustryChange: (v: string) => void;
  country: string;
  onCountryChange: (v: string) => void;
  minScore: number;
  onMinScoreChange: (v: number) => void;
  onReset: () => void;
}

const INDUSTRY_OPTIONS = [
  { value: '', label: 'All Industries' },
  { value: 'Cloud & Managed IT Services', label: 'Cloud & Managed IT Services' },
  { value: 'Healthcare Technology', label: 'Healthcare Technology' },
  { value: 'Smart City Infrastructure', label: 'Smart City Infrastructure' },
  { value: 'Cybersecurity', label: 'Cybersecurity' },
  { value: 'Software Engineering', label: 'Software Engineering' },
];

const COUNTRY_OPTIONS = [
  { value: '', label: 'All Countries' },
  { value: 'United States', label: 'United States' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Australia', label: 'Australia' },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  search,
  onSearchChange,
  industry,
  onIndustryChange,
  country,
  onCountryChange,
  minScore,
  onMinScoreChange,
  onReset,
}) => {
  return (
    <aside className="glass-panel rounded-2xl p-5 space-y-5 w-full lg:w-72 flex-shrink-0 bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-sm">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filter Tenders</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Search Bar */}
      <Input
        label="Search Keywords"
        placeholder="Keyword, Ref #, Buyer..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        leftIcon={<Search className="w-4 h-4" />}
      />

      {/* Industry Filter */}
      <Select
        label="Industry Sector"
        value={industry}
        onChange={(e) => onIndustryChange(e.target.value)}
        options={INDUSTRY_OPTIONS}
      />

      {/* Buyer Country Filter */}
      <Select
        label="Buyer Region"
        value={country}
        onChange={(e) => onCountryChange(e.target.value)}
        options={COUNTRY_OPTIONS}
      />

      {/* Match Score Range Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Min Match Score
          </label>
          <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
            {minScore}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={95}
          step={5}
          value={minScore}
          onChange={(e) => onMinScoreChange(Number(e.target.value))}
          className="w-full accent-blue-600 bg-slate-100 h-2 rounded-lg cursor-pointer border border-slate-200"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-bold font-mono">
          <span>0%</span>
          <span>50%</span>
          <span>90%+</span>
        </div>
      </div>
    </aside>
  );
};
