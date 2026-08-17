'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PublicNav } from '../../../components/layout/PublicNav';
import { PublicFooter } from '../../../components/layout/PublicFooter';
import { useAuth } from '../../../lib/auth-context';
import { useToast } from '../../../lib/toast-context';
import { Sparkles, ArrowRight, Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const perks = [
  '14-day free trial — no credit card required',
  'Full access to AI match engine & summaries',
  '50,000+ live procurement notices',
  'Setup in under 30 minutes',
];

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const { login }  = useAuth();
  const { toast }  = useToast();
  const router     = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      toast.success('Welcome back!', 'Signed in successfully.');
      router.push('/dashboard');
    } catch (err: any) {
      let rawMsg = err?.message || '';
      if (!rawMsg || /prisma|sql|invocation|column|syntax|undefined|null|table|findunique|exception|stack|nest/i.test(rawMsg)) {
        rawMsg = 'Invalid work email or password. Please check your credentials and try again.';
      }
      setError(rawMsg);
      toast.error('Login Failed', rawMsg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: 'user' | 'admin') => {
    setEmail(role === 'admin' ? 'admin@aibidcopilot.com' : 'user@apextech.com');
    setPassword('DemoPassword123!');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PublicNav />

      <main className="flex-1 flex flex-col lg:flex-row pt-20">
        {/* ─── LEFT PANEL (hidden on mobile) ─── */}
        <div className="hidden lg:flex lg:w-[45%] hero-mesh flex-col justify-between p-12 border-r border-slate-200">
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900 leading-tight">
              Evaluate RFPs in seconds with AI.
            </h2>
            <p className="text-slate-600 font-medium text-sm leading-relaxed">
              Sign in to your account to discover new tenders, review match scores, and track your active bid pipeline.
            </p>

            <ul className="space-y-3 pt-2">
              {perks.map((p) => (
                <li key={p} className="flex items-center space-x-3 text-sm font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glassmorphic rounded-3xl p-6 space-y-4 shadow-lg border border-slate-200/80">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-amber-400 text-base">★</span>
              ))}
            </div>
            <p className="text-slate-700 font-medium leading-relaxed text-xs italic">
              &ldquo;Bidora cut our RFP evaluation time from three days to under an hour. We went from reviewing 10 tenders a month to 60.&rdquo;
            </p>
            <div>
              <div className="font-extrabold text-slate-900 text-xs">Sarah Chen</div>
              <div className="text-[11px] text-slate-500 font-medium">VP of Business Development, Nexus Federal Solutions</div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT PANEL (Form) ─── */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white">
          <div className="w-full max-w-md space-y-7">
            {/* Heading */}
            <div className="space-y-1.5">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</h1>
              <p className="text-sm text-slate-500 font-medium">
                Sign in to your account to access your bid pipeline.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Work email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-blue-600/10 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Password
                  </label>
                  <Link href="/reset-password" className="text-xs text-emerald-600 font-bold hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-11 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-blue-600/10 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl gradient-bg text-white font-extrabold text-sm gradient-glow hover:opacity-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Copilot</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider 
            <div className="flex items-center space-x-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-bold">OR DEMO LOGINS</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>*/}

            {/* Demo Buttons
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => fillDemo('user')}
                className="py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold hover:bg-emerald-100 transition-colors"
              >
                Company User Demo
              </button>
              <button
                onClick={() => fillDemo('admin')}
                className="py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold hover:bg-emerald-100 transition-colors"
              >
                Super Admin Demo
              </button>
            </div> */}

            {/* Register link */}
            <p className="text-center text-sm text-slate-500 font-medium">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-emerald-600 font-extrabold hover:underline">
                Create one free →
              </Link>
            </p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
