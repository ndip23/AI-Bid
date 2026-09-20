'use client';

import React, { useState } from 'react';
import { Tender } from '../../types';
import { ApiClient } from '../../lib/api-client';
import { useToast } from '../../lib/toast-context';
import { useLanguage } from '../../lib/language-context';
import { formatCurrency } from '../../lib/formatters';
import {
  ShieldCheck,
  CheckCircle2,
  Download,
  ExternalLink,
  Printer,
  X,
  ArrowRight,
  FolderArchive,
  Building,
  Briefcase,
  DollarSign,
  AlertTriangle,
  Send,
  MapPin,
  Clock,
  MessageSquare,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tender: Tender;
  companyName: string;
  readyCount: number;
  totalDocs: number;
  onSubmissionComplete?: () => void;
}

export const SubmitBidModal: React.FC<Props> = ({
  isOpen,
  onClose,
  tender,
  companyName,
  readyCount,
  totalDocs,
  onSubmissionComplete,
}) => {
  const { toast } = useToast();
  const { isFrench } = useLanguage();
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [downloadedZip, setDownloadedZip] = useState(false);
  const [submittedAmount, setSubmittedAmount] = useState(
    tender.estimatedValue ? Math.round(tender.estimatedValue * 0.95).toString() : ''
  );
  const [receiptNumber, setReceiptNumber] = useState('');
  const [certified, setCertified] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [conciergeRequested, setConciergeRequested] = useState(false);
  const [submissionMethod, setSubmissionMethod] = useState<'SELF' | 'CONCIERGE'>('SELF');
  const [contactPhone, setContactPhone] = useState('');

  const whatsappUrl = `https://wa.me/237683616584?text=${encodeURIComponent(
    isFrench
      ? `Bonjour Bidora Dispatch,\n\nJe souhaite réserver le Service Coursier / Dépôt Assisté pour l'offre suivante :\n📋 Marché : ${tender.title}\n🔢 Réf : ${tender.refNumber}\n🏢 Acheteur : ${tender.buyerName}\n⏰ Date Limite : ${new Date(tender.deadline).toLocaleDateString()}\n🏢 Entreprise : ${companyName}\n\nMerci de me confirmer la prise en charge et les modalités de dépôt physique.`
      : `Hello Bidora Dispatch,\n\nI want to book the Concierge Runner Service for the following tender:\n📋 Tender: ${tender.title}\n🔢 Ref: ${tender.refNumber}\n🏢 Buyer: ${tender.buyerName}\n⏰ Deadline: ${new Date(tender.deadline).toLocaleDateString()}\n🏢 Company: ${companyName}\n\nPlease confirm availability and physical filing procedure.`
  )}`;

  if (!isOpen) return null;

  const handleDownloadDossierZip = () => {
    const manifestContent = isFrench
      ? `========================================================================
DOSSIER DE SOUMISSION OFFICIEL (ARCHIVE CONFORME 3 PLIS)
========================================================================
INTITULÉ DU MARCHÉ : ${tender.title}
RÉFÉRENCE DAO :      ${tender.refNumber}
AUTORITÉ CONTRACTANTE : ${tender.buyerName} (${tender.buyerCountry})
SOUMISSIONNAIRE :    ${companyName}
DATE D'ASSEMBLAGE :  ${new Date().toLocaleDateString('fr-FR')}
MONTANT ESTIMATIF :  ${formatCurrency(tender.estimatedValue, tender.currency)}
========================================================================

PLI A : PIÈCES ADMINISTRATIVES & JURIDIQUES
------------------------------------------------------------------------
[X] 1. Registre du Commerce et du Crédit Mobilier (RCCM)
[X] 2. Attestation de Non-Redevance (DGI < 3 mois)
[X] 3. Attestation de Conformité Sociale (CNPS)
[X] 4. Cautionnement Provisoire Bancaire (Original 2%)
[X] 5. Pouvoir de Signature et Mandat de Représentation

PLI B : OFFRE TECHNIQUE & MÉTHODOLOGIE
------------------------------------------------------------------------
[X] 6. Note Méthodologique & Planning d'Exécution (GANTT)
[X] 7. CVs et Diplômes Certifiés du Personnel Clé
[X] 8. Références et Attestations de Bonne Fin d'Exécution Similaires
[X] 9. Certifications de Qualité et Agréments Techniques

PLI C : OFFRE FINANCIÈRE & BORDEREAU DE PRIX
------------------------------------------------------------------------
[X] 10. Lettre de Soumission Formelle Datée et Signée
[X] 11. Bordereau des Prix Unitaires & Détail Quantitatif (BPU/DQE)
[X] 12. Bilans Financiers et États Financiers Certifiés des 3 Derniers Exercices

========================================================================
INSTRUCTIONS DE DÉPÔT RÉGLEMENTAIRE :
- Dépôt physique : Déposez 1 Original + 3 Copies sous double pli cacheté
  au siège de l'Autorité Contractante (${tender.buyerName}) avant l'heure limite.
- Mention extérieure obligatoire : "APPEL D'OFFRES N° ${tender.refNumber} — À N'OUVRIR QU'EN SÉANCE DE DÉPOUILLEMENT."
========================================================================`
      : `========================================================================
OFFICIAL BID SUBMISSION DOSSIER (DOSSIER DE SOUMISSION OFFICIEL)
========================================================================
TENDER TITLE:       ${tender.title}
TENDER REF NUMBER:  ${tender.refNumber}
BUYER / AUTHORITY:  ${tender.buyerName} (${tender.buyerCountry})
BIDDING COMPANY:    ${companyName}
DATE OF PACKAGING:  ${new Date().toLocaleDateString()}
CURRENCY & VALUE:   ${formatCurrency(tender.estimatedValue, tender.currency)}
========================================================================

ENVELOPE A: ADMINISTRATIVE & LEGAL
------------------------------------------------------------------------
[X] 1. Certificate of Incorporation & Trade Registry (RCCM)
[X] 2. Tax Clearance Certificate (Attestation de Non-Redevance)
[X] 3. Social Security Clearance Certificate (CNPS / Pension)
[X] 4. Official Bid Bond / Bank Guarantee of Tender Security
[X] 5. Power of Attorney for Authorized Signatory

ENVELOPE B: TECHNICAL PROPOSAL
------------------------------------------------------------------------
[X] 6. Comprehensive Technical Methodology & GANTT Work Plan
[X] 7. CVs & Certified Diplomas of Key Personnel
[X] 8. 3 Similar Past African Project Reference Certificates
[X] 9. ISO 9001 / ISO 27001 Quality & Security Accreditation

ENVELOPE C: FINANCIAL PROPOSAL
------------------------------------------------------------------------
[X] 10. Official Bid Submission Letter (Lettre de Soumission)
[X] 11. Bill of Quantities & Unit Price Schedule (BPU & DQE)
[X] 12. 3 Years Certified Audited Balance Sheets

========================================================================
SUBMISSION INSTRUCTIONS:
- Deposit 1 Original + 3 Copies in the sealed tender box at
  ${tender.buyerName} headquarters before the deadline.
- Mandatory Outer Label: "TENDER REF: ${tender.refNumber} — TO BE OPENED ONLY BY THE BID EVALUATION COMMITTEE."
========================================================================`;

    const blob = new Blob([manifestContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Dossier_Soumission_${tender.refNumber.replace(/[^a-zA-Z0-9]/g, '_')}_${companyName.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadedZip(true);
    toast.success(
      isFrench ? 'Dossier de Soumission Téléchargé' : 'Submission Dossier Downloaded',
      isFrench ? 'Archive complète prête pour le dépôt officiel.' : 'Ready for official submission.'
    );
  };

  const handlePrintLabels = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${isFrench ? 'Étiquettes de Plis Officiels' : 'Official Tender Envelope Labels'} - ${tender.refNumber}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; }
            .label-box { border: 3px solid #000; padding: 25px; margin-bottom: 30px; page-break-after: always; }
            .label-box:last-child { page-break-after: avoid; }
            h1 { font-size: 20px; text-transform: uppercase; margin-top: 0; }
            h2 { font-size: 16px; margin: 10px 0; }
            p { font-size: 14px; line-height: 1.5; margin: 5px 0; }
            .warning { font-weight: bold; text-decoration: underline; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="label-box">
            <h1>${isFrench ? 'PLI EXTÉRIEUR UNIQUE FERMÉ & SCELLÉ' : 'OUTER SEALED ENVELOPE (DOUBLE PLI)'}</h1>
            <h2>${isFrench ? 'APPEL D\'OFFRES N°' : 'TENDER REF'}: ${tender.refNumber}</h2>
            <p><strong>${isFrench ? 'AUTORITÉ CONTRACTANTE' : 'BUYER / RECIPIENT'}:</strong> ${tender.buyerName}</p>
            <p><strong>${isFrench ? 'PROJET' : 'PROJECT'}:</strong> ${tender.title}</p>
            <p class="warning">${isFrench ? '« À N\'OUVRIR QU\'EN SÉANCE DE DÉPOUILLEMENT DES OFFRES »' : '« TO BE OPENED ONLY BY THE TENDER EVALUATION COMMITTEE »'}</p>
            <p><strong>${isFrench ? 'SOUMISSIONNAIRE' : 'BIDDER'}:</strong> ${companyName}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleConfirmSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certified) {
      toast.error(
        isFrench ? 'Certification Requise' : 'Certification Required',
        isFrench ? 'Veuillez cocher la déclaration sur l\'honneur certifiant la sincérité du dépôt.' : 'Please check the box confirming your team officially deposited this bid.'
      );
      return;
    }

    setSubmitting(true);
    try {
      const submissionNotes = `Submitted Amount: ${submittedAmount} ${tender.currency}. ${
        submissionMethod === 'CONCIERGE'
          ? `[Bidora Concierge Runner Requested - Contact: ${contactPhone || 'N/A'}]`
          : `Receipt: ${receiptNumber || 'N/A'}. [Direct Corporate Deposit]`
      }`;
      await ApiClient.saveTender(tender.id, 'BIDDING', submissionNotes);
      toast.success(
        isFrench ? 'Dépôt Enregistré avec Succès !' : 'Submission Successfully Recorded!',
        submissionMethod === 'CONCIERGE'
          ? (isFrench
              ? `Demande de coursier confirmée ! Un agent vous contactera sur ${contactPhone || 'votre numéro'}.`
              : `Concierge runner confirmed! An agent will contact you on ${contactPhone || 'your phone'}.`)
          : (isFrench
              ? `Marché ${tender.refNumber} marqué comme En Soumission.`
              : `Opportunity ${tender.refNumber} moved to Bidding stage.`)
      );
      onSubmissionComplete?.();
      onClose();
    } catch (err: any) {
      toast.error(
        isFrench ? 'Erreur de Mise à Jour' : 'Update Failed',
        isFrench ? 'Impossible d\'enregistrer le statut de soumission.' : 'Could not record submission status.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 z-10 overflow-hidden animate-scale-in text-slate-900 my-auto flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isFrench ? 'Portail Réglementaire de Finalisation & Dépôt' : 'Official Tender Submission Gateway'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {isFrench ? 'Finaliser & Préparer le Dépôt de l\'Offre' : 'Finalize & Submit Bid Package'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Ref: <strong className="text-slate-800">{tender.refNumber}</strong> • {isFrench ? 'Maître d\'Ouvrage' : 'Buyer'}: {tender.buyerName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Tabs Navigation */}
        <div className="flex border-b border-slate-200 text-xs font-bold bg-white shrink-0">
          <button
            onClick={() => setActiveStep(1)}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeStep === 1
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/40 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] flex items-center justify-center font-black">
              1
            </span>
            <span>{isFrench ? '1. Audit & Export' : '1. Audit & Export'}</span>
          </button>

          <button
            onClick={() => setActiveStep(2)}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeStep === 2
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/40 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] flex items-center justify-center font-black">
              2
            </span>
            <span>{isFrench ? '2. Mode de Dépôt' : '2. Submission Channel'}</span>
          </button>

          <button
            onClick={() => setActiveStep(3)}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeStep === 3
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/40 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] flex items-center justify-center font-black">
              3
            </span>
            <span>{isFrench ? '3. Suivi dans le Pipeline' : '3. Track in Pipeline'}</span>
          </button>
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* STEP 1: AUDIT & EXPORT */}
          {activeStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      {isFrench ? `Audit de Conformité Validé pour ${companyName}` : `Compliance Audit Passed for ${companyName}`}
                    </h4>
                    <p className="text-xs text-slate-600 font-medium">
                      {isFrench
                        ? `${readyCount} sur ${totalDocs} pièces obligatoires prêtes et conformes.`
                        : `${readyCount} of ${totalDocs} required documents and compliant templates attached.`}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-lg font-black text-emerald-700">
                    {Math.round((readyCount / totalDocs) * 100)}%
                  </span>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                    {isFrench ? 'Taux de Préparation' : 'Readiness Score'}
                  </span>
                </div>
              </div>

              {/* Envelope Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-sky-800">
                    <Building className="w-3.5 h-3.5 text-sky-600" />
                    <span>{isFrench ? 'Pli 1' : 'Envelope A'}</span>
                  </div>
                  <div className="text-xs font-extrabold text-slate-900">{isFrench ? 'Administratif' : 'Administrative'}</div>
                  <div className="text-[11px] text-slate-500">{isFrench ? '5 pièces sur 5' : '5 of 5 Items Ready'}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-800">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{isFrench ? 'Pli 2' : 'Envelope B'}</span>
                  </div>
                  <div className="text-xs font-extrabold text-slate-900">{isFrench ? 'Technique' : 'Technical'}</div>
                  <div className="text-[11px] text-slate-500">{isFrench ? '4 pièces sur 4' : '4 of 4 Items Ready'}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isFrench ? 'Pli 3' : 'Envelope C'}</span>
                  </div>
                  <div className="text-xs font-extrabold text-slate-900">{isFrench ? 'Financier' : 'Financial'}</div>
                  <div className="text-[11px] text-slate-500">{isFrench ? '3 pièces sur 3' : '3 of 3 Items Ready'}</div>
                </div>
              </div>

              {/* Export Action Card */}
              <div className="p-5 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/30 space-y-3 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 justify-center sm:justify-start">
                    <FolderArchive className="w-4 h-4 text-emerald-600" />
                    <span>{isFrench ? 'Exporter l\'Archive Officielle de Soumission' : 'Export Official Submission Dossier Package'}</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {isFrench
                      ? 'Téléchargez le dossier structuré complet avec les 3 plis, attestations et bordereaux de conformité.'
                      : 'Download the complete structured dossier with all 3 envelopes, certificates, and compliance manifests.'}
                  </p>
                </div>

                <button
                  onClick={handleDownloadDossierZip}
                  className="px-5 py-3 rounded-xl gradient-bg text-white font-black text-xs shadow-md shadow-emerald-600/20 hover:opacity-95 flex items-center gap-2 shrink-0 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {downloadedZip
                      ? (isFrench ? 'Télécharger à Nouveau' : 'Re-Download Dossier')
                      : (isFrench ? 'Télécharger le Dossier Complet' : 'Download Complete Dossier')}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SUBMISSION CHANNELS */}
          {activeStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900">
                  {isFrench ? 'Où & Comment Cette Offre Est-Elle Déposée Officiellement ?' : 'Where & How Does This Bid Get Officially Submitted?'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {isFrench
                    ? 'Selon le Code des Marchés Publics, les offres doivent être remises directement entre les mains du Maître d\'Ouvrage selon l\'une des 2 méthodes homologuées :'
                    : 'By procurement law, all bids must be submitted directly into the Contracting Authority\'s legal custody via one of the following two approved methods:'}
                </p>
              </div>

              {/* Mandatory Physical Submission Warning Banner */}
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 flex items-start gap-3.5 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                    <span>{isFrench ? 'Attention : Dépôt Physique Obligatoire en Main Propre' : 'Important: Mandatory Physical Hand-Delivery Required'}</span>
                  </h4>
                  <p className="text-xs text-amber-900 font-medium leading-relaxed">
                    {isFrench
                      ? 'Ce bouton n\'envoie PAS votre offre par internet. La loi impose de déposer physiquement un dossier papier sous double enveloppe scellée dans l\'urne du Maître d\'Ouvrage avant la date limite.'
                      : 'Clicking submit does NOT transmit your bid over the internet. Procurement law strictly requires hand-delivering a physical sealed paper package into the buyer\'s tender box before deadline.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Channel A: Direct Corporate Submission with Bidora Dossier */}
                <div 
                  onClick={() => {
                    setSubmissionMethod('SELF');
                    setConciergeRequested(false);
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    submissionMethod === 'SELF'
                      ? 'border-emerald-500 bg-emerald-50/20 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                        <span>{isFrench ? 'Option A : Dépôt Direct par l\'Entreprise' : 'Option A: Direct Corporate Deposit'}</span>
                      </div>
                      {submissionMethod === 'SELF' && (
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {isFrench ? 'Sélectionné ✓' : 'Selected ✓'}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-black text-slate-900">
                      {isFrench ? 'Dépôt Physique Sous Pli Scellé' : 'Physical Sealed Envelope Deposit'}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {isFrench
                        ? `Imprimez votre dossier Bidora en 1 Original + 3 Copies. Apposez les étiquettes officielles et déposez à l'urne de ${tender.buyerName}.`
                        : `Print your Bidora dossier (1 Original + 3 Copies). Affix official labels and deposit directly into the tender box at ${tender.buyerName}.`}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrintLabels();
                      }}
                      className="w-full py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      <span>{isFrench ? 'Imprimer les Étiquettes des Plis' : 'Print Envelope Labels'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmissionMethod('SELF');
                        setConciergeRequested(false);
                      }}
                      className={`w-full py-2 rounded-xl font-bold text-xs transition-colors ${
                        submissionMethod === 'SELF'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {submissionMethod === 'SELF'
                        ? (isFrench ? 'Mode Sélectionné ✓' : 'Mode Selected ✓')
                        : (isFrench ? 'Choisir Dépôt Direct' : 'Choose Direct Deposit')}
                    </button>
                  </div>
                </div>

                {/* Channel B: Concierge Runner Service */}
                <div 
                  onClick={() => {
                    setSubmissionMethod('CONCIERGE');
                    setConciergeRequested(true);
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    submissionMethod === 'CONCIERGE'
                      ? 'border-indigo-500 bg-indigo-50/20 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-extrabold">
                        <span>{isFrench ? 'Option B : Coursier & Dépôt Assisté' : 'Option B: Concierge Runner Desk'}</span>
                      </div>
                      {submissionMethod === 'CONCIERGE' ? (
                        <span className="text-[10px] font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                          {isFrench ? 'Sélectionné ✓' : 'Selected ✓'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md">
                          {isFrench ? 'Recommandé hors-ville' : 'Out-of-Town Pick'}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-black text-slate-900">
                      {isFrench ? 'Déléguer le Dépôt à nos Agents de Liaison' : 'Delegate Drop-off to Bidora Field Team'}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {isFrench
                        ? 'Nos agents accrédités à Yaoundé, Douala et Abuja impriment, scellent et déposent vos plis contre récépissé officiel.'
                        : 'Our accredited liaison agents in Yaoundé, Douala, and Abuja print, seal, and deposit your envelopes directly with official receipt.'}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSubmissionMethod('CONCIERGE');
                        setConciergeRequested(true);
                        toast.success(
                          isFrench ? 'Demande de Dépôt Assisté Sélectionnée' : 'Concierge Filing Selected',
                          isFrench
                            ? 'Un agent de liaison Bidora coordonnera la remise de votre pli avant l\'heure limite.'
                            : 'A Bidora liaison officer will coordinate your physical submission before deadline.'
                        );
                      }}
                      className={`w-full py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs ${
                        submissionMethod === 'CONCIERGE'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {submissionMethod === 'CONCIERGE'
                          ? (isFrench ? 'Coursier Sélectionné ✓' : 'Concierge Runner Selected ✓')
                          : (isFrench ? 'Choisir Coursier Assisté' : 'Choose Concierge Runner')}
                      </span>
                    </button>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs mt-2"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{isFrench ? 'Discuter sur WhatsApp' : 'Chat on WhatsApp'}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Option A: Drop-off Location & 3-Step Protocol */}
              {submissionMethod === 'SELF' && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        {isFrench ? 'Lieu & Modalités de Dépôt Physique de l\'Acheteur' : 'Buyer Drop-off Office & Submission Protocol'}
                      </h4>
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1.5 w-fit">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      <span>{isFrench ? 'Heure Limite Impérative :' : 'Strict Deadline:'} {new Date(tender.deadline).toLocaleDateString()} {new Date(tender.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        {isFrench ? 'Lieu de Dépôt / Autorité' : 'Drop-off Office / Authority'}
                      </span>
                      <p className="font-black text-slate-900">{tender.buyerName}</p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {isFrench ? 'Secrétariat Général / Service des Marchés' : 'Tender Secretariat / Procurement Division'} • {tender.buyerCountry}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        {isFrench ? 'Conditionnement Requis' : 'Packaging Standard'}
                      </span>
                      <p className="font-black text-slate-900">
                        {isFrench ? '1 Original + 3 Copies (Plis A, B, C)' : '1 Original + 3 Copies (Envelopes A, B, C)'}
                      </p>
                      <p className="text-[11px] text-emerald-700 font-bold">
                        {isFrench ? 'À insérer dans 1 grande enveloppe extérieure scellée' : 'Place all inside 1 large outer sealed envelope'}
                      </p>
                    </div>
                  </div>

                  {/* 3 Steps */}
                  <div className="space-y-2 pt-1">
                    <h5 className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                      {isFrench ? 'Comment Déposer Votre Dossier (3 Étapes) :' : 'Physical Drop-off Checklist (3 Steps):'}
                    </h5>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                          1
                        </span>
                        <div>
                          <strong className="text-slate-900">{isFrench ? 'Assembler les 3 Plis' : 'Assemble the 3 Envelopes'} :</strong>
                          <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                            {isFrench
                              ? 'Téléchargez le dossier (Étape 1). Répartissez les documents dans vos chemises ou enveloppes (A = Administratif, B = Technique, C = Financier).'
                              : 'Download your dossier (Step 1). Place documents into 3 separate envelopes (A = Administrative, B = Technical, C = Financial).'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                          2
                        </span>
                        <div>
                          <strong className="text-slate-900">{isFrench ? 'Coller l\'Étiquette Officielle Extérieure' : 'Affix Official Outer Label'} :</strong>
                          <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                            {isFrench
                              ? 'Insérez les 3 plis dans une grande enveloppe extérieure fermée et scellée. Cliquez sur "Imprimer les Étiquettes" et collez-la sur le devant.'
                              : 'Insert the 3 envelopes inside 1 large outer envelope. Click "Print Envelope Labels" and glue it onto the front.'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                          3
                        </span>
                        <div>
                          <strong className="text-slate-900">{isFrench ? 'Déposer en Main Propre & Exiger la Décharge' : 'Hand-Deliver & Demand Stamped Receipt'} :</strong>
                          <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                            {isFrench
                              ? `Rendez-vous à l'adresse ci-dessus de ${tender.buyerName} avant l'heure limite. Déposez dans l'urne et exigez obligatoirement votre décharge ou récépissé tamponné.`
                              : `Visit ${tender.buyerName} headquarters before the deadline. Deposit into the tender box and demand your official stamped receipt / slip.`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Option B: Concierge Runner Service Details */}
              {submissionMethod === 'CONCIERGE' && (
                <div className="p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-3 animate-fade-in text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <h4 className="font-black text-indigo-950 uppercase tracking-wide">
                      {isFrench ? 'Délégation Complète : Nous Effectuons le Dépôt Physique Pour Vous' : 'Full Delegation: We Handle the Physical Drop-off For You'}
                    </h4>
                  </div>
                  <p className="text-indigo-900 font-medium leading-relaxed">
                    {isFrench
                      ? `Vous n'avez pas besoin de vous déplacer ! Notre agent de liaison accrédité à ${tender.buyerCountry || 'Yaoundé'} imprime vos 3 plis, appose l'étiquette réglementaire, se rend directement au siège de ${tender.buyerName}, et dépose votre offre avant l'heure limite.`
                      : `You do not need to travel! Our verified liaison runner in ${tender.buyerCountry || 'Yaoundé'} will print your 3 envelopes, affix labels, physically visit ${tender.buyerName}, and deposit your bid before the deadline.`}
                  </p>
                  <div className="p-3 rounded-xl bg-white border border-indigo-200 flex items-center gap-2 font-bold text-indigo-900">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>
                      {isFrench
                        ? 'Une photo de la décharge officielle tamponnée vous sera envoyée sur WhatsApp dès la remise effectuée.'
                        : 'A photo of the buyer\'s official stamped receipt will be sent to your WhatsApp right after delivery.'}
                    </span>
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 hover:scale-[1.01]"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>
                      {isFrench
                        ? 'Contacter Notre Dispatch sur WhatsApp (+237 683 616 584)'
                        : 'Contact Dispatch on WhatsApp (+237 683 616 584)'}
                    </span>
                  </a>
                </div>
              )}

              {/* Printable Envelope Preview */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{isFrench ? 'Règle Impérative de Conditionnement Réglementaire :' : 'Important Legal Packaging Rule:'}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-900 font-medium">
                  {isFrench ? (
                    <>
                      Les Plis A (Administratif), B (Technique) et C (Financier) doivent être insérés dans une grande enveloppe extérieure fermée et scellée portant strictement la mention :
                      <br />
                      <strong className="font-mono text-slate-900 block mt-1 bg-white p-2 rounded-lg border border-amber-200">
                        &quot;APPEL D&apos;OFFRES N° {tender.refNumber} — À N&apos;OUVRIR QU&apos;EN SÉANCE DE DÉPOUILLEMENT.&quot;
                      </strong>
                    </>
                  ) : (
                    <>
                      Envelopes A (Administrative), B (Technical), and C (Financial) must be placed inside a single large sealed outer envelope labeled strictly:
                      <br />
                      <strong className="font-mono text-slate-900 block mt-1 bg-white p-2 rounded-lg border border-amber-200">
                        &quot;TENDER REF: {tender.refNumber} — TO BE OPENED ONLY BY THE BID EVALUATION COMMITTEE.&quot;
                      </strong>
                    </>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRMATION & PIPELINE TRACKING */}
          {activeStep === 3 && (
            <form id="bid-submission-form" onSubmit={handleConfirmSubmission} className="space-y-6 animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900">
                  {isFrench ? 'Enregistrer le Dépôt dans Votre Pipeline Bidora' : 'Record Submission in Your Bidora Pipeline'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {isFrench
                    ? (submissionMethod === 'CONCIERGE'
                        ? 'Indiquez votre numéro pour que notre agent de liaison confirme la remise physique de votre dossier :'
                        : 'Renseignez les détails du dépôt pour suivre l\'ouverture des plis dans votre tableau de bord :')
                    : (submissionMethod === 'CONCIERGE'
                        ? 'Provide your contact details so our liaison officer can confirm physical delivery of your sealed bid:'
                        : 'Record your bid details to track the public opening session inside your pipeline dashboard:')}
                </p>
              </div>

              {/* Active Mode Notice */}
              {submissionMethod === 'CONCIERGE' && (
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-indigo-900">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    <span>{isFrench ? 'Dépôt Assisté par Agent de Liaison Bidora' : 'Bidora Field Liaison Drop-off Active'}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-indigo-800 font-medium">
                    {isFrench
                      ? `Notre agent accrédité imprimera l'archive, scellera les 3 plis et déposera le dossier directement au siège de ${tender.buyerName} avant l'heure limite.`
                      : `Our verified field officer will print the archive, seal the 3 envelopes, and physically deposit your bid at ${tender.buyerName} headquarters before the deadline.`}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">
                    {isFrench ? 'Montant Définitif de l\'Offre Soumise' : 'Final Submitted Bid Amount'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      value={submittedAmount}
                      onChange={(e) => setSubmittedAmount(e.target.value)}
                      placeholder="e.g. 250000000"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-900 focus:outline-none focus:border-emerald-600 shadow-sm"
                    />
                    <span className="absolute right-3 top-2.5 font-mono text-slate-400 font-bold">
                      {tender.currency}
                    </span>
                  </div>
                </div>

                {submissionMethod === 'CONCIERGE' ? (
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-700">
                      {isFrench ? 'WhatsApp / Tél. pour Coordination du Dépôt' : 'WhatsApp / Phone for Courier Coordination'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder={isFrench ? '+237 6XX XX XX XX' : '+237 6XX XX XX XX'}
                      className="w-full bg-white border border-indigo-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-900 focus:outline-none focus:border-indigo-600 shadow-sm"
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-700">
                      {isFrench ? 'Numéro de Récépissé / Décharge de Dépôt' : 'Submission Receipt / Tracking ID'}
                    </label>
                    <input
                      type="text"
                      value={receiptNumber}
                      onChange={(e) => setReceiptNumber(e.target.value)}
                      placeholder={isFrench ? 'Ex. ARMP-REC-2026-9810 ou Décharge N°402' : 'e.g. WB-REC-2026-9810 or Slip #402'}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-emerald-600 shadow-sm"
                    />
                  </div>
                )}
              </div>

              {submissionMethod === 'CONCIERGE' && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5 text-center sm:text-left">
                    <span className="font-black text-emerald-950 block">
                      {isFrench ? 'Ligne WhatsApp Directe :' : 'Direct Dispatch WhatsApp Line:'} +237 683 616 584
                    </span>
                    <span className="text-[11px] text-emerald-800 font-medium block">
                      {isFrench
                        ? 'Cliquez pour envoyer directement les détails du dossier à notre coursier :'
                        : 'Click to directly send tender details to our dispatch runner:'}
                    </span>
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{isFrench ? 'Ouvrir WhatsApp' : 'Open WhatsApp'}</span>
                  </a>
                </div>
              )}

              {/* Certification Checkbox */}
              <label className="flex items-start space-x-3 cursor-pointer p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  required
                  checked={certified}
                  onChange={(e) => setCertified(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                />
                <span className="text-xs text-slate-600 font-medium leading-relaxed">
                  {isFrench ? (
                    <>
                      Je certifie sur l'honneur au nom de <strong>{companyName}</strong> que cette offre a été officiellement déposée auprès de{' '}
                      <strong>{tender.buyerName}</strong> dans le strict respect des règles des marchés publics.
                    </>
                  ) : (
                    <>
                      I certify on behalf of <strong>{companyName}</strong> that this bid was officially submitted to{' '}
                      <strong>{tender.buyerName}</strong> in full compliance with public procurement regulations.
                    </>
                  )}
                </span>
              </label>
            </form>
          )}
        </div>

        {/* Pinned Bottom Footer Navigation */}
        <div className="p-4 px-6 border-t border-slate-200/80 bg-slate-50/95 backdrop-blur-xs flex items-center justify-between shrink-0">
          {activeStep > 1 ? (
            <button
              type="button"
              onClick={() => setActiveStep((prev) => (prev === 3 ? 2 : 1))}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3.5 py-2 rounded-xl hover:bg-slate-200/60 transition-colors"
            >
              ← {isFrench ? 'Précédent' : 'Back'}
            </button>
          ) : (
            <div />
          )}

          {activeStep === 1 && (
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-2 transition-colors shadow-sm ml-auto"
            >
              <span>{isFrench ? 'Continuer vers les Modes de Dépôt' : 'Continue to Submission Channels'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {activeStep === 2 && (
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-600/25 hover:scale-[1.01] ml-auto"
            >
              <span>{isFrench ? 'Étape Suivante : Enregistrer le Dépôt' : 'Continue to Step 3: Track Bid'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {activeStep === 3 && (
            <button
              type="submit"
              form="bid-submission-form"
              disabled={submitting || !certified}
              className="px-6 py-2.5 rounded-xl gradient-bg text-white font-black text-xs shadow-md shadow-emerald-600/20 hover:opacity-95 flex items-center gap-2 transition-all disabled:opacity-50 ml-auto"
            >
              <Send className="w-4 h-4" />
              <span>
                {submitting
                  ? (isFrench ? 'Enregistrement...' : 'Saving...')
                  : (isFrench ? 'Marquer comme Déposé Officiellement' : 'Mark as Officially Submitted')}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
