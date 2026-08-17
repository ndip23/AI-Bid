'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PublicNav } from '../../../components/layout/PublicNav';
import { PublicFooter } from '../../../components/layout/PublicFooter';
import { Sparkles, ArrowRight, Mail, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PublicNav />

      <main className="flex-1 flex flex-col justify-center items-center px-4 pt-28 pb-16">
        <div className="w-full max-w-md space-y-6 glass-panel rounded-3xl p-8 bg-white border border-slate-200 shadow-xl relative z-10">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reset Password</h2>
            <p className="text-xs text-slate-500 font-medium">
              Enter your work email to receive password reset instructions
            </p>
          </div>

          {submitted ? (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <p>If your email is registered, you will receive password reset instructions shortly.</p>
              <Link href="/login" className="text-emerald-600 font-extrabold block hover:underline pt-1">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-medium shadow-sm"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl gradient-bg text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 hover:opacity-95 transition-opacity flex items-center justify-center space-x-2"
              >
                <span>Send Reset Instructions</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-center text-xs text-slate-500 font-medium">
            Remembered your password?{' '}
            <Link href="/login" className="text-emerald-600 font-extrabold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
