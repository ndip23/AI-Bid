'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { useAuth } from '../../lib/auth-context';
import { useToast } from '../../lib/toast-context';
import { useLanguage } from '../../lib/language-context';
import { ApiClient } from '../../lib/api-client';
import {
  User,
  Lock,
  Mail,
  CheckCircle2,
  ShieldCheck,
  Building2,
  KeyRound,
  MessageSquare,
  Phone,
  Smartphone,
  Send,
  CheckCheck,
  Eye,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react';

export default function UserProfilePage() {
  const { user, company, updateUser } = useAuth();
  const { toast } = useToast();
  const { isFrench } = useLanguage();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [profileMsg, setProfileMsg] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [passError, setPassError] = useState('');

  // Multi-Channel Alert State
  const [whatsappNumber, setWhatsappNumber] = useState('+237 683 616 584');
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(false);
  const [minMatchScore, setMinMatchScore] = useState(75);
  const [minBudget, setMinBudget] = useState(100000);
  const [targetScope, setTargetScope] = useState('all');
  const [savingAlerts, setSavingAlerts] = useState(false);
  const [testingChannel, setTestingChannel] = useState<string | null>(null);
  const [testModalData, setTestModalData] = useState<any | null>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setUsername(user.username || user.firstName || (user.email ? user.email.split('@')[0] : ''));
      setEmail(user.email || '');

      // Load saved notification preferences
      ApiClient.getNotificationPreferences().then((pref) => {
        if (pref) {
          if (pref.whatsappNumber) setWhatsappNumber(pref.whatsappNumber);
          if (pref.notifyWhatsApp !== undefined) setNotifyWhatsApp(pref.notifyWhatsApp);
          if (pref.notifyEmail !== undefined) setNotifyEmail(pref.notifyEmail);
          if (pref.notifySms !== undefined) setNotifySms(pref.notifySms);
          if (pref.minMatchScoreForAlert !== undefined) setMinMatchScore(pref.minMatchScoreForAlert);
          if (pref.minBudgetForAlert !== undefined) setMinBudget(pref.minBudgetForAlert);
        }
      });

      // Load alert logs
      ApiClient.getAlertLogs().then((logs) => {
        if (Array.isArray(logs)) setRecentLogs(logs);
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg('');
    try {
      const updated = await ApiClient.updateProfile({ username, email });
      updateUser({ username: updated.username || username, email: updated.email || email });
      setProfileMsg(isFrench ? 'Identifiant et email mis à jour avec succès !' : 'Username and email updated successfully!');
      toast.success(
        isFrench ? 'Profil Mis à Jour !' : 'Profile Updated!',
        isFrench ? 'Vos coordonnées ont été enregistrées.' : 'Your username and contact email have been saved.'
      );
    } catch (e: any) {
      setProfileMsg(e.message || (isFrench ? 'Échec de la mise à jour' : 'Failed to update details'));
      toast.error(
        isFrench ? 'Échec de la mise à jour' : 'Update Failed',
        e.message || (isFrench ? 'Impossible d\'enregistrer les modifications.' : 'Could not save profile changes.')
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassMsg('');

    if (!currentPassword) {
      toast.error(
        isFrench ? 'Mot de passe actuel requis' : 'Current Password Required',
        isFrench ? 'Veuillez saisir votre mot de passe actuel.' : 'Please enter your current password.'
      );
      return setPassError(isFrench ? 'Veuillez renseigner votre mot de passe actuel.' : 'Please enter your current password.');
    }

    if (newPassword.length < 8) {
      toast.error(
        isFrench ? 'Mot de passe trop court' : 'Password Too Short',
        isFrench ? 'Le mot de passe doit comporter au moins 8 caractères.' : 'Must be at least 8 characters.'
      );
      return setPassError(isFrench ? 'Le nouveau mot de passe doit comporter au moins 8 caractères.' : 'New password must be at least 8 characters.');
    }

    if (newPassword !== confirmPassword) {
      toast.error(isFrench ? 'Les mots de passe ne correspondent pas' : 'Passwords Do Not Match');
      return setPassError(isFrench ? 'La confirmation ne correspond pas au mot de passe.' : 'New password and confirmation do not match.');
    }

    setSavingPassword(true);
    try {
      await ApiClient.changePassword({ currentPassword, newPassword });
      setPassMsg(isFrench ? 'Mot de passe modifié avec succès !' : 'Password successfully changed!');
      toast.success(
        isFrench ? 'Mot de passe Modifié !' : 'Password Changed!',
        isFrench ? 'Votre mot de passe a été mis à jour en toute sécurité.' : 'Your password has been securely updated.'
      );
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      setPassError(e.message || (isFrench ? 'Échec de la modification' : 'Failed to change password'));
      toast.error(isFrench ? 'Échec du changement de mot de passe' : 'Password Change Failed', e.message);
    } finally {
      setSavingPassword(false);
    }
  };

  const userInitial = (username || user?.username || user?.email || 'U').charAt(0).toUpperCase();
  const displayName = username || user?.username || (company?.name ? company.name.charAt(0).toUpperCase() + company.name.slice(1) : 'Spektralsoft');
  const orgName = company?.name ? company.name.charAt(0).toUpperCase() + company.name.slice(1) : 'Spektralsoft';

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
              <span>{isFrench ? 'Paramètres du Compte & Profil Utilisateur' : 'Account & Profile Settings'}</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {isFrench
                ? 'Gérez vos identifiants personnels, email de contact et sécurité de connexion'
                : 'Manage your personal credentials, contact email, and account security'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Info Card */}
            <div className="glass-panel rounded-2xl p-6 bg-white border border-slate-200 shadow-sm space-y-5 h-fit">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-2xl shadow-md">
                  {userInitial}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {displayName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
                  <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                    {user?.role === 'SUPER_ADMIN'
                      ? (isFrench ? 'Super Administrateur' : 'Super Admin')
                      : (isFrench ? 'Membre de l\'Entreprise' : 'Company Member')}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3 text-xs">
                <div className="flex items-center justify-between text-slate-600 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>{isFrench ? 'Organisation' : 'Organization'}</span>
                  </span>
                  <span className="font-extrabold text-slate-900">{orgName}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 font-medium">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{isFrench ? 'Statut du Compte' : 'Account Status'}</span>
                  </span>
                  <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {isFrench ? 'Actif' : 'Active'}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Details Form */}
              <div className="glass-panel rounded-2xl p-6 bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>{isFrench ? 'Informations Personnelles' : 'Personal Information'}</span>
                </h3>

                {profileMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{profileMsg}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold uppercase tracking-wider text-slate-500">
                      {isFrench ? 'Nom d\'Utilisateur' : 'Username'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder={isFrench ? 'Votre nom d\'utilisateur' : 'Enter your username'}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-emerald-600 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold uppercase tracking-wider text-slate-500">
                      {isFrench ? 'Adresse Email Professionnelle' : 'Work Email Address'}
                    </label>
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
                    {savingProfile
                      ? (isFrench ? 'Enregistrement...' : 'Saving...')
                      : (isFrench ? 'Mettre à Jour le Profil' : 'Update Personal Info')}
                  </button>
                </form>
              </div>

              {/* Password Change Form */}
              <div className="glass-panel rounded-2xl p-6 bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  <span>{isFrench ? 'Sécurité & Mot de Passe' : 'Security & Password'}</span>
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
                    <label className="font-bold uppercase tracking-wider text-slate-500">
                      {isFrench ? 'Mot de Passe Actuel' : 'Current Password'}
                    </label>
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
                      <label className="font-bold uppercase tracking-wider text-slate-500">
                        {isFrench ? 'Nouveau Mot de Passe' : 'New Password'}
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={isFrench ? 'Min. 6 caractères' : 'Min. 6 characters'}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-emerald-600 shadow-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold uppercase tracking-wider text-slate-500">
                        {isFrench ? 'Confirmer le Nouveau Mot de Passe' : 'Confirm New Password'}
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={isFrench ? 'Ressaisissez le mot de passe' : 'Re-type new password'}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-emerald-600 shadow-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs shadow-md hover:bg-slate-800 transition-all"
                  >
                    {savingPassword
                      ? (isFrench ? 'Modification en cours...' : 'Changing Password...')
                      : (isFrench ? 'Modifier le Mot de Passe' : 'Change Password')}
                  </button>
                </form>
              </div>

              {/* Multi-Channel Alerts */}
              <div className="glass-panel rounded-2xl p-6 space-y-5 bg-white border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <span>{isFrench ? 'Alertes d\'Appels d\'Offres Instantanées (WhatsApp, SMS & Email)' : 'Instant Tender Alerts (WhatsApp, SMS & Email)'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {isFrench
                        ? 'Ne manquez plus aucun appel d\'offres. Recevez les notifications directement sur votre téléphone.'
                        : 'Never miss a government or World Bank tender. Get instant notifications directly on your phone.'}
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black border border-emerald-200 self-start sm:self-auto">
                    {isFrench ? 'Passerelle Active' : 'Live Channel Gateway'}
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  {/* WhatsApp Phone Number */}
                  <div className="space-y-1.5">
                    <label className="font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                      <span>{isFrench ? 'Numéro WhatsApp / Mobile (avec indicatif pays)' : 'WhatsApp / Mobile Phone Number (with Country Code)'}</span>
                      <span className="text-[10px] font-bold text-emerald-600">e.g. +237 683 616 584, +234 803..., +225 07...</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="+237 6... or +234..."
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-emerald-600 shadow-sm font-mono"
                      />
                    </div>
                  </div>

                  {/* Channel Checkboxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <label className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start space-x-2.5 cursor-pointer hover:border-emerald-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={notifyWhatsApp}
                        onChange={(e) => setNotifyWhatsApp(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                      />
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 block text-xs">
                          {isFrench ? 'Alertes WhatsApp' : 'WhatsApp Alerts'}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium block">
                          {isFrench ? `Notification instantanée dès que le score ≥ ${minMatchScore}%` : `Instant notification when match score ≥ ${minMatchScore}%`}
                        </span>
                      </div>
                    </label>

                    <label className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start space-x-2.5 cursor-pointer hover:border-emerald-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={notifySms}
                        onChange={(e) => setNotifySms(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                      />
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 block text-xs">
                          {isFrench ? 'Flash SMS Urgent' : 'SMS Flash Digest'}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium block">
                          {isFrench ? 'Alerte critique 48h avant la clôture' : 'Critical deadline alerts 48h before closing'}
                        </span>
                      </div>
                    </label>

                    <label className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start space-x-2.5 cursor-pointer hover:border-emerald-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                      />
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 block text-xs">
                          {isFrench ? 'Dossier Récapitulatif Email' : 'Email Executive Dossier'}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium block">
                          {isFrench ? 'Synthèse détaillée avec analyse IA' : 'Detailed summary with AI requirement checklist'}
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Threshold & Frequency Filter */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <label className="font-bold uppercase tracking-wider text-slate-500">
                        {isFrench ? 'Seuil Minimum de Score IA' : 'Minimum AI Match Score'}
                      </label>
                      <select
                        value={minMatchScore}
                        onChange={(e) => setMinMatchScore(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold focus:outline-none focus:border-emerald-600 shadow-sm"
                      >
                        <option value="60">≥ 60% {isFrench ? '(Tous les Marchés Pertinents)' : '(All Relevant Tenders)'}</option>
                        <option value="75">≥ 75% {isFrench ? '(Forte Adéquation Recommandée)' : '(High Match Recommended)'}</option>
                        <option value="85">≥ 85% {isFrench ? '(Adéquation Critique Uniquement)' : '(Critical Matches Only)'}</option>
                        <option value="90">≥ 90% {isFrench ? '(Excellence / Priorité Absolue)' : '(Top Tier / 90%+ Only)'}</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold uppercase tracking-wider text-slate-500">
                        {isFrench ? 'Seuil Minimum de Budget pour Déclencher l\'Alerte' : 'Minimum Contract Budget to Trigger Alerts'}
                      </label>
                      <select
                        value={minBudget}
                        onChange={(e) => setMinBudget(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold focus:outline-none focus:border-emerald-600 shadow-sm"
                      >
                        <option value="0">{isFrench ? 'Tous les Marchés (Sans seuil minimum)' : 'All Tenders (No minimum threshold)'}</option>
                        <option value="50000">{isFrench ? '50 000$+ (env. 30 000 000 FCFA)' : '$50,000+ (approx 30,000,000 FCFA)'}</option>
                        <option value="100000">{isFrench ? '100 000$+ (env. 60 000 000 FCFA)' : '$100,000+ (approx 60,000,000 FCFA)'}</option>
                        <option value="500000">{isFrench ? '500 000$+ (env. 300 000 000 FCFA)' : '$500,000+ (approx 300,000,000 FCFA)'}</option>
                        <option value="1000000">{isFrench ? '1 000 000$+ (Grands Travaux Uniquement)' : '$1,000,000+ Major Works Only'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Actions & Dispatch Testing */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={savingAlerts}
                      onClick={async () => {
                        setSavingAlerts(true);
                        try {
                          await ApiClient.updateNotificationPreferences({
                            whatsappNumber,
                            notifyWhatsApp,
                            notifyEmail,
                            notifySms,
                            minMatchScoreForAlert: minMatchScore,
                            minBudgetForAlert: minBudget,
                          });
                          toast.success(
                            isFrench ? 'Préférences Enregistrées !' : 'Alert Settings Saved!',
                            isFrench
                              ? `Vos alertes WhatsApp (${whatsappNumber}) et Email ont été synchronisées.`
                              : `Your WhatsApp (${whatsappNumber}) and Email alert preferences are now active.`
                          );
                        } catch (err: any) {
                          toast.error(
                            isFrench ? 'Erreur d\'enregistrement' : 'Save Error',
                            err.message || 'Failed to update alert preferences'
                          );
                        } finally {
                          setSavingAlerts(false);
                        }
                      }}
                      className="px-5 py-2.5 rounded-xl gradient-bg text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 hover:opacity-95 transition-all flex items-center gap-2"
                    >
                      {savingAlerts ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
                      <span>{savingAlerts ? (isFrench ? 'Enregistrement...' : 'Saving...') : (isFrench ? 'Enregistrer les Préférences' : 'Save Alert Preferences')}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={!!testingChannel}
                        onClick={async () => {
                          setTestingChannel('WHATSAPP');
                          try {
                            const res = await ApiClient.testDispatchAlert({
                              channel: 'WHATSAPP',
                              targetPhone: whatsappNumber,
                            });
                            setTestModalData(res);
                            const updatedLogs = await ApiClient.getAlertLogs();
                            if (Array.isArray(updatedLogs)) setRecentLogs(updatedLogs);
                            toast.success(
                              isFrench ? 'Alerte WhatsApp Envoyée !' : 'WhatsApp Alert Dispatched!',
                              isFrench ? `Message simulé envoyé avec succès au ${whatsappNumber}` : `Simulated alert delivered to ${whatsappNumber}`
                            );
                          } catch (err: any) {
                            toast.error('WhatsApp Test Failed', err.message || 'Could not dispatch test');
                          } finally {
                            setTestingChannel(null);
                          }
                        }}
                        className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-extrabold text-xs flex items-center gap-1.5 transition-all"
                      >
                        {testingChannel === 'WHATSAPP' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-emerald-600" />}
                        <span>{isFrench ? 'Tester Alerte WhatsApp' : 'Test WhatsApp Alert'}</span>
                      </button>

                      <button
                        type="button"
                        disabled={!!testingChannel}
                        onClick={async () => {
                          setTestingChannel('EMAIL');
                          try {
                            const res = await ApiClient.testDispatchAlert({
                              channel: 'EMAIL',
                              targetEmail: email,
                            });
                            setTestModalData(res);
                            const updatedLogs = await ApiClient.getAlertLogs();
                            if (Array.isArray(updatedLogs)) setRecentLogs(updatedLogs);
                            toast.success(
                              isFrench ? 'Dossier Email Envoyé !' : 'Email Alert Dispatched!',
                              isFrench ? `Dossier expédié à ${email}` : `Dossier sent to ${email}`
                            );
                          } catch (err: any) {
                            toast.error('Email Test Failed', err.message || 'Could not dispatch test');
                          } finally {
                            setTestingChannel(null);
                          }
                        }}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 hover:bg-slate-200 font-extrabold text-xs flex items-center gap-1.5 transition-all"
                      >
                        {testingChannel === 'EMAIL' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5 text-slate-600" />}
                        <span>{isFrench ? 'Tester Alerte Email' : 'Test Email Alert'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Recent Dispatched Alert Logs */}
                  {recentLogs.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          {isFrench ? 'Historique des Alertes Récentes Expédiées' : 'Recent Dispatched Alert History'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{recentLogs.length} {isFrench ? 'alertes' : 'logged'}</span>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {recentLogs.map((log) => (
                          <div
                            key={log.id}
                            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                                  log.channel === 'WHATSAPP'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                                }`}
                              >
                                {log.channel}
                              </span>
                              <span className="font-bold text-slate-800 truncate">{log.title}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] text-slate-500 font-mono">
                                {new Date(log.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200 flex items-center gap-0.5">
                                <CheckCheck className="w-3 h-3 text-emerald-600" />
                                {log.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Live Test Alert Modal */}
              {testModalData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
                  <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-slate-900">
                            {isFrench ? 'Alerte Expédiée avec Succès' : 'Alert Dispatched Successfully'}
                          </h3>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {isFrench ? 'Format direct prêt pour la passerelle' : 'Payload formatted for live operator gateway'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setTestModalData(null)}
                        className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold">
                        <span className="text-slate-500">{isFrench ? 'Destinataire :' : 'Recipient:'}</span>
                        <span className="font-mono font-bold text-slate-900">{testModalData.dispatchedTo}</span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold">
                        <span className="text-slate-500">{isFrench ? 'Appel d\'offres :' : 'Tender:'}</span>
                        <span className="font-bold text-slate-900 truncate max-w-[240px]">{testModalData.tender?.title}</span>
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                          {isFrench ? 'Aperçu du Message Transmis :' : 'Live Message Content Preview:'}
                        </label>
                        <pre className="p-3.5 rounded-xl bg-slate-950 text-emerald-400 text-[11px] font-mono whitespace-pre-wrap leading-relaxed border border-slate-800 max-h-64 overflow-y-auto">
                          {testModalData.results?.[0]?.body || JSON.stringify(testModalData.results, null, 2)}
                        </pre>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => setTestModalData(null)}
                        className="px-5 py-2 rounded-xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800"
                      >
                        {isFrench ? 'Fermer la Prévisualisation' : 'Close Preview'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
