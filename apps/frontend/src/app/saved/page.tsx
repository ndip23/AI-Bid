'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { ApiClient } from '../../lib/api-client';
import { useToast } from '../../lib/toast-context';
import { SavedTender, SavedStatus } from '../../types';
import { BookmarkCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function SavedPipelinePage() {
  const [savedItems, setSavedItems] = useState<SavedTender[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadSaved = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.getSavedTenders();
      setSavedItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const columns: { status: SavedStatus; label: string; color: string }[] = [
    { status: 'BOOKMARKED', label: 'Bookmarked', color: 'border-emerald-300 text-emerald-700' },
    { status: 'UNDER_REVIEW', label: 'Under Review', color: 'border-sky-300 text-sky-700' },
    { status: 'BIDDING', label: 'Bidding / In Progress', color: 'border-emerald-300 text-emerald-700' },
    { status: 'PASSED', label: 'Passed / Declined', color: 'border-rose-300 text-rose-700' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />

      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto min-w-0">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
              Saved Tenders Pipeline
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Track procurement opportunities through evaluation, review, and bid submission
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="glass-panel h-64 rounded-2xl animate-pulse bg-white border border-slate-200" />
              <div className="glass-panel h-64 rounded-2xl animate-pulse bg-white border border-slate-200" />
              <div className="glass-panel h-64 rounded-2xl animate-pulse bg-white border border-slate-200" />
              <div className="glass-panel h-64 rounded-2xl animate-pulse bg-white border border-slate-200" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {columns.map((col) => {
                const itemsInCol = savedItems.filter((item) => item.status === col.status);
                return (
                  <div key={col.status} className="glass-panel rounded-2xl p-4 space-y-4 bg-white border border-slate-200 shadow-sm">
                    {/* Column Header */}
                    <div className={`flex items-center justify-between pb-3 border-b border-slate-100 ${col.color}`}>
                      <span className="font-extrabold text-xs tracking-wider uppercase">
                        {col.label}
                      </span>
                      <span className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-extrabold text-slate-700">
                        {itemsInCol.length}
                      </span>
                    </div>

                    {/* Column Items */}
                    <div className="space-y-3">
                      {itemsInCol.length === 0 ? (
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-400 font-medium">
                          No tenders in this stage
                        </div>
                      ) : (
                        itemsInCol.map((item) => (
                          <div
                            key={item.id}
                            className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 hover:border-emerald-300 transition-all text-xs"
                          >
                            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono font-bold">
                              <span>{item.tender.refNumber}</span>
                              {item.matchDetails?.overallScore && (
                                <span className="font-extrabold text-emerald-600">
                                  {item.matchDetails.overallScore}% Match
                                </span>
                              )}
                            </div>

                            <Link
                              href={`/tenders/${item.tender.id}`}
                              className="font-bold text-slate-900 hover:text-emerald-600 transition-colors block line-clamp-2"
                            >
                              {item.tender.title}
                            </Link>

                            <p className="text-[11px] text-slate-500 font-semibold">
                              {item.tender.buyerName}
                            </p>

                            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                              <span className="text-emerald-700 font-extrabold">
                                ${item.tender.estimatedValue.toLocaleString()}
                              </span>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={async () => {
                                    try {
                                      await ApiClient.unsaveTender(item.tender.id);
                                      setSavedItems(savedItems.filter(i => i.id !== item.id));
                                      toast.info('Tender Removed', 'Opportunity removed from pipeline.');
                                    } catch (e) {
                                      toast.error('Failed to Remove', 'Could not update pipeline.');
                                    }
                                  }}
                                  className="text-[10px] text-rose-500 hover:underline font-bold"
                                >
                                  Remove
                                </button>
                                <Link
                                  href={`/tenders/${item.tender.id}`}
                                  className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-0.5"
                                >
                                  View <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
