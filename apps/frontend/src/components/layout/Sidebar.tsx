'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import {
  LayoutDashboard,
  Search,
  BookmarkCheck,
  Building2,
  ShieldAlert,
  LogOut,
  Sparkles,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  isMobileOnly?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile, isMobileOnly = false }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/tenders', label: 'Tender Discovery', icon: Search },
    { href: '/saved', label: 'Saved Pipeline', icon: BookmarkCheck },
    { href: '/company', label: 'Capability Profile', icon: Building2 },
  ];

  if (user?.role === 'SUPER_ADMIN') {
    navItems.push({ href: '/admin', label: 'Admin Portal', icon: ShieldAlert });
  }

  const content = (
    <div className="flex flex-col justify-between h-full p-4">
      <div className="space-y-6">
        {/* Navigation Section Header */}
        <div className="px-3 pt-2 flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Main Navigation
          </span>
          {onCloseMobile && (
            <button onClick={onCloseMobile} className="md:hidden text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Banner & Logout */}
      <div className="space-y-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center space-x-2 text-blue-700 font-bold text-xs mb-1">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>AI Match Engine active</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            Real-time scoring based on ISO certs & operating geography.
          </p>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 text-xs font-bold transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  // If used strictly as mobile overlay in Header
  if (isMobileOnly) {
    if (!mobileOpen) return null;
    return (
      <div className="fixed inset-0 z-50 md:hidden flex">
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onCloseMobile} />
        <div className="relative w-72 bg-white h-full shadow-2xl z-10 animate-slide-right">
          {content}
        </div>
      </div>
    );
  }

  // Standard Page Sidebar
  return (
    <aside className="hidden md:flex w-64 border-r border-slate-200 bg-white sticky top-16 h-[calc(100vh-4rem)] shrink-0">
      {content}
    </aside>
  );
};
