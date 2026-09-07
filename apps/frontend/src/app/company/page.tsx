'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { useAuth } from '../../lib/auth-context';
import { useLanguage } from '../../lib/language-context';
import { ApiClient } from '../../lib/api-client';
import { useToast } from '../../lib/toast-context';
import { Building2, Save, Plus, Trash2, ShieldCheck, Globe, Layers, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

const africanCountries = [
  'Nigeria',
  'South Africa',
  'Kenya',
  'Ghana',
  'Egypt',
  'Rwanda',
  'Morocco',
  'Ethiopia',
  'Tanzania',
  'Uganda',
  'Ivory Coast',
  'Cameroon',
  'Senegal',
];

const africanSectors = [
  'Cloud & IT Infrastructure',
  'Healthcare & Healthtech Systems',
  'Telecom & Digital Economy',
  'Civil Infrastructure & Construction',
  'Renewable Energy & Solar Power',
  'Cybersecurity & Public Safety',
  'AgriTech & Supply Chain',
];

export default function CompanyCapabilityPage() {
  const { company, user } = useAuth();
  const { toast } = useToast();
  const { isFrench } = useLanguage();

  const [name, setName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [countries, setCountries] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [teamSize, setTeamSize] = useState<number>(1);
  const [annualRevenue, setAnnualRevenue] = useState('');
  const [description, setDescription] = useState('');

  const [newCert, setNewCert] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newService, setNewService] = useState('');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const comp = company || await ApiClient.getCompanyProfile();
        if (comp) {
          setName(comp.name || '');
          setTaxId(comp.taxId || '');
          setWebsite(comp.website || '');
          setIndustry(comp.industry || 'Cloud & IT Infrastructure');
          setCountries(comp.countries || []);
          setCertifications(comp.certifications || []);
          setServices(comp.services || []);
          setTeamSize(comp.teamSize || 1);
          setAnnualRevenue(comp.annualRevenue || '');
          setDescription(comp.description || '');
        }
      } catch (e) {
        console.warn('Profile fetch error', e);
      }
    };
    loadProfile();
  }, [company]);

  const isProfileComplete = Boolean(
    taxId?.trim() &&
    certifications?.length > 0 &&
    services?.length > 0 &&
    countries?.length > 0 &&
    description?.trim()
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await ApiClient.updateCompanyProfile({
        name,
        taxId,
        website,
        industry,
        countries,
        certifications,
        services,
        teamSize,
        annualRevenue,
        description,
      });
      setSuccessMsg(isFrench ? 'Profil de compétences mis à jour avec succès !' : 'Company capability profile updated successfully!');
      toast.success(isFrench ? 'Profil de compétences enregistré' : 'Capability profile saved');
    } catch (e) {
      console.error(e);
      toast.error(isFrench ? 'Échec de l\'enregistrement' : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const addTag = (type: 'cert' | 'country' | 'service', customVal?: string) => {
    if (type === 'cert') {
      const val = customVal || newCert.trim();
      if (val && !certifications.includes(val)) {
        setCertifications([...certifications, val]);
        setNewCert('');
        toast.info(isFrench ? `Agrément ajouté : ${val}` : `Added Certification: ${val}`);
      }
    }
    if (type === 'country') {
      const val = customVal || newCountry.trim();
      if (val && !countries.includes(val)) {
        setCountries([...countries, val]);
        setNewCountry('');
        toast.info(isFrench ? `Marché ajouté : ${val}` : `Added Market: ${val}`);
      }
    }
    if (type === 'service') {
      const val = customVal || newService.trim();
      if (val && !services.includes(val)) {
        setServices([...services, val]);
        setNewService('');
        toast.info(isFrench ? `Prestation ajoutée : ${val}` : `Added Service: ${val}`);
      }
    }
  };

  const removeTag = (type: 'cert' | 'country' | 'service', index: number) => {
    if (type === 'cert') setCertifications(certifications.filter((_, i) => i !== index));
    if (type === 'country') setCountries(countries.filter((_, i) => i !== index));
    if (type === 'service') setServices(services.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />

      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto min-w-0">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
              <span>{isFrench ? 'Profil Entreprise & Matrice des Compétences' : 'Company Profile & African Market Capability Matrix'}</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {isFrench
                ? 'Gérez vos certifications, marchés d\'intervention et compétences techniques pour calibrer le ciblage IA des appels d\'offres'
                : 'Manage certifications, African operational markets, and technical services to calibrate AI tender matching'}
            </p>
          </div>

          {/* Profile Completeness Callout */}
          {!isProfileComplete ? (
            <div className="p-4 md:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-1.5 shadow-xs">
              <div className="font-extrabold flex items-center gap-2 text-amber-900 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{isFrench ? 'Action Requise : Profil de Compétences Incomplet' : 'Action Required: Company Capability Profile Incomplete'}</span>
              </div>
              <p className="text-amber-800 leading-relaxed font-medium">
                {isFrench ? (
                  <>
                    Les maîtres d'ouvrage exigent des pièces de conformité réglementaire valides. Pour soumissionner, vous devez renseigner votre <strong>Numéro Contribuable / RCCM</strong>, ajouter au moins <strong>1 certification vérifiée</strong>, <strong>1 compétence clé</strong>, vos <strong>pays d'intervention</strong> et une courte <strong>présentation</strong>.
                  </>
                ) : (
                  <>
                    Procurement authorities require valid corporate compliance credentials. To submit or bid on tenders, you must fill your <strong>Tax ID / RCCM</strong>, add at least <strong>1 verified certification</strong>, <strong>1 key service capability</strong>, your <strong>target operating countries</strong>, and a brief <strong>company overview</strong> below.
                  </>
                )}
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isFrench ? 'Profil de Compétences Complet — Synchronisation du Coffre-Fort Active' : 'Company Capability Profile Complete — Bidding & Vault Sync Active'}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Basic Info */}
            <div className="glass-panel rounded-2xl p-4 md:p-6 space-y-4 bg-white border border-slate-200 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{isFrench ? 'Informations Générales de l\'Entreprise' : 'General Organization Profile'}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold uppercase tracking-wider text-slate-500">
                    {isFrench ? 'Nom de l\'Entreprise' : 'Company Name'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isFrench ? 'Ex. Spektralsoft S.A.R.L' : 'Enter company name...'}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-emerald-600 font-medium shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold uppercase tracking-wider text-slate-500">
                    {isFrench ? 'Numéro Contribuable / Registre de Commerce (RCCM)' : 'Tax ID / Trade Registry (RCCM)'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder={isFrench ? 'Ex. RC/DLA/2024/B/1209 ou TIN-9821734' : 'e.g. RC/DLA/2024/B/1209 or TIN-9821734'}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-emerald-600 font-medium shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold uppercase tracking-wider text-slate-500">
                    {isFrench ? 'Secteur d\'Activité Principal' : 'Primary Industry Sector'}
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-emerald-600 font-medium shadow-sm"
                  >
                    {africanSectors.map((sec) => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold uppercase tracking-wider text-slate-500">
                    {isFrench ? 'Site Web Officiel' : 'Official Website URL'}
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://www.yourcompany.com"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-emerald-600 font-medium shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold uppercase tracking-wider text-slate-500">
                    {isFrench ? 'Taille de l\'Équipe (Effectif)' : 'Team Size (FTE)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={teamSize}
                    onChange={(e) => setTeamSize(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-emerald-600 font-medium shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold uppercase tracking-wider text-slate-500">
                    {isFrench ? 'Fourchette de Chiffre d\'Affaires Annuel' : 'Annual Revenue Bracket'}
                  </label>
                  <input
                    type="text"
                    value={annualRevenue}
                    onChange={(e) => setAnnualRevenue(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-emerald-600 font-medium shadow-sm"
                    placeholder={isFrench ? 'Ex. 500M - 2 Mrd FCFA ou 2M$ - 10M$ USD' : 'e.g. $2M - $10M USD'}
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="font-bold uppercase tracking-wider text-slate-500">
                  {isFrench ? 'Présentation de l\'Entreprise & Résumé des Références' : 'Company Overview & Capabilities Summary'}
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={isFrench ? 'Décrivez vos compétences techniques clés et références de marchés similaires...' : 'Describe your primary technical capabilities and African market experience...'}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-emerald-600 font-medium shadow-sm"
                />
              </div>
            </div>

            {/* Geography Manager for African Markets */}
            <div className="glass-panel rounded-2xl p-4 md:p-6 space-y-4 bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-600" />
                  <span>{isFrench ? 'Marchés Cibles & Zones Géographiques d\'Intervention' : 'African Target Markets & Operational Geographies'}</span>
                </h3>
                <span className="text-xs text-sky-600 font-bold bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                  {isFrench ? 'Priorité Afrique' : 'Africa Priority Market'}
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  placeholder={isFrench ? 'Ajouter un pays (ex. Cameroun, Côte d\'Ivoire, Sénégal)...' : 'Add African or global country (e.g. Nigeria, Kenya, Rwanda)...'}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => addTag('country')}
                  className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-700 flex items-center gap-1 shadow-sm shrink-0"
                >
                  <Plus className="w-4 h-4" /> {isFrench ? 'Ajouter' : 'Add'}
                </button>
              </div>

              {/* Quick Add African Countries */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {isFrench ? 'Sélection Rapide de Marchés :' : 'Quick Select African Markets:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {africanCountries.map((ac) => (
                    <button
                      key={ac}
                      type="button"
                      onClick={() => addTag('country', ac)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        countries.includes(ac)
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      + {ac}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                {countries.length === 0 ? (
                  <span className="text-xs text-slate-400 font-medium italic">
                    {isFrench ? 'Aucun pays d\'intervention renseigné' : 'No operational countries added yet'}
                  </span>
                ) : (
                  countries.map((c, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold shadow-sm"
                    >
                      <span>🌍 {c}</span>
                      <button type="button" onClick={() => removeTag('country', idx)}>
                        <Trash2 className="w-3.5 h-3.5 text-rose-600 hover:text-rose-700" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Certifications Manager */}
            <div className="glass-panel rounded-2xl p-4 md:p-6 space-y-4 bg-white border border-slate-200 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isFrench ? 'Certifications & Agréments Réglementaires' : 'Certifications & Compliance Accreditations'}</span>
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCert}
                  onChange={(e) => setNewCert(e.target.value)}
                  placeholder={isFrench ? 'Ajouter agrément (ex. ISO 9001, Agrément Ministériel, Ordre des Ingénieurs)...' : 'Add certification (e.g. ISO 27001, NITDA, Public Procurement Authority)...'}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => addTag('cert')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 flex items-center gap-1 shadow-sm shrink-0"
                >
                  <Plus className="w-4 h-4" /> {isFrench ? 'Ajouter' : 'Add'}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {certifications.length === 0 ? (
                  <span className="text-xs text-slate-400 font-medium italic">
                    {isFrench ? 'Aucune certification ajoutée' : 'No certifications added yet'}
                  </span>
                ) : (
                  certifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm"
                    >
                      <span>{cert}</span>
                      <button type="button" onClick={() => removeTag('cert', idx)}>
                        <Trash2 className="w-3.5 h-3.5 text-rose-600 hover:text-rose-700" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Core Services Manager */}
            <div className="glass-panel rounded-2xl p-4 md:p-6 space-y-4 bg-white border border-slate-200 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>{isFrench ? 'Prestations & Compétences Clés' : 'Core Technical Services & Capabilities'}</span>
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder={isFrench ? 'Ajouter prestation (ex. BTP, Infrastructure Réseau, Énergie Solaire)...' : 'Add service (e.g. Enterprise Cloud, Digital Payments, Healthtech)...'}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => addTag('service')}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 flex items-center gap-1 shadow-sm shrink-0"
                >
                  <Plus className="w-4 h-4" /> {isFrench ? 'Ajouter' : 'Add'}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {services.length === 0 ? (
                  <span className="text-xs text-slate-400 font-medium italic">
                    {isFrench ? 'Aucune prestation ajoutée' : 'No services added yet'}
                  </span>
                ) : (
                  services.map((s, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm"
                    >
                      <span>{s}</span>
                      <button type="button" onClick={() => removeTag('service', idx)}>
                        <Trash2 className="w-3.5 h-3.5 text-rose-600 hover:text-rose-700" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Regulatory Compliance & Authenticity Affirmation */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex items-center space-x-2 font-black text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isFrench ? 'Déclaration sur l\'Honneur de Sincérité & Conformité Réglementaire' : 'Statutory Compliance & Truthfulness Affirmation'}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                {isFrench ? (
                  <>
                    En enregistrant ce profil de compétences, vous certifiez sur l'honneur être le représentant habilité de <strong>{name || company?.name || 'votre entreprise'}</strong> et que tous les numéros d'immatriculation, agréments et capacités déclarés sont authentiques, en cours de validité et conformes au Code des Marchés Publics et à nos{' '}
                    <Link href="/terms" target="_blank" className="text-emerald-700 font-bold hover:underline">
                      Conditions Générales d'Utilisation
                    </Link>.
                  </>
                ) : (
                  <>
                    By saving this capability profile, you certify that you are an authorized representative of <strong>{name || company?.name || 'your company'}</strong> and that all stated registration numbers, capabilities, and country authorizations are authentic, unexpired, and in full compliance with national Public Procurement Acts and our{' '}
                    <Link href="/terms" target="_blank" className="text-emerald-700 font-bold hover:underline">
                      Terms of Service &amp; Procurement Disclaimers
                    </Link>.
                  </>
                )}
              </p>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-2xl gradient-bg text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 hover:opacity-95 transition-all flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>
                {saving
                  ? (isFrench ? 'Enregistrement en cours...' : 'Saving Changes...')
                  : (isFrench ? 'Enregistrer le Profil de Compétences' : 'Save Capability Profile')}
              </span>
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
