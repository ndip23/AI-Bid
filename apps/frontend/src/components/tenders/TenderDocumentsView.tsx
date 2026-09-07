'use client';

import React, { useState } from 'react';
import { Tender } from '../../types';
import { useToast } from '../../lib/toast-context';
import { useLanguage } from '../../lib/language-context';
import {
  FileText,
  Download,
  ExternalLink,
  CheckCircle2,
  Upload,
  Sparkles,
  ShieldCheck,
  FolderArchive,
  Eye,
  FileCheck,
  Building,
  DollarSign,
  Briefcase,
  AlertCircle,
  Send,
  ArrowRight,
  Calculator,
  Calendar,
  ShieldAlert,
} from 'lucide-react';

interface Props {
  tender: Tender;
}

interface SubmissionDoc {
  id: string;
  category: 'Administrative & Legal' | 'Technical Proposal' | 'Financial Proposal';
  name: string;
  nameFr?: string;
  description: string;
  descriptionFr?: string;
  format: string;
  isMandatory: boolean;
  status: 'READY_IN_VAULT' | 'PENDING_UPLOAD' | 'TEMPLATE_AVAILABLE';
  fileName?: string;
}

import { useAuth } from '../../lib/auth-context';
import { checkProfileCompleteness } from '../../lib/profile-utils';
import { IncompleteProfileModal } from '../ui';
import { SubmitBidModal } from './SubmitBidModal';
import { BidBondCalculatorModal } from './BidBondCalculatorModal';
import Link from 'next/link';

export const TenderDocumentsView: React.FC<Props> = ({ tender }) => {
  const { toast } = useToast();
  const { company } = useAuth();
  const { isFrench } = useLanguage();
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);

  const companyName = company?.name || (isFrench ? 'Votre Entreprise' : 'Your Company');
  const completeness = checkProfileCompleteness(company);

  // Initial submission checklist for this tender - user must submit their own credentials
  const [submissionDocs, setSubmissionDocs] = useState<SubmissionDoc[]>([
    // Envelope 1: Administrative
    {
      id: 'doc-1',
      category: 'Administrative & Legal',
      name: 'Certificate of Incorporation & Trade Registry (RCCM)',
      nameFr: 'Registre du Commerce et du Crédit Mobilier (RCCM)',
      description: 'Official registration proving company is legally chartered in good standing',
      descriptionFr: 'Immatriculation officielle prouvant la constitution légale de l\'entreprise',
      format: 'PDF',
      isMandatory: true,
      status: 'PENDING_UPLOAD',
    },
    {
      id: 'doc-2',
      category: 'Administrative & Legal',
      name: 'Tax Clearance Certificate (Attestation de Non-Redevance)',
      nameFr: 'Attestation de Non-Redevance (DGI < 3 mois)',
      description: 'Valid compliance certificate issued by National Tax Directorate (< 3 months)',
      descriptionFr: 'Certificat de régularité fiscale délivré par les Impôts (validité < 3 mois)',
      format: 'PDF',
      isMandatory: true,
      status: 'PENDING_UPLOAD',
    },
    {
      id: 'doc-3',
      category: 'Administrative & Legal',
      name: 'Social Security Clearance Certificate (CNPS / Pension)',
      nameFr: 'Attestation pour Soumission CNPS / Caisse Sociale',
      description: 'Proof of timely employee social contribution compliance',
      descriptionFr: 'Attestation de versement régulier des cotisations de sécurité sociale',
      format: 'PDF',
      isMandatory: true,
      status: 'PENDING_UPLOAD',
    },
    {
      id: 'doc-4',
      category: 'Administrative & Legal',
      name: 'Bid Bond / Bank Guarantee of Tender Security',
      nameFr: 'Cautionnement Provisoire de Soumission (Original Bancaire)',
      description: `Irrevocable letter of tender guarantee (typically 1.5% to 2% of proposal amount)`,
      descriptionFr: 'Caution bancaire autonome de soumission (généralement 1,5% à 2% du montant de l\'offre)',
      format: isFrench ? 'Original Bancaire (PDF)' : 'Original Bank Letter (PDF)',
      isMandatory: true,
      status: 'TEMPLATE_AVAILABLE',
      fileName: 'Bank_Guarantee_Bid_Bond_Template.docx',
    },
    {
      id: 'doc-5',
      category: 'Administrative & Legal',
      name: 'Power of Attorney for Authorized Signatory',
      nameFr: 'Pouvoir Spécial et Mandat du Représentant Habilité',
      description: 'Legal authorization empowering company representative to submit & bind contract',
      descriptionFr: 'Autorisation légale habilitant le signataire à engager l\'entreprise et signer l\'offre',
      format: 'PDF',
      isMandatory: true,
      status: 'TEMPLATE_AVAILABLE',
      fileName: 'Power_Of_Attorney_Executive.docx',
    },

    // Envelope 2: Technical Proposal
    {
      id: 'doc-6',
      category: 'Technical Proposal',
      name: 'Comprehensive Technical Methodology & Work Plan',
      nameFr: 'Note Méthodologique & Planning d\'Exécution (GANTT)',
      description: `Detailed architectural blueprint, implementation schedule (GANTT), and technical response`,
      descriptionFr: 'Méthodologie détaillée d\'intervention, planning GANTT et réponse technique au CCTP',
      format: 'PDF / Word',
      isMandatory: true,
      status: 'TEMPLATE_AVAILABLE',
      fileName: 'Technical_Proposal_Methodology_Blueprint.docx',
    },
    {
      id: 'doc-7',
      category: 'Technical Proposal',
      name: 'CVs & Certified Diplomas of Key Personnel',
      nameFr: 'CV et Diplômes Légalisés des Experts Clés',
      description: 'Project Director, Lead Systems Architect, Quality Engineer, and Compliance Officer',
      descriptionFr: 'Directeur de projet, architecte technique, ingénieurs et experts sectoriels',
      format: isFrench ? 'Dossier PDF' : 'PDF Dossier',
      isMandatory: true,
      status: 'PENDING_UPLOAD',
    },
    {
      id: 'doc-8',
      category: 'Technical Proposal',
      name: '3 Similar Past Project Completion Certificates (Attestations)',
      nameFr: '3 Attestations de Bonne Fin d\'Exécution de Marchés Similaires',
      description: 'Documented proof of successfully delivered enterprise/public contracts within 5 years',
      descriptionFr: 'Preuves certifiées de marchés similaires réalisés avec succès au cours des 5 dernières années',
      format: isFrench ? 'Copies Certifiées (PDF)' : 'Certified PDFs',
      isMandatory: true,
      status: 'PENDING_UPLOAD',
    },
    {
      id: 'doc-9',
      category: 'Technical Proposal',
      name: 'ISO 9001 / ISO 27001 Quality & Security Certifications',
      nameFr: 'Certifications de Qualité ISO 9001 / ISO 27001 ou Agréments',
      description: 'Accredited certificates demonstrating certified quality & data protection protocols',
      descriptionFr: 'Certificats accrédités justifiant de processus qualité et sécurité éprouvés',
      format: 'PDF',
      isMandatory: false,
      status: 'PENDING_UPLOAD',
    },

    // Envelope 3: Financial Proposal
    {
      id: 'doc-10',
      category: 'Financial Proposal',
      name: 'Formal Tender Submission Letter (Lettre de Soumission)',
      nameFr: 'Lettre de Soumission Formelle (Timbrée & Signée)',
      description: 'Legally binding tender submission letter confirming total bid amount and validity period',
      descriptionFr: 'Engagement juridique irrévocable confirmant le montant de l\'offre et sa durée de validité',
      format: isFrench ? 'PDF Original' : 'Original PDF',
      isMandatory: true,
      status: 'TEMPLATE_AVAILABLE',
      fileName: 'Official_Bid_Submission_Letter_Template.docx',
    },
    {
      id: 'doc-11',
      category: 'Financial Proposal',
      name: 'Bill of Quantities & Detailed Price Schedule (BPU & DQE)',
      nameFr: 'Bordereau des Prix Unitaires & Devis Quantitatif Estimatif (BPU/DQE)',
      description: 'Fully priced itemized unit cost breakdown and total financial evaluation sheet',
      descriptionFr: 'Décomposition intégrale des prix unitaires et cadre du devis quantitatif',
      format: 'Excel (.xlsx)',
      isMandatory: true,
      status: 'TEMPLATE_AVAILABLE',
      fileName: 'Bordereau_Prix_Unitaires_BPU_Template.xlsx',
    },
    {
      id: 'doc-12',
      category: 'Financial Proposal',
      name: '3 Years Certified Audited Balance Sheets & Financial Statements',
      nameFr: 'Bilans Financiers Certifiés des 3 Derniers Exercices (Commissaire aux Comptes)',
      description: 'Independent auditor certified balance sheets proving financial health and turnover capacity',
      descriptionFr: 'États financiers certifiés attestant de la solidité financière et du chiffre d\'affaires requis',
      format: isFrench ? 'PDF Certifiés' : 'Certified PDF',
      isMandatory: true,
      status: 'PENDING_UPLOAD',
    },
  ]);

  // Project documents that the user can read & analyze
  const officialProjectUrl =
    tender.sourceUrl ||
    `https://projects.worldbank.org/en/projects-operations/project-detail/${tender.refNumber}`;

  const projectDocsToRead = [
    {
      id: 'pdoc-1',
      title: isFrench
        ? 'Dossier d\'Évaluation & Cadre Technique du Projet (PAD)'
        : 'Project Appraisal Document (PAD) & Technical Assessment',
      type: isFrench ? 'Spécification Technique PDF' : 'Official Specification PDF',
      size: '4.8 MB • 128 Pages',
      description: isFrench
        ? `Descriptif technique officiel définissant les composantes, budgets et normes applicables pour ${tender.title}.`
        : `Official technical blueprint outlining full institutional framework, component costings, and technical parameters for ${tender.title}.`,
      actionUrl: officialProjectUrl,
      downloadUrl: officialProjectUrl,
      isPrimary: true,
    },
    {
      id: 'pdoc-2',
      title: isFrench
        ? 'Dossier d\'Appel d\'Offres (DAO) & Règlement de Consultation (RPAO)'
        : 'Request for Bids (RFB) & Standard Procurement Dossier (DAO)',
      type: isFrench ? 'Dossier d\'Appel d\'Offres (DAO)' : 'Bidding Document (DAO)',
      size: '2.1 MB • 84 Pages',
      description: isFrench
        ? 'Instructions aux soumissionnaires, critères de qualification, barème d\'évaluation et cahier des clauses administratives générales.'
        : 'Standard bidding instructions, qualification criteria, evaluation formula, and general conditions of contract.',
      actionUrl: officialProjectUrl,
      downloadUrl: officialProjectUrl,
      isPrimary: true,
    },
    {
      id: 'pdoc-3',
      title: isFrench
        ? 'Plan Général de Passation des Marchés & Calendrier des Lots'
        : 'Comprehensive Procurement Plan & Package Schedule',
      type: isFrench ? 'Calendrier de Passation' : 'Procurement Schedule',
      size: '850 KB • Multi-Lot',
      description: isFrench
        ? 'Calendrier officiel des lots, seuils de passation nationaux et internationaux, et dates limites prévisionnelles.'
        : 'Official timeline of all lots, international/national competitive bidding thresholds, and award targets.',
      actionUrl: officialProjectUrl,
      downloadUrl: officialProjectUrl,
      isPrimary: false,
    },
    {
      id: 'pdoc-4',
      title: isFrench
        ? 'Plan d\'Engagement Environnemental et Social (PEES)'
        : 'Environmental & Social Commitment Plan (ESCP)',
      type: isFrench ? 'Normes Environnementales & RSE' : 'Regulatory Compliance Spec',
      size: '1.4 MB • 42 Pages',
      description: isFrench
        ? 'Normes environnementales, d\'hygiène, de sécurité et conditions de travail obligatoires pour tout attributaire.'
        : 'Mandatory environmental, health, and labor standards required from all contractors participating in this tender.',
      actionUrl: officialProjectUrl,
      downloadUrl: officialProjectUrl,
      isPrimary: false,
    },
  ];

  const handleSyncFromVault = () => {
    const currentCompleteness = checkProfileCompleteness(company);
    if (!currentCompleteness.isComplete) {
      setShowIncompleteModal(true);
      toast.error(
        isFrench ? 'Profil de Compétences Incomplet' : 'Capability Profile Incomplete',
        isFrench ? 'Vous devez renseigner votre profil d\'entreprise avant de synchroniser vos pièces de candidature.' : 'You must complete and submit your company capability profile before attaching credentials.'
      );
      return;
    }

    setSubmissionDocs((prev) =>
      prev.map((d) => ({
        ...d,
        status: 'READY_IN_VAULT',
        fileName:
          d.fileName ||
          `${companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${d.name.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 24)}_Verified.pdf`,
      }))
    );

    toast.success(
      isFrench ? 'Pièces Rattachées depuis le Coffre-Fort' : 'Credentials Attached from Vault',
      isFrench ? `Toutes les pièces de ${companyName} ont été synchronisées avec succès.` : `All verified corporate credentials for ${companyName} have been synchronized.`
    );
  };

  const handleDownloadTemplate = (docName: string) => {
    toast.info(
      isFrench ? 'Téléchargement du Modèle' : 'Downloading Template',
      isFrench ? `Génération du modèle officiel pré-rempli pour : ${docName}` : `Generating pre-formatted standard template for: ${docName}`
    );
  };

  const handleUploadDoc = (docId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.xlsx';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        setSubmissionDocs((prev) =>
          prev.map((d) =>
            d.id === docId ? { ...d, status: 'READY_IN_VAULT', fileName: file.name } : d
          )
        );
        toast.success(
          isFrench ? 'Fichier Téléversé' : 'Document Uploaded',
          isFrench ? `${file.name} ajouté au dossier avec succès.` : `${file.name} successfully added to submission package.`
        );
      }
    };
    input.click();
  };

  const readyCount = submissionDocs.filter((d) => d.status === 'READY_IN_VAULT').length;
  const readinessPercent = Math.round((readyCount / submissionDocs.length) * 100);

  const getCategoryTitle = (category: string) => {
    if (isFrench) {
      if (category === 'Administrative & Legal') return 'Pli 1 : Pièces Administratives & Juridiques';
      if (category === 'Technical Proposal') return 'Pli 2 : Offre Technique & Méthodologie';
      if (category === 'Financial Proposal') return 'Pli 3 : Offre Financière & Bordereau des Prix';
    }
    return `Envelope: ${category}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* SECTION 1: DOCUMENTS TO READ & ANALYZE */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold border border-blue-200 mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>{isFrench ? 'Dossier d\'Appel d\'Offres Officiel (DAO)' : 'Official Bidding Documents & Specification'}</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              {isFrench ? 'Documents du Projet Émis par l\'Acheteur' : 'Project Documents Published by Buyer'}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {isFrench
                ? `Documents de consultation officiels publiés pour le marché réf : ${tender.refNumber}`
                : `Official procurement dossier published for tender ref: ${tender.refNumber}`}
            </p>
          </div>

          <a
            href={officialProjectUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl gradient-bg text-white font-bold text-xs shadow-sm hover:opacity-95 transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <span>{isFrench ? 'Consulter le Répertoire Source' : 'Open Source Repository'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Reading Document Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projectDocsToRead.map((pdoc) => (
            <div
              key={pdoc.id}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-sky-300 hover:bg-sky-50/20 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-sky-700 block">
                        {pdoc.type}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">{pdoc.size}</span>
                    </div>
                  </div>

                  {pdoc.isPrimary && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-200">
                      {isFrench ? 'Dossier Principal' : 'Primary Dossier'}
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-sky-800 transition-colors leading-snug">
                  {pdoc.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {pdoc.description}
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-slate-200/60">
                <a
                  href={pdoc.actionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl bg-white border border-slate-200 hover:border-sky-300 text-slate-800 font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-sky-600" />
                  <span>{isFrench ? 'Consulter le Document' : 'Read Official Spec'}</span>
                </a>

                <a
                  href={pdoc.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => toast.info(
                    isFrench ? 'Téléchargement Lancé' : 'Download Initiated',
                    isFrench ? `Ouverture de l'archive PDF pour : ${pdoc.title}` : `Opening official PDF archive for ${pdoc.title}`
                  )}
                  className="px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs border border-sky-200 flex items-center justify-center gap-1 transition-colors"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: DOCUMENTS TO SUBMIT (SUBMISSION DOSSIER) */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isFrench ? 'Dossier de Soumission Obligatoire (3 Plis Réglementaires)' : 'Mandatory Submission Package (Dossier de Soumission)'}</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              {isFrench ? 'Pièces Exigées pour la Soumission' : 'Documents Required to Submit for this Tender'}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {isFrench
                ? `Exigé par le Maître d'Ouvrage (${tender.buyerName}) pour les Plis Administratif, Technique et Financier.`
                : `Required by the Contracting Authority (${tender.buyerName}) across Administrative, Technical, and Financial envelopes.`}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={handleSyncFromVault}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isFrench ? `Joindre Tout depuis le Coffre-Fort (${companyName})` : `Attach All from ${companyName} Vault`}</span>
            </button>
          </div>
        </div>

        {/* Incomplete Profile Alert Banner */}
        {!completeness.isComplete && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-900">
                  {isFrench ? `Profil de Compétences Requis pour ${companyName}` : `Capability Profile Required for ${companyName}`}
                </h4>
                <p className="text-[11px] text-amber-800">
                  {isFrench
                    ? 'Renseignez le Numéro Contribuable / RCCM, certifications et prestations de votre entreprise pour déverrouiller la synchronisation.'
                    : 'Fill in your company\'s Tax ID / RCCM, certifications, services, and target countries to unlock 1-click dossier sync and bidding authorization.'}
                </p>
              </div>
            </div>
            <Link
              href="/company"
              className="px-3.5 py-2 rounded-xl gradient-bg text-white font-extrabold text-xs shadow-xs hover:opacity-95 whitespace-nowrap shrink-0"
            >
              {isFrench ? 'Compléter le Profil Entreprise' : 'Fill Capability Profile'}
            </Link>
          </div>
        )}

        {/* Submission Readiness Progress Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-800 flex items-center gap-2">
              <FolderArchive className="w-4 h-4 text-emerald-600" />
              <span>
                {isFrench
                  ? `Préparation du Dossier ${companyName} : ${readyCount} sur ${submissionDocs.length} Pièces Prêtes`
                  : `${companyName} Submission Readiness: ${readyCount} of ${submissionDocs.length} Documents Ready`}
              </span>
            </span>
            <span className="font-black text-emerald-600">
              {readinessPercent}% {isFrench ? 'Prêt à Soumissionner' : 'Ready to Bid'}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${readinessPercent}%` }}
            />
          </div>
        </div>

        {/* Finalize & Submit Bid Package Action Strip */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xs font-black text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isFrench ? `Prêt à Assembler et Déposer l'Offre pour ${companyName} ?` : `Ready to Package & Submit Bid for ${companyName}?`}</span>
            </h4>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              {isFrench
                ? 'Exportez votre archive réglementaire en 3 plis (.zip) et recevez les instructions officielles de dépôt physique ou en ligne.'
                : 'Export your official 3-envelope submission package (.zip) and receive direct instructions for buyer portal or physical sealed delivery.'}
            </p>
          </div>

          <button
            onClick={() => {
              const currentCompleteness = checkProfileCompleteness(company);
              if (!currentCompleteness.isComplete) {
                setShowIncompleteModal(true);
                return;
              }
              setShowSubmitModal(true);
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl gradient-bg text-white font-black text-xs shadow-md shadow-emerald-600/20 hover:opacity-95 flex items-center justify-center gap-2 shrink-0 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>{isFrench ? 'Finaliser & Préparer le Dépôt' : 'Finalize & Submit Bid Package'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bidora Elimination Shield */}
        <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300 block">
                  {isFrench ? 'Bouclier de Conformité Bidora' : 'Bidora Elimination Shield'}
                </span>
                <h4 className="text-xs font-black text-white">
                  {isFrench ? 'Règles de Validité & Échéances des Pièces Administratives' : 'Administrative Document Validity & Expiration Rules'}
                </h4>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-bold self-start sm:self-auto flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              <span>{isFrench ? '64% Rejetés pour Pièces Expirées' : '64% Eliminated for Expired Papers'}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <p className="font-bold text-slate-200 text-[11px]">
                {isFrench ? 'Non-Redevance Fiscale (DGI)' : 'Tax Clearance (Non-Redevance)'}
              </p>
              <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                {isFrench ? 'Strictement < 3 Mois de Validité' : 'Strictly < 3 Months Valid'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                {isFrench ? 'Délivrée par la Direction Générale des Impôts. Valide à l\'ouverture des plis.' : 'Issued by National Tax Directorate (DGI). Must not expire before bid opening date.'}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <p className="font-bold text-slate-200 text-[11px]">
                {isFrench ? 'Attestation CNPS / Sécurité Sociale' : 'Social Security (CNPS / NSIF)'}
              </p>
              <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                {isFrench ? 'Strictement < 3 Mois de Validité' : 'Strictly < 3 Months Valid'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                {isFrench ? 'Preuve du paiement des cotisations sociales pour l\'ensemble du personnel.' : 'Proof of employee social insurance compliance. Certified copy required.'}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <p className="font-bold text-slate-200 text-[11px]">
                {isFrench ? 'Attestation Non-Faillite' : 'Attestation Non-Faillite'}
              </p>
              <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                {isFrench ? 'Strictement < 3 Mois de Validité' : 'Strictly < 3 Months Valid'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                {isFrench ? 'Délivrée par le Greffe du Tribunal. Prouve l\'absence de liquidation judiciaire.' : 'Issued by Clerk of Court (Greffe du Tribunal). Proves absence of liquidation.'}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <p className="font-bold text-slate-200 text-[11px]">
                {isFrench ? 'Caution Provisoire (Caution de Soumission)' : 'Bid Bond (Caution Provisoire)'}
              </p>
              <p className="text-[10px] text-amber-300 font-semibold mt-0.5">
                {isFrench ? '90 à 120 Jours de Validité' : '90 - 120 Days Validity'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                {isFrench ? 'Caution bancaire originale autonome exigée (1,5% à 2% de l\'estimation financière).' : 'Original bank guarantee required. Standard rate is 1.5% to 2.0% of bid estimate.'}
              </p>
            </div>
          </div>
        </div>

        {/* Grouped Envelopes */}
        {(['Administrative & Legal', 'Technical Proposal', 'Financial Proposal'] as const).map(
          (category) => {
            const docs = submissionDocs.filter((d) => d.category === category);
            return (
              <div key={category} className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {category === 'Administrative & Legal' && (
                      <Building className="w-4 h-4 text-sky-600" />
                    )}
                    {category === 'Technical Proposal' && (
                      <Briefcase className="w-4 h-4 text-indigo-600" />
                    )}
                    {category === 'Financial Proposal' && (
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                    )}
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      {getCategoryTitle(category)} ({docs.length} {isFrench ? 'Pièces' : 'Items'})
                    </h4>
                  </div>

                  {category === 'Administrative & Legal' && (
                    <button
                      onClick={() => setShowCalculatorModal(true)}
                      className="px-3 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isFrench ? 'Calculateur de Caution' : 'Calculate Bid Bond'}</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {docs.map((doc) => {
                    const isReady = doc.status === 'READY_IN_VAULT';
                    const docDisplayName = isFrench && doc.nameFr ? doc.nameFr : doc.name;
                    const docDisplayDesc = isFrench && doc.descriptionFr ? doc.descriptionFr : doc.description;

                    return (
                      <div
                        key={doc.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isReady
                            ? 'bg-emerald-50/40 border-emerald-200/90'
                            : 'bg-white border-slate-200 shadow-xs'
                        }`}
                      >
                        <div className="space-y-1 max-w-xl">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{docDisplayName}</span>
                            {doc.isMandatory && (
                              <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 text-[9px] font-extrabold border border-rose-200">
                                {isFrench ? 'OBLIGATOIRE' : 'MANDATORY'}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">{docDisplayDesc}</p>
                          {doc.fileName && (
                            <div className="text-[11px] font-mono font-medium text-slate-600 flex items-center gap-1 mt-1">
                              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{doc.fileName}</span>
                            </div>
                          )}
                        </div>

                        {/* Status & Actions */}
                        <div className="flex items-center space-x-2 shrink-0 self-start sm:self-auto">
                          {doc.id === 'doc-4' && (
                            <button
                              onClick={() => setShowCalculatorModal(true)}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                              title="Calculate 2% bid bond amount & get bank request letter"
                            >
                              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{isFrench ? 'Calculer Caution 2%' : 'Calculate 2% Bond'}</span>
                            </button>
                          )}

                          {isReady ? (
                            <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{isFrench ? 'Prêt dans le Coffre' : 'Ready in Vault'}</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleDownloadTemplate(docDisplayName)}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                              title="Download official template"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{isFrench ? 'Modèle' : 'Get Template'}</span>
                            </button>
                          )}

                          {!isReady ? (
                            <button
                              onClick={() => handleUploadDoc(doc.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>{isFrench ? 'Téléverser' : 'Upload'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => toast.info(
                                isFrench ? 'Document du Coffre Ouvert' : 'Vault Document Opened',
                                `${doc.fileName}`
                              )}
                              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-500" />
                              <span>{isFrench ? 'Aperçu' : 'Preview'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* Warning Modal if Capability Profile is Incomplete */}
      <IncompleteProfileModal
        isOpen={showIncompleteModal}
        onClose={() => setShowIncompleteModal(false)}
        missingFields={completeness.missingFields}
        companyName={companyName}
      />

      {/* Official Bidding & Submission Packaging Gateway Modal */}
      <SubmitBidModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        tender={tender}
        companyName={companyName}
        readyCount={readyCount}
        totalDocs={submissionDocs.length}
      />

      {/* Bidora Bid Bond & Bank Guarantee Calculator Modal */}
      <BidBondCalculatorModal
        isOpen={showCalculatorModal}
        onClose={() => setShowCalculatorModal(false)}
        tender={tender}
        companyName={companyName}
      />
    </div>
  );
};
