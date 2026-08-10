import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryClassifierService {
  private readonly keywordMap: Record<string, string[]> = {
    'Construction': [
      'construction', 'building', 'civil works', 'travaux', 'bâtiment', 'routier', 'road', 'infrastructure',
      'highway', 'bridge', 'pont', 'rehabilitation', 'engineering', 'génie civil', 'architectural', 'drilling', 'forage'
    ],
    'IT & Telecom': [
      'software', 'hardware', 'it', 'telecom', 'network', 'fiber', 'fibre', 'cloud', 'cybersecurity', 'digital',
      'informatique', 'data', 'database', 'system', 'licence', 'server', 'application', 'logiciel', 'telecommunication'
    ],
    'Healthcare': [
      'health', 'medical', 'hospital', 'pharmaceutical', 'sante', 'médical', 'hopital', 'medicine', 'vaccine',
      'laboratory', 'laboratoire', 'clinical', 'biomedical', 'equipment medical'
    ],
    'Agriculture': [
      'agriculture', 'farming', 'crop', 'livestock', 'irrigation', 'fertilizer', 'engrais', 'agricole',
      'elevage', 'seed', 'semence', 'pesticide', 'rural development'
    ],
    'Consulting': [
      'consulting', 'consultant', 'advisory', 'study', 'étude', 'audit', 'strategy', 'technical assistance',
      'assistance technique', 'evaluation', 'expert', 'expertise'
    ],
    'Education': [
      'education', 'school', 'university', 'training', 'formation', 'ecole', 'enseignant', 'e-learning',
      'academic', 'pedagogique', 'student'
    ],
    'Transport & Logistics': [
      'transport', 'logistics', 'vehicle', 'fleet', 'véhicule', 'shipping', 'freight', 'cargo',
      'transit', 'supply chain', 'aviation', 'maritime'
    ],
    'Energy': [
      'energy', 'power', 'solar', 'electricity', 'solaire', 'electricite', 'grid', 'microgrid', 'hydroelectric',
      'renewable', 'fossil', 'generator', 'groupe electrogene', 'transformer'
    ],
    'Security': [
      'security', 'surveillance', 'guarding', 'gardiennage', 'sécurité', 'cctv', 'defense', 'access control',
      'fire safety', 'sécurité incendie'
    ],
    'Office Supplies': [
      'office supplies', 'stationery', 'paper', 'furniture', 'fournitures de bureau', 'papeterie',
      'mobilier de bureau', 'printer paper', 'consumables'
    ],
    'Equipment': [
      'equipment', 'machinery', 'tools', 'outillage', 'équipement', 'heavy machinery', 'spare parts',
      'pièces de rechange', 'maintenance equipment'
    ],
    'Professional Services': [
      'legal', 'accounting', 'comptabilité', 'audit financier', 'cleaning', 'nettoyage', 'catering',
      'restauration', 'translation', 'traduction', 'public relations', 'marketing'
    ],
    'Environmental Services': [
      'environment', 'waste', 'recycling', 'dechets', 'assainissement', 'sanitation', 'water supply',
      'eau potable', 'conservation', 'climate change', 'changement climatique'
    ],
  };

  /**
   * Classifies tender title, description, and sector text into one or more niche categories.
   */
  classify(title: string, description?: string, sector?: string): { primaryCategory: string; allCategories: string[] } {
    const textToScan = `${title} ${description || ''} ${sector || ''}`.toLowerCase();
    const matchedCategories = new Set<string>();

    for (const [category, keywords] of Object.entries(this.keywordMap)) {
      for (const kw of keywords) {
        if (textToScan.includes(kw)) {
          matchedCategories.add(category);
          break;
        }
      }
    }

    const categoriesArray = Array.from(matchedCategories);
    if (categoriesArray.length === 0) {
      return { primaryCategory: 'Other', allCategories: ['Other'] };
    }

    return {
      primaryCategory: categoriesArray[0],
      allCategories: categoriesArray,
    };
  }
}
