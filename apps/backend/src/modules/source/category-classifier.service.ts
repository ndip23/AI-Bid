import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryClassifierService {
  private readonly keywordMap: Record<string, string[]> = {
    'Cloud & IT Infrastructure': [
      'software', 'it', 'telecom', 'telecommunication', 'network', 'fiber', 'fibre',
      'cloud', 'cyber', 'cybersecurity', 'digital', 'informatique', 'data', 'database', 'system',
      'platform', 'plateforme', 'licence', 'license', 'server', 'application', 'logiciel',
      'hardware', 'smart city', 'automation', 'portal', 'erp', 'crm', 'ai', 'internet',
      'digitization', 'numérique', 'numerique', 'computer', 'e-procurement', 'technologie'
    ],
    'Healthcare & Medical Systems': [
      'health', 'medical', 'hospital', 'pharmaceutical', 'sante', 'santé', 'médical',
      'hopital', 'medicine', 'vaccine', 'laboratory', 'laboratoire', 'clinical',
      'biomedical', 'covid', 'disease', 'patient', 'clinic', 'malaria', 'sanitary',
      'nutrition', 'epidemic', 'sanitation project', 'hygiene'
    ],
    'Renewable Energy & Solar Power': [
      'energy', 'power', 'solar', 'electricity', 'solaire', 'electricite', 'électricité',
      'grid', 'microgrid', 'hydroelectric', 'renewable', 'transformer', 'substation',
      'lighting', 'photovoltaic', 'electrification', 'battery', 'generator', 'clean energy'
    ],
    'Education & Training': [
      'education', 'school', 'university', 'training', 'formation', 'ecole', 'école',
      'enseignant', 'e-learning', 'academic', 'curriculum', 'classroom', 'student',
      'scholarship', 'pedagogique', 'learning'
    ],
    'Consulting & Governance': [
      'consulting', 'consultant', 'advisory', 'audit', 'strategy', 'technical assistance',
      'assistance technique', 'governance', 'fiscal', 'tax reform', 'capacity building',
      'evaluation', 'study', 'étude', 'etude', 'feasibility', 'faisabilité', 'economic',
      'public sector effectiveness', 'policy', 'institutional'
    ],
    'Transport & Logistics': [
      'transport', 'logistics', 'vehicle', 'fleet', 'véhicule', 'shipping', 'freight',
      'cargo', 'transit', 'port', 'maritime', 'aviation', 'airport', 'railway', 'ferroviaire'
    ],
    'Agriculture & Water Resources': [
      'agriculture', 'farming', 'crop', 'livestock', 'irrigation', 'fertilizer', 'agricole',
      'elevage', 'seed', 'water supply', 'eau potable', 'forest', 'forêt', 'fisheries', 'pêche'
    ],
    'Civil Infrastructure & Construction': [
      'construction', 'building', 'civil works', 'travaux', 'bâtiment', 'routier',
      'road', 'highway', 'bridge', 'pont', 'rehabilitation', 'paving', 'génie civil',
      'housing', 'drainage', 'forage', 'drilling', 'concrete', 'asphalt'
    ],
  };

  /**
   * Classifies tender title, description, and sector text into weighted categories.
   */
  classify(title: string, description?: string, sector?: string): { primaryCategory: string; allCategories: string[] } {
    const textToScan = `${title} ${description || ''} ${sector || ''}`.toLowerCase();
    let bestCategory = 'Civil Infrastructure & Construction';
    let highestScore = 0;
    const allMatches: string[] = [];

    for (const [category, keywords] of Object.entries(this.keywordMap)) {
      let score = 0;
      for (const kw of keywords) {
        if (title.toLowerCase().includes(kw)) score += 5;
        if (sector && sector.toLowerCase().includes(kw)) score += 4;
        if (textToScan.includes(kw)) score += 1;
      }

      if (score > 0) {
        allMatches.push(category);
      }

      if (score > highestScore) {
        highestScore = score;
        bestCategory = category;
      }
    }

    return {
      primaryCategory: bestCategory,
      allCategories: allMatches.length > 0 ? allMatches : [bestCategory],
    };
  }

  /**
   * Determines OpportunityType based on title and description keywords (Bilingual FR/EN).
   */
  classifyOpportunityType(title: string, description?: string): string {
    const text = `${title} ${description || ''}`.toLowerCase();

    if (text.includes('sous-traitant') || text.includes('sous-traitance') || text.includes('subcontract') || text.includes('sub-contract') || text.includes('partner wanted') || text.includes('partenaire recherché')) {
      return 'SUBCONTRACTING';
    }
    if (text.includes('demande de cotation') || text.includes('request for quotation') || text.includes('rfq') || text.includes('call for quotation')) {
      return 'REQUEST_FOR_QUOTATION';
    }
    if (text.includes('demande de proposition') || text.includes('request for proposal') || text.includes('rfp')) {
      return 'REQUEST_FOR_PROPOSAL';
    }
    if (text.includes('manifestation d\'intérêt') || text.includes('manifestation d’intérêt') || text.includes('expression of interest') || text.includes('eoi')) {
      return 'EXPRESSION_OF_INTEREST';
    }
    if (text.includes('demande d\'information') || text.includes('request for information') || text.includes('rfi')) {
      return 'REQUEST_FOR_INFORMATION';
    }
    if (text.includes('enregistrements des fournisseurs') || text.includes('vendor registration') || text.includes('supplier registration') || text.includes('répertoire des fournisseurs')) {
      return 'VENDOR_REGISTRATION';
    }
    if (text.includes('opportunité d\'affaires') || text.includes('business opportunity') || text.includes('partenariat')) {
      return 'BUSINESS_OPPORTUNITY';
    }
    if (text.includes('private tender') || text.includes('private procurement')) {
      return 'PRIVATE_TENDER';
    }
    if (text.includes('world bank') || text.includes('ungm') || text.includes('afdb') || text.includes('donor')) {
      return 'DONOR_PROCUREMENT';
    }
    return 'PUBLIC_TENDER';
  }

  /**
   * Determines SourceCategory based on publisher name, organization type, and text.
   */
  classifySourceCategory(publisherName?: string, orgType?: string, text?: string): string {
    const name = (publisherName || '').toLowerCase();
    const txt = (text || '').toLowerCase();
    const type = (orgType || '').toUpperCase();

    if (name.includes('bstp') || txt.includes('bstp') || txt.includes('sous-traitance')) {
      return 'SUBCONTRACTING';
    }
    if (name.includes('world bank') || name.includes('ungm') || name.includes('afdb') || name.includes('banque mondiale')) {
      return 'DONOR_PROCUREMENT';
    }
    if (name.includes('port autonome') || name.includes('pak') || name.includes('pad') || name.includes('camwater') || name.includes('sonatrel') || type === 'STATE_OWNED_ENTERPRISE') {
      return 'STATE_OWNED_ENTERPRISE';
    }
    if (type === 'PUBLIC_UNIVERSITY' || name.includes('université') || name.includes('university')) {
      return 'UNIVERSITY';
    }
    if (type === 'TEACHING_HOSPITAL' || name.includes('hôpital') || name.includes('hospital') || name.includes('minsante')) {
      return 'HEALTHCARE';
    }
    if (type === 'REGIONAL_COUNCIL' || type === 'MUNICIPALITY' || name.includes('commune') || name.includes('mairie') || name.includes('council')) {
      return 'MUNICIPAL';
    }
    if (type === 'NGO' || name.includes('ngo') || name.includes('ong')) {
      return 'NGO_PROCUREMENT';
    }
    if (type === 'PRIVATE_PROCUREMENT' || name.includes('eneo') || name.includes('mtn') || name.includes('orange') || name.includes('camtel')) {
      return 'PRIVATE_PROCUREMENT';
    }
    return 'GOVERNMENT';
  }

  /**
   * Determines BuyerType based on publisher name, organization type, and buyer name.
   */
  classifyBuyerType(publisherName?: string, orgType?: string, buyerName?: string): string {
    const combined = `${publisherName || ''} ${orgType || ''} ${buyerName || ''}`.toLowerCase();

    if (combined.includes('port autonome') || combined.includes('pak') || combined.includes('pad') || combined.includes('camwater') || combined.includes('sonatrel') || combined.includes('state_owned_enterprise')) {
      return 'STATE_OWNED_ENTERPRISE';
    }
    if (combined.includes('university') || combined.includes('université') || combined.includes('public_university')) {
      return 'UNIVERSITY';
    }
    if (combined.includes('hospital') || combined.includes('hôpital') || combined.includes('minsante') || combined.includes('teaching_hospital')) {
      return 'HOSPITAL';
    }
    if (combined.includes('ngo') || combined.includes('ong') || combined.includes('unicef') || combined.includes('undp') || combined.includes('who')) {
      return 'NGO';
    }
    if (combined.includes('eneo') || combined.includes('mtn') || combined.includes('orange') || combined.includes('camtel') || combined.includes('private')) {
      return 'PRIVATE_COMPANY';
    }
    return 'GOVERNMENT';
  }

  /**
   * Determines BuyerIntent based on title and description (Bilingual FR/EN).
   */
  classifyBuyerIntent(title: string, description?: string): string {
    const text = `${title} ${description || ''}`.toLowerCase();

    if (text.includes('recrutement') || text.includes('embauche') || text.includes('hiring') || text.includes('consultant individuel')) {
      return 'HIRE';
    }
    if (text.includes('sous-traitant') || text.includes('subcontract')) {
      return 'SUBCONTRACT';
    }
    if (text.includes('partenaire') || text.includes('partner') || text.includes('joint venture')) {
      return 'PARTNER';
    }
    if (text.includes('fournitures') || text.includes('fournisseur') || text.includes('supply') || text.includes('equipment') || text.includes('livraison')) {
      return 'SUPPLY';
    }
    if (text.includes('travaux') || text.includes('construction') || text.includes('building') || text.includes('réhabilitation')) {
      return 'CONSTRUCT';
    }
    if (text.includes('maintenance') || text.includes('entretien') || text.includes('servicing')) {
      return 'MAINTAIN';
    }
    if (text.includes('étude') || text.includes('consultance') || text.includes('consulting') || text.includes('audit')) {
      return 'CONSULT';
    }
    if (text.includes('enregistrement') || text.includes('registration') || text.includes('gréement')) {
      return 'REGISTER_VENDOR';
    }
    if (text.includes('externalisation') || text.includes('outsource')) {
      return 'OUTSOURCE';
    }
    return 'BUY';
  }
}
