import { Company } from '../types';

export interface ProfileCompleteness {
  isComplete: boolean;
  missingFields: string[];
}

export function checkProfileCompleteness(company: Company | null | undefined): ProfileCompleteness {
  if (!company) {
    return {
      isComplete: false,
      missingFields: [
        'Tax ID / Trade Registry (RCCM)',
        'Compliance Certifications',
        'Technical Services & Capabilities',
        'Target Operating Countries',
        'Company Overview & Track Record',
      ],
    };
  }

  const missing: string[] = [];
  if (!company.taxId || !company.taxId.trim()) {
    missing.push('Tax ID / Trade Registry (RCCM)');
  }
  if (!company.certifications || company.certifications.length === 0) {
    missing.push('Compliance Certifications (e.g. ISO, ARMP, NITDA)');
  }
  if (!company.services || company.services.length === 0) {
    missing.push('Technical Capabilities & Key Services');
  }
  if (!company.countries || company.countries.length === 0) {
    missing.push('Target Operating Countries & Markets');
  }
  if (!company.description || company.description.trim().length < 10) {
    missing.push('Company Overview & Track Record');
  }

  return {
    isComplete: missing.length === 0,
    missingFields: missing,
  };
}
