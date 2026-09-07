export type UserRole = 'SUPER_ADMIN' | 'COMPANY_USER';

export type SavedStatus = 'BOOKMARKED' | 'UNDER_REVIEW' | 'BIDDING' | 'PASSED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TenderStatus = 'OPEN' | 'CLOSED' | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  username?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  companyId?: string | null;
  company?: Company | null;
}

export interface Company {
  id: string;
  name: string;
  taxId?: string;
  industry: string;
  countries: string[];
  certifications: string[];
  services: string[];
  annualRevenue?: string;
  teamSize: number;
  website?: string;
  description?: string;
  users?: User[];
}

export interface ExtractedRequirement {
  id: string;
  category: 'Certification' | 'Technical' | 'Compliance' | 'Financial' | 'Geography';
  description: string;
  isMandatory: boolean;
}

export interface ExtractedRisk {
  id: string;
  risk: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  mitigation: string;
}

export interface AiSummary {
  id: string;
  tenderId: string;
  executiveSummary: string;
  requirements: ExtractedRequirement[];
  deliverables: string[];
  deadlineSummary: string;
  risks: ExtractedRisk[];
}

export interface MatchCalculation {
  overallScore: number;
  industryMatchScore: number;
  countryMatchScore: number;
  certMatchScore: number;
  experienceScore: number;
  reasons: string[];
  metRequirements: string[];
  missingRequirements: string[];
}

export interface Tender {
  id: string;
  title: string;
  refNumber: string;
  buyerName: string;
  buyerCountry: string;
  industry: string;
  estimatedValue: number;
  currency: string;
  publishDate: string;
  deadline: string;
  description: string;
  rawContent: string;
  status: TenderStatus;
  sourceUrl?: string;
  attachments?: string[];
  aiSummary?: AiSummary | null;
  matchScore?: number | null;
  matchDetails?: MatchCalculation | null;
  isSaved?: boolean;
  savedStatus?: SavedStatus | null;
}

export interface SavedTender {
  id: string;
  companyId: string;
  tenderId: string;
  status: SavedStatus;
  priority: Priority;
  notes?: string;
  tender: Tender;
  matchDetails?: MatchCalculation | null;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}
