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
import { Sparkles, ArrowRight, Eye, EyeOff, CheckCircle2, User, Mail, Lock, Building2 } from 'lucide-react';

/* Password strength checker */
function getStrength(pw: string, isFrench: boolean): { label: string; color: string; pct: number } {
  if (!pw) return { label: '', color: 'bg-slate-200', pct: 0 };
  const checks = [pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)];
  const score  = checks.filter(Boolean).length;
  if (score <= 1) return { label: isFrench ? 'Faible' : 'Weak', color: 'bg-rose-500', pct: 25 };
  if (score === 2) return { label: isFrench ? 'Moyen' : 'Fair', color: 'bg-amber-500', pct: 50 };
  if (score === 3) return { label: isFrench ? 'Bon' : 'Good', color: 'bg-sky-500', pct: 75 };
  return { label: isFrench ? 'Robuste' : 'Strong', color: 'bg-emerald-500', pct: 100 };
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

export default function RegisterPage() {
  const { isFrench } = useLanguage();
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

  const strength = getStrength(formData.password, isFrench);

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.companyName) {
      const msg = isFrench ? 'Veuillez remplir tous les champs obligatoires.' : 'Please fill in all required fields.';
      setError(msg);
      toast.error(isFrench ? 'Champs Manquants' : 'Validation Error', msg);
      return false;
    }
    if (formData.username.length < 3) {
      const msg = isFrench ? 'Le nom d\'utilisateur doit comporter au moins 3 caractères.' : 'Username must be at least 3 characters.';
      setError(msg);
      toast.error(isFrench ? 'Identifiant Trop Court' : 'Username Too Short', msg);
      return false;
    }
    if (!formData.email.includes('@')) {
      const msg = isFrench ? 'Veuillez renseigner un email professionnel valide.' : 'Please enter a valid work email address.';
      setError(msg);
      toast.error(isFrench ? 'Email Invalide' : 'Invalid Email', msg);
      return false;
    }
    if (formData.password.length < 6) {
      const msg = isFrench ? 'Le mot de passe doit comporter au moins 6 caractères.' : 'Password must be at least 6 characters.';
      setError(msg);
      toast.error(isFrench ? 'Mot de Passe Trop Court' : 'Password Too Short', msg);
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!agreed) {
      const msg = isFrench
        ? 'Veuillez accepter les Conditions d\'Utilisation pour continuer.'
        : 'Please accept the Terms of Service to continue.';
      toast.error(isFrench ? 'Conditions Requises' : 'Terms Agreement Required', msg);
      return setError(msg);
    }
    setLoading(true);
    setError('');
    try {
      await register(formData);
      toast.success(
        isFrench ? 'Compte Créé !' : 'Account Created!',
        isFrench ? 'Bienvenue sur Bidora.' : 'Welcome to Bidora.'
      );
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || (isFrench ? 'Échec de la création du compte.' : 'Registration failed. Please try again.'));
      toast.error(isFrench ? 'Échec d\'Inscription' : 'Registration Failed', err.message || 'Error creating account.');
    } finally {
      setLoading(false);
    }
  };

  const perks = isFrench ? [
    { label: 'Essai gratuit de 14 jours', sub: 'Sans carte bancaire requise' },
    { label: 'Accès complet au moteur d\'adéquation', sub: 'Scoring instantané de chaque appel d\'offres' },
    { label: 'Plus de 50 000 marchés en direct', sub: 'Avis Afrique, Europe & internationaux' },
    { label: 'Opérationnel en 30 minutes', sub: 'Pas en 30 jours' },
  ] : [
    { label: 'Free 14-day trial', sub: 'No credit card required' },
    { label: 'Full match engine access', sub: 'Score every tender instantly' },
    { label: '50,000+ live tenders', sub: 'US, UK, EU & global feeds' },
    { label: 'Setup in 30 minutes', sub: 'Not 30 days' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PublicNav />

      <main className="flex-1 flex flex-col lg:flex-row pt-20">
        {/* ─── LEFT PANEL ─── */}
        <div className="hidden lg:flex lg:w-[42%] hero-mesh flex-col justify-between p-12 border-r border-slate-200">
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-slate-900 leading-tight">
                {isFrench ? (
                  <>
                    Gagnez plus de marchés<br />dès aujourd&apos;hui.
                  </>
                ) : (
                  <>
                    Start winning more<br />contracts today.
                  </>
                )}
              </h2>
              <p className="text-slate-600 font-medium text-sm leading-relaxed">
                {isFrench
                  ? 'Rejoignez plus de 500 équipes d\'appels d\'offres qui utilisent l\'IA pour découvrir, noter et suivre les opportunités de marchés publics.'
                  : 'Join 500+ enterprise bid management teams using AI to discover, score and track procurement opportunities.'}
              </p>
            </div>

            <ul className="space-y-3.5">
              {perks.map((item) => (
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
            &copy; {new Date().getFullYear()} Bidora, Inc. {isFrench ? 'Tous droits réservés.' : ''}
          </p>
        </div>

        {/* ─── RIGHT PANEL (Form) ─── */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white">
          <div className="w-full max-w-md space-y-7">
            {/* Heading */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  {isFrench ? 'Créer votre compte' : 'Create your account'}
                </h1>
                <LanguageSwitcher variant="compact" />
              </div>
              <p className="text-sm text-slate-500 font-medium">
                {isFrench ? 'Gratuit pendant 14 jours. Sans carte requise.' : 'Free for 14 days. No card needed.'}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isFrench ? 'Nom d\'utilisateur' : 'Username'}
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={set('username')}
                    placeholder={isFrench ? 'votre_nom' : 'your_username'}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-blue-600/10 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Work Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isFrench ? 'Email professionnel' : 'Work Email'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={set('email')}
                    placeholder="contact@company.com"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-blue-600/10 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isFrench ? 'Mot de passe' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={set('password')}
                    placeholder={isFrench ? 'Min. 6 caractères' : 'Min. 6 characters'}
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
                      {strength.label} {isFrench ? '' : 'password'}
                    </p>
                  </div>
                )}
              </div>

              {/* Company Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isFrench ? 'Nom de l\'Entreprise' : 'Company Name'}
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={set('companyName')}
                    placeholder={isFrench ? 'Ex. Spektralsoft S.A.R.L' : 'e.g. Spektralsoft Ltd'}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-blue-600/10 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                />
                <span className="text-xs text-slate-500 font-medium leading-relaxed">
                  {isFrench ? (
                    <>
                      J&apos;accepte les{' '}
                      <Link href="/terms" target="_blank" className="text-emerald-600 font-bold hover:underline">
                        Conditions d&apos;Utilisation
                      </Link>
                      , la{' '}
                      <Link href="/privacy" target="_blank" className="text-emerald-600 font-bold hover:underline">
                        Politique de Confidentialité
                      </Link>
                      , et reconnais que Bidora est une plateforme technologique privée indépendante.
                    </>
                  ) : (
                    <>
                      I agree to the{' '}
                      <Link href="/terms" target="_blank" className="text-emerald-600 font-bold hover:underline">
                        Terms of Service
                      </Link>
                      ,{' '}
                      <Link href="/privacy" target="_blank" className="text-emerald-600 font-bold hover:underline">
                        Privacy Policy
                      </Link>
                      , and recognize Bidora is an independent technology provider.
                    </>
                  )}
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl gradient-bg text-white font-extrabold text-sm gradient-glow hover:opacity-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isFrench ? 'Création du compte...' : 'Creating account...'}</span>
                  </>
                ) : (
                  <>
                    <span>{isFrench ? 'Démarrer l\'Essai Gratuit de 14 Jours' : 'Start Free 14-Day Trial'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Login link */}
            <p className="text-center text-sm text-slate-500 font-medium">
              {isFrench ? 'Vous avez déjà un compte ? ' : 'Already have an account? '}
              <Link href="/login" className="text-emerald-600 font-extrabold hover:underline">
                {isFrench ? 'Se connecter →' : 'Sign in →'}
              </Link>
            </p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
