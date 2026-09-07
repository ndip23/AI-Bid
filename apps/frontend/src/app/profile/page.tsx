'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { useAuth } from '../../lib/auth-context';
import { useToast } from '../../lib/toast-context';
import { useLanguage } from '../../lib/language-context';
import { ApiClient } from '../../lib/api-client';
import { User, Lock, Mail, CheckCircle2, ShieldCheck, Building2, KeyRound, MessageSquare, Phone, Smartphone } from 'lucide-react';

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

  useEffect(() => {
    if (user) {
      setUsername(user.username || user.firstName || (user.email ? user.email.split('@')[0] : ''));
      setEmail(user.email || '');
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
    if (newPassword.length < 6) {
      toast.error(
        isFrench ? 'Mot de passe trop court' : 'Password Too Short',
        isFrench ? 'Le mot de passe doit comporter au moins 6 caractères.' : 'Must be at least 6 characters.'
      );
      return setPassError(isFrench ? 'Le nouveau mot de passe doit comporter au moins 6 caractères.' : 'New password must be at least 6 characters.');
    }
    if (newPassword !== confirmPassword) {
      toast.error(isFrench ? 'Les mots de passe ne correspondent pas' : 'Passwords Do Not Match');
      return setPassError(isFrench ? 'La confirmation ne correspond pas au mot de passe.' : 'New password and confirmation do not match.');
    }

    setSavingPassword(true);
    try {
      setPassMsg(isFrench ? 'Mot de passe modifié avec succès !' : 'Password successfully changed!');
      toast.success(
        isFrench ? 'Mot de passe Modifié !' : 'Password Changed!',
        isFrench ? 'Votre mot de passe a été mis à jour.' : 'Your password has been successfully updated.'
      );
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      setPassError(e.message || (isFrench ? 'Échec de la modification' : 'Failed to change password'));
      toast.error(isFrench ? 'Échec du changement de mot de passe' : 'Password Change Failed');
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
                      <span className="text-[10px] font-bold text-emerald-600">e.g. +237 681 10 84 39</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        defaultValue="+237 681 10 84 39"
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
                        defaultChecked
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                      />
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 block text-xs">
                          {isFrench ? 'Alertes WhatsApp' : 'WhatsApp Alerts'}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium block">
                          {isFrench ? 'Notification dès que le score ≥ 80%' : 'Instant notification when match score ≥ 80%'}
                        </span>
                      </div>
                    </label>

                    <label className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start space-x-2.5 cursor-pointer hover:border-emerald-300 transition-colors">
                      <input
                        type="checkbox"
                        defaultChecked
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
                        defaultChecked
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                      />
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 block text-xs">
                          {isFrench ? 'Dossier Récapitulatif Email' : 'Email Executive Dossier'}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium block">
                          {isFrench ? 'Synthèse hebdomadaire des marchés' : 'Weekly curated market tender report'}
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Threshold & Frequency Filter */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <label className="font-bold uppercase tracking-wider text-slate-500">
                        {isFrench ? 'Seuil Minimum de Budget pour Déclencher l\'Alerte' : 'Minimum Contract Budget to Trigger Alerts'}
                      </label>
                      <select
                        defaultValue="100000"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold focus:outline-none focus:border-emerald-600 shadow-sm"
                      >
                        <option value="0">{isFrench ? 'Tous les Marchés (Sans seuil minimum)' : 'All Tenders (No minimum threshold)'}</option>
                        <option value="50000">{isFrench ? '50 000$+ (env. 30 000 000 FCFA)' : '$50,000+ (approx 30,000,000 FCFA)'}</option>
                        <option value="100000">{isFrench ? '100 000$+ (env. 60 000 000 FCFA)' : '$100,000+ (approx 60,000,000 FCFA)'}</option>
                        <option value="500000">{isFrench ? '500 000$+ (env. 300 000 000 FCFA)' : '$500,000+ (approx 300,000,000 FCFA)'}</option>
                        <option value="1000000">{isFrench ? '1 000 000$+ (Grands Travaux Uniquement)' : '$1,000,000+ Major Works Only'}</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold uppercase tracking-wider text-slate-500">
                        {isFrench ? 'Périmètre Géographique Ciblé' : 'Target Regional Scope'}
                      </label>
                      <select
                        defaultValue="all"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold focus:outline-none focus:border-emerald-600 shadow-sm"
                      >
                        <option value="all">{isFrench ? 'National & Multilatéral (Cameroun, Nigeria, BAD)' : 'National & Multilateral (Cameroon, Nigeria, AfDB)'}</option>
                        <option value="cameroon">{isFrench ? 'Cameroun Uniquement (ARMP, MINMAP, Douala, Yaoundé)' : 'Cameroon Only (MINMAP, Douala, Yaoundé, FEICOM)'}</option>
                        <option value="cemac">{isFrench ? 'Zone CEMAC (Cameroun, Tchad, Gabon, Congo)' : 'CEMAC Region (Cameroon, Chad, Gabon, Congo)'}</option>
                        <option value="international">{isFrench ? 'Bailleurs Internationaux Uniquement (Banque Mondiale, etc.)' : 'World Bank & Multilateral Development Banks Only'}</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => toast.success(
                        isFrench ? 'Préférences Enregistrées !' : 'Alert Settings Saved!',
                        isFrench ? 'Vos alertes mobiles WhatsApp & SMS ont été mises à jour.' : 'Your WhatsApp & SMS tender alert preferences have been updated.'
                      )}
                      className="px-5 py-2.5 rounded-xl gradient-bg text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 hover:opacity-95 transition-all flex items-center gap-2"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>{isFrench ? 'Enregistrer les Préférences Mobiles' : 'Save Mobile Alert Preferences'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
