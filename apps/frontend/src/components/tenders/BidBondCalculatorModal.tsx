'use client';

import React, { useState } from 'react';
import { Tender } from '../../types';
import { useToast } from '../../lib/toast-context';
import { useLanguage } from '../../lib/language-context';
import {
  Calculator,
  X,
  Building2,
  ShieldCheck,
  Download,
  Coins,
  Info,
} from 'lucide-react';

interface Props {
  tender: Tender;
  isOpen: boolean;
  onClose: () => void;
  companyName?: string;
}

export const BidBondCalculatorModal: React.FC<Props> = ({
  tender,
  isOpen,
  onClose,
  companyName = 'Your Enterprise',
}) => {
  const { toast } = useToast();
  const { isFrench } = useLanguage();

  // Exchange rate approximation if currency is USD vs XAF/NGN/KES
  const initialCurrency = tender.currency || 'USD';
  const [currency, setCurrency] = useState<string>(initialCurrency);
  const [contractValue, setContractValue] = useState<number>(tender.estimatedValue || 500000);
  const [bondPercentage, setBondPercentage] = useState<number>(2.0); // Standard 2%
  const [bankCommissionRate, setBankCommissionRate] = useState<number>(0.75); // Standard 0.75% per quarter
  const [validityDays, setValidityDays] = useState<number>(120); // Standard 90-120 days

  if (!isOpen) return null;

  // Financial calculations
  const bidBondAmount = Math.round((contractValue * bondPercentage) / 100);
  const estimatedBankFee = Math.round((bidBondAmount * bankCommissionRate) / 100);
  const performanceBondAmount = Math.round((contractValue * 5.0) / 100); // 5% standard
  const advancePaymentBond = Math.round((contractValue * 20.0) / 100); // 20% advance payment mobilization

  const formatMoney = (val: number, cur: string) => {
    return `${cur} ${val.toLocaleString()}`;
  };

  const downloadBankLetter = () => {
    const letterContent = isFrench
      ? `================================================================================
DEMANDE FORMELLE DE CAUTIONNEMENT PROVISOIRE DE SOUMISSION
(CODE DES MARCHÉS PUBLICS)
================================================================================
Date : ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}

À l'attention de : Monsieur le Directeur d'Agence / Comité des Engagements
Établissement Financier : [Nom de Votre Banque Commerciale / Compagnie d'Assurance]
Agence : [Ville / Agence Principale]

OBJET : DEMANDE D'ÉMISSION D'UNE CAUTION DE SOUMISSION
        Référence Appel d'Offres : ${tender.refNumber}
        Projet : ${tender.title}
        Maître d'Ouvrage / Autorité Contractante : ${tender.buyerName} (${tender.buyerCountry})

Monsieur le Directeur,

Conformément aux stipulations du Code des Marchés Publics et du Dossier d'Appel d'Offres (DAO) relatif au marché susmentionné, notre entreprise ${companyName} prépare le dépôt d'une offre régulière et conforme.

À titre de pièce éliminatoire dans le Pli 1 (Dossier Administratif), le Règlement de Consultation exige la constitution d'un cautionnement provisoire bancaire autonome, irrévocable et à première demande :

1. SOUMISSIONNAIRE :
   - Raison Sociale : ${companyName}
   - Numéro de Compte : [Numéro de compte dans vos livres]
   - Représentant Légal : Direction Générale

2. BÉNÉFICIAIRE :
   - Autorité Contractante : ${tender.buyerName}
   - Référence : ${tender.refNumber}
   - Pays : ${tender.buyerCountry}

3. SPÉCIFICATIONS FINANCIÈRES :
   - Montant Estimatif du Marché : ${formatMoney(contractValue, currency)}
   - Taux de Caution Provisoire : ${bondPercentage}%
   - MONTANT EXACT DE LA CAUTION : ${formatMoney(bidBondAmount, currency)}
   - Durée de Validité Requise : ${validityDays} jours calendaires à compter de la date limite de dépôt

Nous vous prions de bien vouloir émettre cette attestation sous trois (3) jours ouvrés pour insertion dans le Pli Administratif.

Veuillez agréer, Monsieur le Directeur, l'expression de nos salutations distinguées.

____________________________________________
Direction Générale
${companyName}
Cachet & Signature
================================================================================`
      : `================================================================================
FORMAL BANK GUARANTEE APPLICATION LETTER
(DEMANDE DE CAUTIONNEMENT PROVISOIRE DE SOUMISSION)
================================================================================
Date: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}

To: The Branch Manager / Credit Risk Committee
Bank / Financial Institution: [Insert Your Commercial Bank / Insurance Name]
Branch: [City / Main Commercial Branch]

RE: REQUEST FOR ISSUANCE OF TENDER BID BOND (CAUTION PROVISOIRE)
    Tender Reference: ${tender.refNumber}
    Project Title: ${tender.title}
    Contracting Authority: ${tender.buyerName} (${tender.buyerCountry})

Dear Sir/Madam,

In accordance with the Public Procurement Code and standard Bidding Documents (DAO), our company ${companyName} intends to submit a formal bid for the above tender.

As a mandatory qualification condition, the Contracting Authority requires an irrevocable Bank Bid Bond in Envelope 1:

1. APPLICANT: ${companyName}
2. BENEFICIARY: ${tender.buyerName} (Ref: ${tender.refNumber})
3. FINANCIAL SPECIFICATIONS:
   - Estimated Contract Value: ${formatMoney(contractValue, currency)}
   - Bid Bond Rate: ${bondPercentage}%
   - EXACT BID BOND AMOUNT REQUIRED: ${formatMoney(bidBondAmount, currency)}
   - Validity: ${validityDays} Calendar Days

Yours faithfully,

____________________________________________
Authorized Signatory & Chief Executive Officer
${companyName}
================================================================================`;

    const blob = new Blob([letterContent.trim()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Demande_Caution_${tender.refNumber.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(
      isFrench ? 'Lettre de Demande Téléchargée' : 'Application Letter Downloaded',
      isFrench ? 'Déposez-la auprès de votre gestionnaire bancaire.' : 'Take this to your bank branch.'
    );
  };

  const getRecognizedInstitutions = (countryName: string) => {
    if (/cameroon/i.test(countryName)) {
      return [
        { name: 'Afriland First Bank', type: 'Banque Catégorie 1' },
        { name: 'Société Générale Cameroun', type: 'Banque Internationale' },
        { name: 'Ecobank Cameroun', type: 'Banque Panafricaine' },
        { name: 'UBA Cameroon', type: 'Banque Commerciale' },
        { name: 'BICEC / Groupe BCP', type: 'Banque Commerciale' },
        { name: 'SCB Cameroun (Attijariwafa)', type: 'Banque Commerciale' },
        { name: 'Activa Assurances / Chanas', type: 'Compagnie Agréée' },
      ];
    } else if (/nigeria/i.test(countryName)) {
      return [
        { name: 'Zenith Bank Plc', type: 'Tier-1 Bank' },
        { name: 'Access Bank', type: 'Tier-1 Bank' },
        { name: 'Guaranty Trust Bank (GTBank)', type: 'Tier-1 Bank' },
        { name: 'First Bank of Nigeria', type: 'Tier-1 Bank' },
        { name: 'United Bank for Africa (UBA)', type: 'Tier-1 Bank' },
        { name: 'Stanbic IBTC Bank', type: 'Commercial Bank' },
      ];
    } else if (/kenya/i.test(countryName)) {
      return [
        { name: 'KCB Bank Kenya', type: 'Tier-1 Bank' },
        { name: 'Equity Bank Kenya', type: 'Tier-1 Bank' },
        { name: 'NCBA Group', type: 'Tier-1 Bank' },
        { name: 'Standard Chartered Kenya', type: 'International Bank' },
        { name: 'Co-operative Bank of Kenya', type: 'Commercial Bank' },
        { name: 'CIC Insurance Group', type: 'Approved Underwriter' },
      ];
    } else {
      return [
        { name: 'Standard Chartered Bank', type: isFrench ? 'Banque Internationale' : 'International' },
        { name: 'Citibank N.A.', type: isFrench ? 'Banque Internationale' : 'Global Corporate' },
        { name: 'Ecobank Group', type: isFrench ? 'Banque Panafricaine' : 'Pan-African' },
        { name: 'Société Générale', type: isFrench ? 'Banque Agréée' : 'International' },
        { name: 'Banque Ouest Africaine (BOAD)', type: isFrench ? 'Institution Multilatérale' : 'Multilateral Approved' },
      ];
    }
  };

  const institutions = getRecognizedInstitutions(tender.buyerCountry || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/60">
                {isFrench ? 'Suite Financière Réglementaire Bidora' : 'Bidora Financial Advisory Suite'}
              </span>
              <h2 className="text-xl font-black tracking-tight text-white mt-1">
                {isFrench ? 'Calculateur de Cautionnement & Garanties Bancaires' : 'Bid Bond & Bank Guarantee Calculator'}
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
            {isFrench
              ? 'Le Code des Marchés Publics impose une caution bancaire autonome (Caution de Soumission) dans le Pli 1. Calculez vos lignes bancaires, commissions et générez la lettre formelle de demande de caution.'
              : 'Public procurement rules require an unconditional Bank Bid Bond (Caution de Soumission) in Envelope 1. Calculate your exact bank line requirements, processing fees, and generate an official Bank Request Letter.'}
          </p>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Target Tender Context */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <p className="font-bold text-slate-900 line-clamp-1">{tender.title}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Ref: <span className="font-mono font-bold text-slate-700">{tender.refNumber}</span> • {isFrench ? 'Maître d\'Ouvrage' : 'Contracting Authority'}: <span className="font-semibold text-slate-800">{tender.buyerName}</span>
              </p>
            </div>
            <span className="shrink-0 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[10px]">
              {tender.buyerCountry}
            </span>
          </div>

          {/* Calculator Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>{isFrench ? 'Montant Estimatif du Marché / Offre' : 'Contract / Bid Value'}</span>
                <span className="text-[10px] text-slate-400 font-normal">{isFrench ? 'Montant de base' : 'Base proposal amount'}</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={contractValue}
                  onChange={(e) => setContractValue(Number(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-3.5 pr-16 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 shadow-xs"
                />
                <div className="absolute right-2 top-2">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="text-xs font-bold bg-slate-100 text-slate-700 rounded-lg px-2 py-1 border border-slate-200 focus:outline-none"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="XAF">XAF (FCFA)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="NGN">NGN (₦)</option>
                    <option value="KES">KES (KSh)</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>{isFrench ? 'Taux de Caution Provisoire' : 'Provisional Bid Bond Rate'}</span>
                <span className="text-[10px] text-emerald-600 font-semibold">{bondPercentage}% standard</span>
              </label>
              <select
                value={bondPercentage}
                onChange={(e) => setBondPercentage(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 shadow-xs"
              >
                <option value={1.0}>{isFrench ? '1.0% (Petits travaux / fournitures courantes)' : '1.0% (Minor civil works / standard supplies)'}</option>
                <option value={1.5}>{isFrench ? '1.5% (Appel d\'offres national standard)' : '1.5% (National competitive bidding)'}</option>
                <option value={2.0}>{isFrench ? '2.0% (Standard ARMP / Banque Mondiale)' : '2.0% (MINMAP / World Bank Standard Default)'}</option>
                <option value={2.5}>{isFrench ? '2.5% (Infrastructures lourdes & grands projets)' : '2.5% (High-value infrastructure & complex IT)'}</option>
                <option value={3.0}>{isFrench ? '3.0% (Contrats spécialisés défense & sécurité)' : '3.0% (Specialized security & defense contracts)'}</option>
              </select>
            </div>
          </div>

          {/* Key Calculation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Primary Bid Bond Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md relative overflow-hidden">
              <div className="absolute -right-3 -bottom-3 opacity-15">
                <ShieldCheck className="w-24 h-24" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">
                {isFrench ? 'Caution de Soumission Requise (Pli 1)' : 'Required Bid Bond (Caution de Soumission)'}
              </p>
              <h3 className="text-2xl font-black mt-1">
                {formatMoney(bidBondAmount, currency)}
              </h3>
              <p className="text-[11px] text-emerald-100/90 mt-1">
                {isFrench ? 'À insérer sous forme originale de caution bancaire dans le Pli 1' : 'Must be submitted as original bank guarantee in Envelope 1'}
              </p>
              <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-[10px] font-semibold text-emerald-100">
                <span>{isFrench ? `Validité : ${validityDays} Jours` : `Validity: ${validityDays} Days`}</span>
                <span>{isFrench ? `Taux : ${bondPercentage}% de l'offre` : `Rate: ${bondPercentage}% of total bid`}</span>
              </div>
            </div>

            {/* Estimated Bank Fee Card */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-md relative overflow-hidden">
              <div className="absolute -right-3 -bottom-3 opacity-15">
                <Coins className="w-24 h-24" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                {isFrench ? 'Commission Bancaire Estimée' : 'Estimated Bank Commission'}
              </p>
              <h3 className="text-2xl font-black mt-1 text-emerald-400">
                {formatMoney(estimatedBankFee, currency)}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                {isFrench ? 'Frais trimestriels bancaires moyens (environ 0,75%)' : 'Approximate quarterly underwriting fee (0.75% avg.)'}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-semibold text-slate-300">
                <span>{isFrench ? 'Délai d\'émission : 48 à 72h' : 'Standard Processing Time: 48-72h'}</span>
                <span>{isFrench ? 'Ligne bancaire active requise' : 'Requires active bank line'}</span>
              </div>
            </div>
          </div>

          {/* Lifecycle Guarantees (Post-Award Phase) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>{isFrench ? 'Garanties Post-Attribution en Cas de Succès' : 'Subsequent Guarantees If Contract Is Awarded'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">
                  {isFrench ? 'Caution de Bonne Fin d\'Exécution' : 'Performance Bond (Bonne Exécution)'}
                </span>
                <p className="text-base font-black text-slate-900 mt-0.5">{formatMoney(performanceBondAmount, currency)}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {isFrench ? '5,0% exigible à la notification de l\'adjudication' : '5.0% payable upon formal contract signing'}
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">
                  {isFrench ? 'Caution de Restitution d\'Avance' : 'Advance Mobilization Bond (Avance Démarrage)'}
                </span>
                <p className="text-base font-black text-slate-900 mt-0.5">{formatMoney(advancePaymentBond, currency)}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {isFrench ? '20,0% débloquant le versement direct de l\'avance de démarrage' : '20.0% unlocks immediate cash disbursement from Contracting Authority'}
                </p>
              </div>
            </div>
          </div>

          {/* Recognized Financial Institutions */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isFrench ? `Établissements Financiers Agréés (${tender.buyerCountry || 'Région'})` : `Approved Guarantee Institutions in ${tender.buyerCountry || 'Region'}`}</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-semibold">
                {isFrench ? 'Reconnus par l\'Autorité des Marchés Publics' : 'Recognized by Public Procurement Authorities'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {institutions.map((inst, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                  <p className="text-xs font-bold text-slate-900 truncate">{inst.name}</p>
                  <p className="text-[10px] text-slate-500">{inst.type}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button: Download Bank Letter */}
          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              <span className="font-semibold text-slate-700">
                {isFrench ? 'Besoin de cette garantie rapidement ?' : 'Need this guarantee immediately?'}
              </span>{' '}
              {isFrench ? 'Téléchargez la lettre formelle pré-remplie et soumettez-la à votre banque dès aujourd\'hui.' : 'Download a pre-formatted letter and submit to your bank account officer today.'}
            </div>

            <button
              onClick={downloadBankLetter}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>{isFrench ? 'Télécharger la Demande de Caution Bancaire' : 'Export Bank Application Letter'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
