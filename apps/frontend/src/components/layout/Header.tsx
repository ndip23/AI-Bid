'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';
import { Bell, Sparkles, CheckCircle2, AlertCircle, Menu, User } from 'lucide-react';
import { ApiClient } from '../../lib/api-client';
import { BidoraLogo } from '../ui/BidoraLogo';
import { Sidebar } from './Sidebar';

export const Header: React.FC = () => {
  const { user, company } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleToggleNotifications = async () => {
    if (!showNotifications) {
      const data = await ApiClient.getNotifications();
      setNotifications(data || []);
    }
    setShowNotifications(!showNotifications);
  };

  return (
    <>
      <header className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between shadow-sm">
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/dashboard" className="hover:opacity-90 transition-opacity">
            <BidoraLogo size="sm" />
          </Link>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center space-x-2 md:space-x-4">

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={handleToggleNotifications}
              className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                  <span className="font-bold text-sm text-slate-900">Notifications</span>
                  <span onClick={() => setNotifications([])} className="text-xs text-emerald-600 font-semibold cursor-pointer hover:underline">Clear All</span>
                </div>
                <div className="space-y-2.5 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 font-medium">
                      No notifications right now. Alerts will appear here when new tenders are ingested or closing soon.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                        <div className="flex items-center space-x-1.5 font-semibold text-slate-800 mb-1">
                          {n.type === 'NEW_MATCH' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          <span>{n.title}</span>
                        </div>
                        <p className="text-slate-500 text-xs leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill - Links to /profile */}
          <Link
            href="/profile"
            className="flex items-center space-x-3 sm:pl-2 sm:border-l sm:border-slate-200 group hover:opacity-90 transition-opacity"
            title="Edit Profile & Settings"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-sm group-hover:scale-105 transition-transform">
              {user?.firstName?.[0] || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                <span>{user?.firstName} {user?.lastName}</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium truncate max-w-[140px]">
                {user?.role === 'SUPER_ADMIN' ? 'Super Admin' : company?.name || user?.email || 'My Profile'}
              </div>
            </div>
          </Link>
        </div>
      </header>

      {/* Render Mobile Sidebar Drawer if toggled */}
      <Sidebar isMobileOnly mobileOpen={mobileSidebarOpen} onCloseMobile={() => setMobileSidebarOpen(false)} />
    </>
  );
};
