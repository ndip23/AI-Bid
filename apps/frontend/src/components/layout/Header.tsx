'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import {
  Bell,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Menu,
  CheckCheck,
  Clock,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import { ApiClient } from '../../lib/api-client';
import { NotificationItem } from '../../types';
import { BidoraLogo } from '../ui/BidoraLogo';
import { Sidebar } from './Sidebar';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { useLanguage } from '../../lib/language-context';

export const Header: React.FC = () => {
  const { user, company } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifs = async () => {
    try {
      const data = await ApiClient.getNotifications();
      if (data && Array.isArray(data)) {
        setNotifications(data);
      }
    } catch (e) {
      console.error('Failed to fetch notifications', e);
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await ApiClient.markAllNotificationsAsRead();
  };

  const handleNotificationClick = async (n: NotificationItem) => {
    if (!n.isRead) {
      setNotifications((prev) =>
        prev.map((item) => (item.id === n.id ? { ...item, isRead: true } : item))
      );
      await ApiClient.markNotificationAsRead(n.id);
    }
    setShowNotifications(false);

    if (n.type === 'COMPLIANCE_REQUIRED') {
      router.push('/company');
    } else if (n.type === 'NEW_MATCH') {
      router.push('/tenders');
    } else if (n.type === 'DEADLINE_WARNING') {
      router.push('/saved');
    } else {
      router.push('/dashboard');
    }
  };

  const handleMarkSingleRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
    await ApiClient.markNotificationAsRead(id);
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return '';
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filteredNotifications =
    filter === 'unread' ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <>
      <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between shadow-xs">
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
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Language Switcher */}
          <LanguageSwitcher variant="compact" />

          {/* Active Notifications Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-slate-100 hover:bg-slate-200/70 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all relative"
              aria-label="Notifications"
            >
              <Bell className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${unreadCount > 0 ? 'text-emerald-700' : 'text-slate-600'}`} />
              {unreadCount > 0 ? (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-[18px] h-[18px] rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs ring-2 ring-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              ) : (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-slate-300" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-sm text-slate-900">{t('nav.notifications', 'Notifications')}</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-200">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-[11px] text-emerald-600 hover:text-emerald-800 font-extrabold flex items-center gap-1 transition-colors"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>{t('nav.markAllRead', 'Mark all read')}</span>
                    </button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center space-x-1 pt-2.5 pb-1 border-b border-slate-100 text-xs font-bold">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      filter === 'all'
                        ? 'bg-slate-100 text-slate-900 font-black'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t('nav.all', 'All')} ({notifications.length})
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      filter === 'unread'
                        ? 'bg-emerald-50 text-emerald-700 font-black'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t('nav.unread', 'Unread')} ({unreadCount})
                  </button>
                </div>

                {/* Notifications List */}
                <div className="space-y-2 mt-2.5 max-h-80 overflow-y-auto pr-1">
                  {filteredNotifications.length === 0 ? (
                    <div className="py-8 px-4 text-center space-y-2">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <Bell className="w-5 h-5" />
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {filter === 'unread'
                          ? 'You have caught up on all alerts!'
                          : 'No notifications at this time.'}
                      </p>
                    </div>
                  ) : (
                    filteredNotifications.map((n) => {
                      const isUnread = !n.isRead;
                      return (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer relative group flex items-start space-x-3 ${
                            isUnread
                              ? 'bg-emerald-50/40 border-emerald-200/90 hover:bg-emerald-50/70 shadow-2xs'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {/* Type Icon */}
                          <div className="shrink-0 mt-0.5">
                            {n.type === 'COMPLIANCE_REQUIRED' && (
                              <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-200">
                                <ShieldAlert className="w-4 h-4" />
                              </div>
                            )}
                            {n.type === 'NEW_MATCH' && (
                              <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200">
                                <Sparkles className="w-4 h-4" />
                              </div>
                            )}
                            {n.type === 'DEADLINE_WARNING' && (
                              <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center border border-rose-200">
                                <Clock className="w-4 h-4" />
                              </div>
                            )}
                            {n.type === 'SYSTEM' && (
                              <div className="w-7 h-7 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center border border-sky-200">
                                <Bell className="w-4 h-4" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-1">
                              <h4
                                className={`text-xs truncate ${
                                  isUnread
                                    ? 'font-black text-slate-900'
                                    : 'font-bold text-slate-700'
                                }`}
                              >
                                {n.title}
                              </h4>
                              <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                                {formatRelativeTime(n.createdAt)}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 leading-snug line-clamp-2">
                              {n.message}
                            </p>

                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[10px] font-extrabold text-emerald-600 flex items-center gap-0.5 group-hover:underline">
                                <span>Take Action</span>
                                <ChevronRight className="w-3 h-3" />
                              </span>

                              {isUnread && (
                                <button
                                  onClick={(e) => handleMarkSingleRead(n.id, e)}
                                  className="text-[10px] text-slate-400 hover:text-slate-700 font-bold px-1.5 py-0.5 rounded-md hover:bg-slate-200/60 transition-colors"
                                  title="Mark read"
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer Quick Links */}
                <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <Link
                    href="/company"
                    onClick={() => setShowNotifications(false)}
                    className="hover:text-emerald-700 transition-colors"
                  >
                    Capability Profile →
                  </Link>
                  <Link
                    href="/saved"
                    onClick={() => setShowNotifications(false)}
                    className="hover:text-emerald-700 transition-colors"
                  >
                    Saved Pipeline →
                  </Link>
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
              {(user?.username?.[0] || company?.name?.[0] || 'S').toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                <span>
                  {user?.username
                    ? user.username
                    : user?.firstName
                    ? `${user.firstName} ${user.lastName || ''}`.trim()
                    : company?.name
                    ? company.name.charAt(0).toUpperCase() + company.name.slice(1)
                    : 'Spektralsoft'}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium truncate max-w-[140px]">
                {company?.name
                  ? company.name.charAt(0).toUpperCase() + company.name.slice(1)
                  : user?.role === 'SUPER_ADMIN'
                  ? 'Super Admin'
                  : 'Spektralsoft'}
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
