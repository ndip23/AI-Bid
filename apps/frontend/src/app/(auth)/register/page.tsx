'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PublicNav } from '../../../components/layout/PublicNav';
import { PublicFooter } from '../../../components/layout/PublicFooter';
import { useAuth } from '../../../lib/auth-context';
import { useToast } from '../../../lib/toast-context';
import { Sparkles, ArrowRight, Eye, EyeOff, CheckCircle2, User, Mail, Lock, Building2 } from 'lucide-react';

/* Password strength checker */
function getStrength(pw: string): { label: string; color: string; pct: number } {
  if (!pw) return { label: '', color: 'bg-slate-200', pct: 0 };
  const checks = [pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)];
  const score  = checks.filter(Boolean).length;
  if (score <= 1) return { label: 'Weak', color: 'bg-rose-500', pct: 25 };
  if (score === 2) return { label: 'Fair', color: 'bg-amber-500', pct: 50 };
  if (score === 3) return { label: 'Good', color: 'bg-sky-500', pct: 75 };
  return { label: 'Strong', color: 'bg-emerald-500', pct: 100 };
}

const industries = [
  'Cloud & IT Infrastructure',
  'Healthcare & Healthtech Systems',
  'Telecom & Digital Economy',
  'Civil Infrastructure & Construction',
  'Renewable Energy & Solar Power',
  'Cybersecurity & Public Safety',
  'AgriTech & Supply Chain',
];

const steps = ['Your Details', 'Company Info', 'Review & Create'];

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    companyName: '',
    industry: industries[0],
  });
  const [showPass, setShowPass]     = useState(false);
  const [agreed, setAgreed]         = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const { register } = useAuth();
  const { toast }    = useToast();
  const router       = useRouter();

  const set = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setFormData({ ...formData, [field]: e.target.value });

  const strength = getStrength(formData.password);

  const validateStep = () => {
    if (step === 0) {
      if (!formData.username || !formData.email || !formData.password) {
        setError('Please fill in all fields.');
        toast.error('Validation Error', 'Please fill in all required fields.');
        return false;
      }
      if (formData.username.length < 3) {
        setError('Username must be at least 3 characters.');
        toast.error('Username Too Short', 'Must be at least 3 characters.');
        return false;
      }
      if (!formData.email.includes('@')) {
        setError('Please enter a valid work email.');
        toast.error('Invalid Email', 'Please enter a valid work email address.');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        toast.error('Password Too Short', 'Must be at least 6 characters.');
        return false;
      }
    }
    if (step === 1) {
      if (!formData.companyName) {
        setError('Please enter your company name.');
        toast.error('Company Name Required');
        return false;
      }
    }
    setError('');
    return true;
  };

  const next = () => { if (validateStep()) setStep(step + 1); };
  const prev = () => { setError(''); setStep(step - 1); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast.error('Terms Agreement Required', 'Please accept the Terms of Service.');
      return setError('Please accept the Terms of Service to continue.');
    }
    setLoading(true);
    setError('');
    try {
      await register(formData);
      toast.success('Account Created!', 'Welcome to Bidora.');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      toast.error('Registration Failed', err.message || 'Error creating account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PublicNav />

      <main className="flex-1 flex flex-col lg:flex-row pt-20">
        {/* ─── LEFT PANEL ─── */}
        <div className="hidden lg:flex lg:w-[42%] hero-mesh flex-col justify-between p-12 border-r border-slate-200">
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Start Your 14-Day Free Trial</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">
                Start winning more<br />contracts today.
              </h2>
              <p className="text-slate-600 font-medium text-sm leading-relaxed">
                Join 500+ enterprise bid management teams using AI to discover, score and track procurement opportunities.
              </p>
            </div>

            <ul className="space-y-3.5">
              {[
                { label: 'Free 14-day trial', sub: 'No credit card required' },
                { label: 'Full match engine access', sub: 'Score every tender instantly' },
                { label: '50,000+ live tenders', sub: 'US, UK, EU & global feeds' },
                { label: 'Setup in 30 minutes', sub: 'Not 30 days' },
              ].map((item) => (
                <li key={item.label} className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">{item.label}</div>
                    <div className="text-xs text-slate-500 font-medium">{item.sub}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-slate-400 font-medium">
            © {new Date().getFullYear()} Bidora, Inc.
          </p>
        </div>

        {/* ─── RIGHT PANEL (Form) ─── */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white">
          <div className="w-full max-w-md space-y-7">
            {/* Heading */}
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create your account</h1>
              <p className="text-sm text-slate-500 font-medium">Free for 14 days. No card needed.</p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center space-x-2">
              {steps.map((s, i) => (
                <React.Fragment key={s}>
                  <div className="flex items-center space-x-1.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold transition-all ${
                        i < step
                          ? 'bg-emerald-500 text-white'
                          : i === step
                          ? 'gradient-bg text-white shadow-sm'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {i < step ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs font-bold hidden sm:block ${i === step ? 'text-slate-900' : 'text-slate-400'}`}>
                      {s}
                    </span>
                  </div>
                  {i < steps.length - 1 && <div className="flex-1 h-px bg-slate-200" />}
                </React.Fragment>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* ── STEP 0: Personal Details ── */}
              {step === 0 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Username</label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={formData.username}
                        onChange={set('username')}
                        placeholder="your_username"
                        className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-blue-600/10 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Work Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={set('email')}
                        placeholder="jane@company.com"
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-blue-600/10 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPass ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={set('password')}
                        placeholder="Min. 6 characters"
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-11 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-blue-600/10 transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formData.password && (
                      <div className="space-y-1 pt-1">
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${strength.color} rounded-full transition-all duration-500`}
                            style={{ width: `${strength.pct}%` }}
                          />
                        </div>
                        <p className={`text-[11px] font-bold ${strength.color.replace('bg-', 'text-')}`}>
                          {strength.label} password
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={next}
                    className="w-full py-3.5 rounded-xl gradient-bg text-white font-extrabold text-sm gradient-glow hover:opacity-95 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* ── STEP 1: Company Info ── */}
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Company Name</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={set('companyName')}
                        placeholder="Acme Defense Ltd"
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-blue-600/10 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Primary Industry Sector</label>
                    <select
                      value={formData.industry}
                      onChange={set('industry')}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-blue-600/10 transition-all font-medium"
                    >
                      {industries.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>

                  <p className="text-xs text-slate-500 font-medium bg-emerald-50 border border-blue-100 rounded-xl p-3.5">
                    💡 You can add detailed certifications, geographies and capabilities after registration to improve your AI match scores.
                  </p>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={prev}
                      className="flex-1 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      className="flex-[2] py-3.5 rounded-xl gradient-bg text-white font-extrabold text-sm gradient-glow hover:opacity-95 transition-all flex items-center justify-center space-x-2"
                    >
                      <span>Review Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Review ── */}
              {step === 2 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="glass-panel rounded-2xl p-5 space-y-3 bg-slate-50">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Account Summary</p>
                    {[
                      { label: 'Username', value: formData.username },
                      { label: 'Email', value: formData.email },
                      { label: 'Company', value: formData.companyName },
                      { label: 'Industry', value: formData.industry },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between text-sm border-b border-slate-200/60 pb-2 last:border-0 last:pb-0">
                        <span className="text-slate-500 font-medium">{row.label}</span>
                        <span className="font-extrabold text-slate-900 text-right max-w-[200px] truncate">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-blue-600"
                    />
                    <span className="text-xs text-slate-600 font-medium leading-relaxed">
                      I agree to Bidora&apos;s{' '}
                      <a href="#" className="text-emerald-600 font-bold hover:underline">Terms of Service</a>{' '}
                      and{' '}
                      <a href="#" className="text-emerald-600 font-bold hover:underline">Privacy Policy</a>.
                      I understand my data is encrypted and never shared.
                    </span>
                  </label>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={prev}
                      className="flex-1 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-[2] py-3.5 rounded-xl gradient-bg text-white font-extrabold text-sm gradient-glow hover:opacity-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Creating account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>

            <p className="text-center text-sm text-slate-500 font-medium">
              Already have an account?{' '}
              <Link href="/login" className="text-emerald-600 font-extrabold hover:underline">
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
