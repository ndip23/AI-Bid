'use client';

import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`skeleton rounded-xl bg-slate-200/70 ${className}`}
    />
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="glass-panel rounded-3xl p-6 bg-white border border-slate-200 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-12 w-full" />
      <div className="grid grid-cols-3 gap-2 pt-2">
        <Skeleton className="h-8 w-full rounded-xl" />
        <Skeleton className="h-8 w-full rounded-xl" />
        <Skeleton className="h-8 w-full rounded-xl" />
      </div>
    </div>
  );
};

export const SkeletonDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner Skeleton */}
      <div className="glass-panel rounded-3xl p-8 bg-white border border-slate-200 space-y-4">
        <Skeleton className="h-5 w-48 rounded-full" />
        <Skeleton className="h-8 w-80" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>

      {/* 4 Metric Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-panel rounded-2xl p-5 space-y-3 bg-white border border-slate-200">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-36" />
          </div>
        ))}
      </div>

      {/* Feed Skeletons */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
};
