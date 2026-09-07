'use client';

import React, { useState } from 'react';
import { PublicNav } from '../../components/layout/PublicNav';
import { PublicFooter } from '../../components/layout/PublicFooter';
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  Scale,
  Building,
  Lock,
  CheckCircle2,
  HelpCircle,
  Award,
  Globe,
} from 'lucide-react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState('government-independence');

  const sections = [
    { id: 'government-independence', title: '1. Government & Authority Independence' },
    { id: 'no-guarantee', title: '2. No Guarantee of Tender Award or Qualification' },
    { id: 'anti-corruption', title: '3. Anti-Bribery, Anti-Collusion & Integrity Code' },
    { id: 'user-representations', title: '4. Authenticity of Company Credentials' },
    { id: 'ai-disclaimer', title: '5. AI Analytics & Decision Support Advisory' },
    { id: 'liability-indemnity', title: '6. Limitation of Liability & Full Indemnification' },
    { id: 'subcontracting', title: '7. Subcontractor & Consortium Disclaimers' },
    { id: 'confidentiality', title: '8. Multi-Tenant Confidentiality & Trade Secrets' },
    { id: 'sanctions', title: '9. International Sanctions & Debarment Compliance' },
    { id: 'governing-law', title: '10. Dispute Resolution & Governing Jurisdiction' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PublicNav />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 md:px-10 pt-24 pb-20 w-full space-y-8">
        {/* Page Header */}
        <div className="space-y-4 border-b border-slate-200 pb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black border border-emerald-200">
            <Scale className="w-3.5 h-3.5 text-emerald-600" />
            <span>Master Enterprise Agreement & Procurement Disclaimers</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Terms of Service & Regulatory Compliance Code
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed font-medium">
            Please read these terms carefully before utilizing the Bidora procurement intelligence platform.
            This Agreement governs your corporate access and legally shields both parties across public, international, and commercial procurement activities.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-bold pt-1">
            <span>Version: 2.4 (Enterprise Procurement Edition)</span>
            <span>•</span>
            <span>Last Updated: September 2026</span>
            <span>•</span>
            <span className="text-emerald-700 font-black">Legally Binding Contract</span>
          </div>
        </div>

        {/* CRITICAL GOVERNMENT & REGULATORY NOTICE BANNER */}
        <div className="p-6 rounded-3xl bg-amber-50/90 border-2 border-amber-300 shadow-sm space-y-3 text-amber-950">
          <div className="flex items-center space-x-2.5 font-black text-sm text-amber-900 uppercase tracking-wider">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
            <span>CRITICAL STATUTORY NOTICE REGARDING GOVERNMENT INDEPENDENCE</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed font-semibold text-amber-900">
            Bidora is an <strong>independent commercial technology software provider</strong>. Bidora is <strong>NOT</strong> an agency, partner, affiliate, broker, authorized dealer, or official representative of any sovereign government, ministry, national procurement authority (including ARMP Cameroon, BPP Nigeria, PPDA Uganda/Kenya), international development bank (World Bank, AfDB, IsDB), or United Nations agency. Tender notices aggregated on Bidora are reproduced for open transparency and analytical indexing. All bid evaluations and contract awards are strictly within the sovereign jurisdiction of the respective Contracting Authorities.
          </p>
        </div>

        {/* Two-Column Layout: Navigation + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Sticky Table of Contents */}
          <aside className="lg:col-span-1 glass-panel rounded-3xl p-5 bg-white border border-slate-200 shadow-sm space-y-3 sticky top-24 hidden lg:block">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider block">
              Agreement Index
            </span>
            <nav className="space-y-1">
              {sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  onClick={() => setActiveSection(sec.id)}
                  className={`block px-3 py-2 rounded-xl text-xs font-bold transition-colors leading-snug ${
                    activeSection === sec.id
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {sec.title}
                </a>
              ))}
            </nav>

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
              Need assistance? Email{' '}
              <a href="mailto:legal@bidora.io" className="text-emerald-600 font-bold hover:underline">
                legal@bidora.io
              </a>
            </div>
          </aside>

          {/* Legal Text Content Body */}
          <div className="lg:col-span-3 glass-panel rounded-3xl p-6 sm:p-10 space-y-10 bg-white border border-slate-200 shadow-sm text-sm text-slate-700 leading-relaxed font-medium">
            
            {/* SECTION 1 */}
            <section id="government-independence" className="space-y-3 scroll-mt-28">
              <div className="flex items-center space-x-2 text-slate-900 font-black text-base md:text-lg">
                <Building className="w-5 h-5 text-emerald-600 shrink-0" />
                <h2>1. Government & Contracting Authority Independence</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bidora operates exclusively as an independent, private procurement intelligence and bidding workflow SaaS platform. Bidora expressly disclaims any formal affiliation, agency agreement, public delegation, or intermediary mandate with:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700">
                <li>Any national, federal, state, provincial, or municipal government department or ministry;</li>
                <li>Any national public procurement regulatory body (such as ARMP, BPP, PPDA, DGCP, or their equivalents);</li>
                <li>Any international financial institution or multilateral development bank (such as the World Bank Group, African Development Bank, European Investment Bank, or United Nations Global Marketplace);</li>
                <li>Any state-owned enterprise (SOE), public hospital, university, or municipal contracting council.</li>
              </ul>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tender announcements, Expressions of Interest (EOI), Requests for Proposals (RFP), and procurement dossiers (Dossier d’Appel d’Offres - DAO) indexed by the Service are gathered from public domain sources under transparency laws. Users must always verify official specifications and submission modalities directly with the issuing Contracting Authority.
              </p>
            </section>

            {/* SECTION 2 */}
            <section id="no-guarantee" className="space-y-3 border-t border-slate-100 pt-8 scroll-mt-28">
              <div className="flex items-center space-x-2 text-slate-900 font-black text-base md:text-lg">
                <Award className="w-5 h-5 text-indigo-600 shrink-0" />
                <h2>2. No Guarantee of Tender Award, Prequalification, or Financial Outcome</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bidora provides analytical decision-support tools, proposal structuring assistance, and pipeline organization. <strong>Under no circumstances does Bidora guarantee, promise, represent, or warrant that:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700">
                <li>Your company or consortium will be prequalified, shortlisted, technically approved, or awarded any public or private contract;</li>
                <li>Any bid submitted using platform-generated documents will satisfy the subjective evaluation criteria of a tender evaluation board;</li>
                <li>Your company will achieve any specific revenue, commercial turnover, or financial return from utilizing the platform.</li>
              </ul>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                All tender evaluation decisions, contract award recommendations, bidder notifications, and bid rejection determinations reside strictly within the sovereign and legal prerogative of the designated Contracting Authority and its Procurement Evaluation Committee.
              </p>
            </section>

            {/* SECTION 3 */}
            <section id="anti-corruption" className="space-y-3 border-t border-slate-100 pt-8 scroll-mt-28">
              <div className="flex items-center space-x-2 text-slate-900 font-black text-base md:text-lg">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <h2>3. Anti-Bribery, Anti-Collusion & Integrity Code of Conduct</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bidora strictly enforces zero-tolerance principles regarding corruption, bribery, illicit payments, and anticompetitive collusion. By utilizing the Service, each user and customer organization explicitly covenants and represents that:
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <p className="font-bold text-slate-900">Mandatory Statutory Compliance:</p>
                <ul className="space-y-1 text-slate-700 list-disc pl-4">
                  <li>Your organization complies with all applicable national Public Procurement Codes, the US Foreign Corrupt Practices Act (FCPA), the UK Bribery Act, the OHADA Uniform Acts, and the African Union Convention on Preventing and Combating Corruption.</li>
                  <li>You shall never utilize the platform to organize, orchestrate, or facilitate <strong>bid rigging, cover bidding, price-fixing cartels, market allocation</strong>, or collusive bidding arrangements with competing bidders.</li>
                  <li>You shall never utilize the platform to facilitate kickbacks, unlawful gratuities, or unauthorized inducements to public procurement officers, consultants, or evaluation panel members.</li>
                </ul>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Any violation of this Anti-Corruption Code will result in instantaneous account termination, permanent platform blacklisting, and reporting to competent judicial and anti-graft law enforcement authorities.
              </p>
            </section>

            {/* SECTION 4 */}
            <section id="user-representations" className="space-y-3 border-t border-slate-100 pt-8 scroll-mt-28">
              <div className="flex items-center space-x-2 text-slate-900 font-black text-base md:text-lg">
                <FileText className="w-5 h-5 text-sky-600 shrink-0" />
                <h2>4. Truthfulness & Authenticity of Company Credentials</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bidora enables companies to self-declare their capability profiles, past references, operational countries, and compliance certifications. The Customer and its authorized representatives explicitly represent and warrant that:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700">
                <li>All corporate registration numbers (including RCCM, Trade Registry, Tax ID, TIN, NIF, CNPS numbers) entered or declared are genuine, active, legally assigned, and unexpired;</li>
                <li>All past project references, balance sheet numbers, and personnel CVs are authentic and free from material misstatement or forgery;</li>
                <li>The Customer assumes <strong>full and exclusive civil, criminal, and administrative liability</strong> for any inaccurate, forged, or misleading information provided in their profile or submitted in their tender dossiers.</li>
              </ul>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bidora does not act as a guarantor, insurer, or notary of user declarations and disclaims all liability resulting from counterfeit or fraudulent submissions made by any user to a Contracting Authority.
              </p>
            </section>

            {/* SECTION 5 */}
            <section id="ai-disclaimer" className="space-y-3 border-t border-slate-100 pt-8 scroll-mt-28">
              <div className="flex items-center space-x-2 text-slate-900 font-black text-base md:text-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <h2>5. AI Analytics & Decision Support Advisory Disclaimer</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The Service incorporates advanced artificial intelligence and automated algorithms to provide Tender Match Scores, AI Executive Summaries, Eligibility Checklists, and Proposal Drafting Blueprints. You acknowledge and agree that:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700">
                <li>AI outputs are advisory aids intended for preliminary operational workflow guidance only;</li>
                <li>AI outputs do not constitute formal legal counsel, certified engineering review, audited financial advice, or official procurement compliance determination;</li>
                <li>Algorithmically derived match scores do not guarantee that a Contracting Authority will deem your submission responsive or compliant;</li>
                <li>The Customer holds the sole and non-delegable duty to verify all technical criteria, submission deadlines, bid bond specifications, and pricing calculations prior to submitting any tender.</li>
              </ul>
            </section>

            {/* SECTION 6 */}
            <section id="liability-indemnity" className="space-y-3 border-t border-slate-100 pt-8 scroll-mt-28">
              <div className="flex items-center space-x-2 text-slate-900 font-black text-base md:text-lg">
                <Scale className="w-5 h-5 text-rose-600 shrink-0" />
                <h2>6. Limitation of Liability & Full Hold-Harmless Indemnification</h2>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs sm:text-sm text-rose-950 space-y-2 leading-relaxed">
                <p className="font-extrabold uppercase">Complete Disclaimer of Consequential Damages:</p>
                <p>
                  To the maximum extent permitted by applicable law, in no event shall Bidora, Inc., its founders, officers, directors, employees, affiliates, or technology licensors be liable for any indirect, special, incidental, punitive, or consequential damages, including without limitation:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Lost profits, loss of anticipated contract revenue, or failed business opportunities;</li>
                  <li>Tender rejection, technical disqualification, or loss of bidding security deposits / bid bonds;</li>
                  <li>Fines, regulatory penalties, debarment sanctions, or legal costs incurred with any Contracting Authority;</li>
                  <li>Technical errors, platform downtime, deadline inaccuracies, or transmission delays.</li>
                </ul>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                <strong>Indemnification Obligation:</strong> You agree to defend, indemnify, and hold harmless Bidora, Inc. and its officers from and against any and all claims, regulatory investigations, fines, lawsuits, damages, and expenses (including reasonable attorneys’ fees) arising out of or related to your tender submissions, business operations, breach of this Agreement, or dispute with any Contracting Authority or joint venture partner.
              </p>
            </section>

            {/* SECTION 7 */}
            <section id="subcontracting" className="space-y-3 border-t border-slate-100 pt-8 scroll-mt-28">
              <div className="flex items-center space-x-2 text-slate-900 font-black text-base md:text-lg">
                <Globe className="w-5 h-5 text-indigo-600 shrink-0" />
                <h2>7. Subcontractor & Consortium Disclaimers</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bidora provides a directory of local and regional subcontractors and potential consortium partners. Bidora does not act as an employer, guarantor, general contractor, or surety for any listed entity. All joint venture agreements (Groupements Momentanés d’Entreprises) and subcontracting arrangements are strictly private civil contracts negotiated solely between the participating entities.
              </p>
            </section>

            {/* SECTION 8 */}
            <section id="confidentiality" className="space-y-3 border-t border-slate-100 pt-8 scroll-mt-28">
              <div className="flex items-center space-x-2 text-slate-900 font-black text-base md:text-lg">
                <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
                <h2>8. Multi-Tenant Confidentiality & Trade Secret Protection</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bidora recognizes that customer pricing schedules, unit costs (Bordereaux de Prix Unitaires), technical blueprints, and capability dossiers constitute high-value commercial trade secrets. Bidora enforces strict multi-tenant isolation, row-level security, and 256-bit encryption. Customer bidding strategies, financial margins, and unpublished proposals remain the exclusive property of the customer and are never shared with competing bidders, commercial buyers, or unauthorized third parties.
              </p>
            </section>

            {/* SECTION 9 */}
            <section id="sanctions" className="space-y-3 border-t border-slate-100 pt-8 scroll-mt-28">
              <div className="flex items-center space-x-2 text-slate-900 font-black text-base md:text-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <h2>9. International Sanctions & Debarment Compliance</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The Customer warrants that neither the Customer, its parent company, subsidiaries, nor its ultimate beneficial owners are currently subject to economic sanctions or debarment lists administered by the United Nations Security Council, the World Bank Sanctions Board, the African Development Bank, OFAC, or competent national procurement regulatory authorities.
              </p>
            </section>

            {/* SECTION 10 */}
            <section id="governing-law" className="space-y-3 border-t border-slate-100 pt-8 scroll-mt-28">
              <div className="flex items-center space-x-2 text-slate-900 font-black text-base md:text-lg">
                <Scale className="w-5 h-5 text-slate-900 shrink-0" />
                <h2>10. Dispute Resolution & Governing Jurisdiction</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                This Agreement shall be governed by and construed in accordance with standard international commercial law principles. Any dispute, controversy, or claim arising out of or relating to this Agreement, including the breach, termination, or invalidity thereof, shall be settled by final and binding arbitration under the Rules of Arbitration of the International Chamber of Commerce (ICC) or OHADA Common Court of Justice and Arbitration (CCJA), without recourse to ordinary state courts.
              </p>
            </section>

            {/* Contact & Acceptance Callout */}
            <div className="pt-8 border-t border-slate-200 text-xs text-slate-500 space-y-2">
              <p className="font-bold text-slate-800">
                Official Legal Contact for Regulatory & Procurement Inquiries:
              </p>
              <p>
                Bidora Legal Operations & Regulatory Compliance Division • Email:{' '}
                <a href="mailto:legal@bidora.io" className="text-emerald-700 font-black hover:underline">
                  legal@bidora.io
                </a>
              </p>
              <p className="text-[11px] text-slate-400">
                By registering, submitting company data, or accessing tender intelligence on Bidora, you irrevocably confirm that you have read, understood, and agreed to be bound by all provisions of this Master Agreement.
              </p>
            </div>

          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
