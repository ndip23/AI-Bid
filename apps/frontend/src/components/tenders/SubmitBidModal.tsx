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

  if (!isOpen) return null;

  const officialSubmissionUrl =
    tender.sourceUrl ||
    `https://projects.worldbank.org/en/projects-operations/project-detail/${tender.refNumber}`;

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
[✓] 1. Registre du Commerce et du Crédit Mobilier (RCCM)
[✓] 2. Attestation de Non-Redevance (DGI < 3 mois)
[✓] 3. Attestation de Conformité Sociale (CNPS)
[✓] 4. Cautionnement Provisoire Bancaire (Original 2%)
[✓] 5. Pouvoir de Signature et Mandat de Représentation

PLI B : OFFRE TECHNIQUE & MÉTHODOLOGIE
------------------------------------------------------------------------
[✓] 6. Note Méthodologique & Planning d'Exécution (GANTT)
[✓] 7. CVs et Diplômes Certifiés du Personnel Clé
[✓] 8. Références et Attestations de Bonne Fin d'Exécution Similaires
[✓] 9. Certifications de Qualité et Agréments Techniques

PLI C : OFFRE FINANCIÈRE & BORDEREAU DE PRIX
------------------------------------------------------------------------
[✓] 10. Lettre de Soumission Formelle Datée et Signée
[✓] 11. Bordereau des Prix Unitaires & Détail Quantitatif (BPU/DQE)
[✓] 12. Bilans Financiers et États Financiers Certifiés des 3 Derniers Exercices

========================================================================
INSTRUCTIONS DE DÉPÔT RÉGLEMENTAIRE :
- Dépôt en ligne : Téléversez cette archive sur ${officialSubmissionUrl}
- Dépôt physique : Déposez 1 Original + 3 Copies sous double pli cacheté
  au siège de l'Autorité Contractante (${tender.buyerName}) avant l'heure limite.
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
[✓] 1. Certificate of Incorporation & Trade Registry (RCCM)
[✓] 2. Tax Clearance Certificate (Attestation de Non-Redevance)
[✓] 3. Social Security Clearance Certificate (CNPS / Pension)
[✓] 4. Official Bid Bond / Bank Guarantee of Tender Security
[✓] 5. Power of Attorney for Authorized Signatory

ENVELOPE B: TECHNICAL PROPOSAL
------------------------------------------------------------------------
[✓] 6. Comprehensive Technical Methodology & GANTT Work Plan
[✓] 7. CVs & Certified Diplomas of Key Personnel
[✓] 8. 3 Similar Past African Project Reference Certificates
[✓] 9. ISO 9001 / ISO 27001 Quality & Security Accreditation

ENVELOPE C: FINANCIAL PROPOSAL
------------------------------------------------------------------------
[✓] 10. Official Bid Submission Letter (Lettre de Soumission)
[✓] 11. Bill of Quantities & Unit Price Schedule (BPU & DQE)
[✓] 12. 3 Years Certified Audited Balance Sheets

========================================================================
SUBMISSION INSTRUCTIONS:
- For Electronic Portals: Upload this dossier to ${officialSubmissionUrl}
- For Physical Submissions: Deposit 1 Original + 3 Copies in the sealed
  tender box at ${tender.buyerName} headquarters before the deadline.
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
      await ApiClient.saveTender(tender.id, 'BIDDING');
      toast.success(
        isFrench ? 'Dépôt Enregistré avec Succès !' : 'Submission Successfully Recorded!',
        isFrench ? `Marché ${tender.refNumber} marqué comme En Soumission.` : `Opportunity ${tender.refNumber} moved to Bidding stage.`
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
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 z-10 overflow-hidden animate-scale-in text-slate-900 my-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex items-start justify-between gap-4">
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
        <div className="flex border-b border-slate-200 text-xs font-bold bg-white">
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
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
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

              {/* Next Step Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-2 transition-colors"
                >
                  <span>{isFrench ? 'Continuer vers les Modes de Dépôt' : 'Continue to Submission Channels'}</span>
                  <ArrowRight className="w-4 h-4" />
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Channel A: Official Electronic Portal */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-extrabold">
                      <span>{isFrench ? 'Méthode A : Portail En Ligne (e-GP)' : 'Method A: Online e-GP Portal'}</span>
                    </div>
                    <h4 className="text-xs font-black text-slate-900">
                      {isFrench ? 'Dépôt Dématérialisé sur le Portail Acheteur' : 'Submit on Official Buyer Procurement Portal'}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {isFrench
                        ? `Téléversez votre dossier Bidora directement sur la plateforme officielle de ${tender.buyerName}.`
                        : `Upload your downloaded Bidora dossier directly to the official portal hosted by ${tender.buyerName}.`}
                    </p>
                  </div>

                  <a
                    href={officialSubmissionUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>{isFrench ? 'Ouvrir le Portail Officiel' : 'Open Official Portal'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Channel B: Physical Sealed Envelopes */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                      <span>{isFrench ? 'Méthode B : Dépôt Physique Sous Pli Scellé' : 'Method B: Physical Tender Box'}</span>
                    </div>
                    <h4 className="text-xs font-black text-slate-900">
                      {isFrench ? 'Dépôt Physique contre Récépissé' : 'Physical Sealed Envelope Delivery (Sous pli scellé)'}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {isFrench
                        ? 'Imprimez 1 Original + 3 Copies. Déposez-les dans l\'urne des soumissions contre décharge avant l\'heure limite.'
                        : 'Print 1 Original + 3 Copies. Deposit into the Contracting Authority\'s tender box before the deadline.'}
                    </p>
                  </div>

                  <button
                    onClick={handlePrintLabels}
                    className="w-full py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span>{isFrench ? 'Imprimer les Étiquettes des Plis' : 'Print Envelope Labels'}</span>
                  </button>
                </div>
              </div>

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

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setActiveStep(1)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  ← {isFrench ? 'Retour à l\'Audit' : 'Back to Audit'}
                </button>

                <button
                  onClick={() => setActiveStep(3)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-2 transition-colors"
                >
                  <span>{isFrench ? 'Étape 3 : Confirmer & Enregistrer' : 'Step 3: Confirm & Track Bid'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRMATION & PIPELINE TRACKING */}
          {activeStep === 3 && (
            <form onSubmit={handleConfirmSubmission} className="space-y-6 animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900">
                  {isFrench ? 'Enregistrer le Dépôt dans Votre Pipeline Bidora' : 'Record Submission in Your Bidora Pipeline'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {isFrench
                    ? 'Une fois le dossier téléversé ou déposé physiquement, renseignez les informations ci-dessous pour suivre la séance d\'ouverture des plis :'
                    : 'Once your team has uploaded to the portal or deposited the physical envelope, record the submission details below to track your bid opening session:'}
                </p>
              </div>

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
              </div>

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

              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  ← {isFrench ? 'Retour aux Canaux' : 'Back to Channels'}
                </button>

                <button
                  type="submit"
                  disabled={submitting || !certified}
                  className="px-6 py-3 rounded-2xl gradient-bg text-white font-black text-xs shadow-md shadow-emerald-600/20 hover:opacity-95 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {submitting
                      ? (isFrench ? 'Enregistrement...' : 'Saving...')
                      : (isFrench ? 'Marquer comme Déposé Officiellement' : 'Mark as Officially Submitted')}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
