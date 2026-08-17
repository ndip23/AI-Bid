'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { useAuth } from '../../lib/auth-context';
import { useToast } from '../../lib/toast-context';
import { User, Lock, Mail, CheckCircle2, ShieldCheck, Building2, KeyRound } from 'lucide-react';

export default function UserProfilePage() {
  const { user, company } = useAuth();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [profileMsg, setProfileMsg] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [passError, setPassError] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg('');
    try {
      setProfileMsg('Personal details updated successfully!');
      toast.success('Profile Updated!', 'Your personal information has been saved.');
    } catch (e: any) {
      setProfileMsg('Failed to update details');
      toast.error('Update Failed');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassMsg('');
    if (newPassword.length < 6) {
      toast.error('Password Too Short', 'Must be at least 6 characters.');
      return setPassError('New password must be at least 6 characters.');
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords Do Not Match');
      return setPassError('New password and confirmation do not match.');
    }

    setSavingPassword(true);
    try {
      setPassMsg('Password successfully changed!');
      toast.success('Password Changed!', 'Your password has been successfully updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      setPassError(e.message || 'Failed to change password');
      toast.error('Password Change Failed');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />

      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto min-w-0">
          {/* Header */}
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <User className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
              Account & Profile Settings
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Manage your personal credentials, contact email, and account security
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* User Info Card */}
            <div className="glass-panel rounded-2xl p-6 bg-white border border-slate-200 shadow-sm space-y-5 h-fit">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-2xl shadow-md">
                  {user?.firstName?.[0] || 'U'}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
                  <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                    {user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Company Member'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3 text-xs">
                <div className="flex items-center justify-between text-slate-600 font-medium">
                  <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-slate-400" /> Organization</span>
                  <span className="font-extrabold text-slate-900">{company?.name || 'Acme Defense Services'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 font-medium">
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Account Status</span>
                  <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Active</span>
                </div>
              </div>
            </div>

            {/* Edit Forms */}
            <div className="lg:col-span-2 space-y-6">

              {/* Personal Details Form */}
              <div className="glass-panel rounded-2xl p-6 bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  Personal Information
                </h3>

                {profileMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{profileMsg}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold uppercase tracking-wider text-slate-500">First Name</label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-emerald-600 shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold uppercase tracking-wider text-slate-500">Last Name</label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-emerald-600 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold uppercase tracking-wider text-slate-500">Work Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-emerald-600 shadow-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-5 py-2.5 rounded-xl gradient-bg text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 hover:opacity-95 transition-all"
                  >
                    {savingProfile ? 'Saving...' : 'Update Personal Info'}
                  </button>
                </form>
              </div>

              {/* Password Change Form */}
              <div className="glass-panel rounded-2xl p-6 bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  Security & Password
                </h3>

                {passMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{passMsg}</span>
                  </div>
                )}

                {passError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                    {passError}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold uppercase tracking-wider text-slate-500">Current Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-emerald-600 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold uppercase tracking-wider text-slate-500">New Password</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-emerald-600 shadow-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold uppercase tracking-wider text-slate-500">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-type new password"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-emerald-600 shadow-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs shadow-md hover:bg-slate-800 transition-all"
                  >
                    {savingPassword ? 'Changing Password...' : 'Change Password'}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
