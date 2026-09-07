'use client';

import React from 'react';
import { PublicNav } from '../../components/layout/PublicNav';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { useLanguage } from '../../lib/language-context';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const { isFrench } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PublicNav />

      <main className="flex-1 max-w-4xl mx-auto px-6 md:px-10 pt-28 pb-16 space-y-8 w-full">
        {/* Header */}
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
            {isFrench ? 'Politique de Confidentialité' : 'Privacy Policy'}
          </h1>
          <p className="text-xs text-slate-500 font-semibold">
            {isFrench
              ? 'Dernière mise à jour : 17 août 2026 • Date d\'entrée en vigueur : 1er janvier 2026'
              : 'Last updated: August 17, 2026 • Effective Date: January 1, 2026'}
          </p>
        </div>

        {/* Content Body */}
        <div className="glass-panel rounded-3xl p-6 md:p-10 space-y-8 bg-white border border-slate-200 shadow-sm text-sm text-slate-700 leading-relaxed font-medium">
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              {isFrench ? '1. Garantie d\'Absence d\'Entraînement de Modèles Publics' : '1. Our Zero-Data-Training Guarantee'}
            </h2>
            <p>
              {isFrench ? (
                <>
                  Chez <strong>Bidora, Inc.</strong>, nous avons pleinement conscience que les profils d&apos;agréments, scores d&apos;adéquation et dossiers d&apos;appels d&apos;offres téléversés contiennent des informations commerciales strictement confidentielles.
                </>
              ) : (
                <>
                  At <strong>Bidora, Inc.</strong>, we understand that procurement capability profiles, tender match scores, and uploaded RFP documents contain confidential business intelligence.
                </>
              )}
            </p>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                {isFrench
                  ? 'Vos données ne sont JAMAIS utilisées pour entraîner des modèles d\'IA publics (Gemini, OpenAI, Anthropic). Tous les embeddings de documents et matrices de compétences sont cloisonnés par organisation conformément aux exigences SOC 2 Type II.'
                  : 'Your data is NEVER used to train public AI models (Gemini, OpenAI, Anthropic). All tenant document embeddings and capability matrices are isolated per organization using strict SOC 2 Type II tenant boundaries.'}
              </span>
            </div>
          </section>

          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-600" />
              {isFrench ? '2. Données Collectées & Finalités' : '2. Data We Collect & How It Is Used'}
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              {isFrench ? (
                <>
                  <li><strong>Identifiants de Compte :</strong> Email professionnel, nom d&apos;utilisateur, mot de passe chiffré et organisation pour administrer l&apos;accès à votre espace de travail.</li>
                  <li><strong>Profil d&apos;Agréments & Compétences :</strong> Certifications (ISO, agréments ministériels), pays d&apos;intervention et domaines d&apos;expertise utilisés exclusivement pour calculer le score d&apos;adéquation face aux avis de marchés.</li>
                  <li><strong>Télémétrie d&apos;Utilisation :</strong> Journaux anonymisés pour fiabiliser la précision des algorithmes d&apos;adéquation et la réactivité de la plateforme.</li>
                </>
              ) : (
                <>
                  <li><strong>Account Credentials:</strong> Work email, user name, hashed password, and organization affiliation to manage tenant access.</li>
                  <li><strong>Company Capability Profile:</strong> Certifications (ISO 27001, SOC 2), operating countries, and service lists used strictly to compute match scores against live tenders.</li>
                  <li><strong>Usage Analytics:</strong> Anonymized interaction logs to optimize match scoring algorithms and platform performance.</li>
                </>
              )}
            </ul>
          </section>

          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              {isFrench ? '3. Conservation & Suppression des Données' : '3. Data Retention & Deletion'}
            </h2>
            <p className="text-xs">
              {isFrench
                ? 'Vous conservez l\'entière propriété de vos données. En cas de résiliation d\'un compte ou de suppression d\'un profil d\'entreprise, l\'ensemble des embeddings, dossiers d\'offres sauvegardés et métadonnées associées sont définitivement purgés sous 30 jours de nos bases primaires et sauvegardes chiffrées.'
                : 'You retain full ownership of your data. When an account is terminated or a capability profile is deleted, all associated embeddings, saved tenders, and company records are permanently purged from our primary database and encrypted backups within 30 days.'}
            </p>
          </section>

          <section className="space-y-2 border-t border-slate-100 pt-6 text-xs text-slate-500">
            <p>
              {isFrench
                ? 'Pour toute question relative à notre politique de confidentialité ou pour exercer vos droits RGPD, contactez notre Délégué à la Protection des Données à l\'adresse privacy@bidora.io.'
                : 'For questions regarding our Privacy Policy or to exercise GDPR data rights, contact our Data Protection Officer at privacy@bidora.io.'}
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
