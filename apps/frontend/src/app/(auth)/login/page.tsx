'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PublicNav } from '../../../components/layout/PublicNav';
import { PublicFooter } from '../../../components/layout/PublicFooter';
import { useAuth } from '../../../lib/auth-context';
import { useToast } from '../../../lib/toast-context';
import { useLanguage } from '../../../lib/language-context';
import { LanguageSwitcher } from '../../../components/ui/LanguageSwitcher';
import { Sparkles, ArrowRight, Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const { login }  = useAuth();
  const { toast }  = useToast();
  const { isFrench } = useLanguage();
  const router     = useRouter();

  const perks = isFrench ? [
    'Essai gratuit de 14 jours — sans carte bancaire',
    'Accès complet au moteur d\'adéquation & synthèses IA',
    'Plus de 50 000 avis d\'appels d\'offres en direct',
    'Opérationnel en moins de 30 minutes',
  ] : [
    '14-day free trial — no credit card required',
    'Full access to AI match engine & summaries',
    '50,000+ live procurement notices',
    'Setup in under 30 minutes',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      toast.success(
        isFrench ? 'Bienvenue !' : 'Welcome back!',
        isFrench ? 'Connexion réussie.' : 'Signed in successfully.'
      );
      router.push('/dashboard');
    } catch (err: any) {
      let rawMsg = err?.message || '';
      if (!rawMsg || /prisma|sql|invocation|column|syntax|undefined|null|table|findunique|exception|stack|nest/i.test(rawMsg)) {
        rawMsg = isFrench
          ? 'Email professionnel ou mot de passe invalide. Veuillez vérifier vos identifiants et réessayer.'
          : 'Invalid work email or password. Please check your credentials and try again.';
      }
      setError(rawMsg);
      toast.error(isFrench ? 'Échec de Connexion' : 'Login Failed', rawMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PublicNav />

      <main className="flex-1 flex flex-col lg:flex-row pt-20">
        {/* ─── LEFT PANEL (hidden on mobile) ─── */}
        <div className="hidden lg:flex lg:w-[45%] hero-mesh flex-col justify-between p-12 border-r border-slate-200">
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900 leading-tight">
              {isFrench
                ? 'Évaluez les DAO en quelques secondes grâce à l\'IA.'
                : 'Evaluate RFPs in seconds with AI.'}
            </h2>
            <p className="text-slate-600 font-medium text-sm leading-relaxed">
              {isFrench
                ? 'Connectez-vous à votre compte pour découvrir de nouveaux appels d\'offres, analyser les critères d\'éligibilité et piloter votre pipeline actif.'
                : 'Sign in to your account to discover new tenders, review match scores, and track your active bid pipeline.'}
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
              {isFrench
                ? '« Bidora a divisé par dix notre temps d\'analyse des dossiers d\'appels d\'offres. Nous sommes passés de 10 dossiers étudiés par mois à plus de 50 sans recruter. »'
                : '“Bidora cut our RFP evaluation time from three days to under an hour. We went from reviewing 10 tenders a month to 60.”'}
            </p>
            <div>
              <div className="font-extrabold text-slate-900 text-xs">Sarah Chen</div>
              <div className="text-[11px] text-slate-500 font-medium">
                {isFrench ? 'Directrice du Développement, Nexus Federal Solutions' : 'VP of Business Development, Nexus Federal Solutions'}
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT PANEL (Form) ─── */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white">
          <div className="w-full max-w-md space-y-7">
            {/* Heading */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  {isFrench ? 'Bienvenue' : 'Welcome back'}
                </h1>
                <LanguageSwitcher variant="compact" />
              </div>
              <p className="text-sm text-slate-500 font-medium">
                {isFrench
                  ? 'Connectez-vous à votre compte pour accéder à votre pipeline d\'offres.'
                  : 'Sign in to your account to access your bid pipeline.'}
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
                  {isFrench ? 'Email professionnel' : 'Work email'}
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
                    {isFrench ? 'Mot de passe' : 'Password'}
                  </label>
                  <Link href="/reset-password" className="text-xs text-emerald-600 font-bold hover:underline">
                    {isFrench ? 'Mot de passe oublié ?' : 'Forgot password?'}
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
                    <span>{isFrench ? 'Connexion en cours...' : 'Signing in...'}</span>
                  </>
                ) : (
                  <>
                    <span>{isFrench ? 'Se Connecter à Copilot' : 'Sign In to Copilot'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Register link */}
            <p className="text-center text-sm text-slate-500 font-medium">
              {isFrench ? 'Vous n\'avez pas de compte ? ' : 'Don\'t have an account? '}
              <Link href="/register" className="text-emerald-600 font-extrabold hover:underline">
                {isFrench ? 'Créer un compte gratuit →' : 'Create one free →'}
              </Link>
            </p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
