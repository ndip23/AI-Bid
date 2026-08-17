import { Company, SavedTender, Tender, User, NotificationItem } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface ProcurementSourceItem {
  id: string;
  country: string;
  sourceName: string;
  method: string;
  frequency: string;
  status: string;
  lastSyncAt: string;
  totalIngested: number;
}

function sanitizeErrorMessage(errData: any, fallbackMsg: string): string {
  let rawMsg = '';
  if (typeof errData === 'string') {
    rawMsg = errData;
  } else if (errData && typeof errData.message === 'string') {
    rawMsg = errData.message;
  } else if (errData && Array.isArray(errData.message)) {
    rawMsg = errData.message.join('. ');
  }

  if (
    !rawMsg ||
    /prisma|sql|invocation|column|syntax|undefined|null|table|findunique|exception|stack|nest/i.test(rawMsg)
  ) {
    return fallbackMsg;
  }

  return rawMsg;
}

export class ApiClient {
  private static getHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // Auth Methods
  static async login(email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(sanitizeErrorMessage(err, 'Invalid work email or password. Please check your credentials and try again.'));
    }
    return await res.json();
  }

  static async register(data: { email: string; password: string; username?: string; firstName?: string; lastName?: string; companyName?: string; industry?: string }) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(sanitizeErrorMessage(err, 'Could not complete registration. Please verify your details or try a different work email.'));
    }
    return await res.json();
  }

  static async getCompanyProfile(): Promise<Company | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/company/profile`, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to fetch company profile', e);
    }
    return null;
  }

  static async updateCompanyProfile(data: Partial<Company>): Promise<Company> {
    const res = await fetch(`${API_BASE_URL}/company/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error('Failed to update company profile');
    }
    return await res.json();
  }

  static async getTenders(params?: { search?: string; industry?: string; country?: string; minScore?: number }): Promise<Tender[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.industry) queryParams.append('industry', params.industry);
      if (params?.country) queryParams.append('country', params.country);
      if (params?.minScore) queryParams.append('minScore', String(params.minScore));

      const res = await fetch(`${API_BASE_URL}/tenders?${queryParams.toString()}`, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to fetch tenders', e);
    }
    return [];
  }

  static async getTenderDetails(id: string): Promise<Tender> {
    const res = await fetch(`${API_BASE_URL}/tenders/${id}`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Tender not found');
    return await res.json();
  }

  static async saveTender(tenderId: string, status: string, notes?: string) {
    const res = await fetch(`${API_BASE_URL}/tenders/${tenderId}/save`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ status, notes }),
    });
    if (!res.ok) throw new Error('Failed to save tender');
    return await res.json();
  }

  static async unsaveTender(tenderId: string) {
    const res = await fetch(`${API_BASE_URL}/tenders/${tenderId}/save`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to remove tender from saved pipeline');
    return await res.json();
  }

  static async getSavedTenders(): Promise<SavedTender[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/tenders/saved`, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to fetch saved tenders', e);
    }
    return [];
  }

  static async getNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/notifications`, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to fetch notifications', e);
    }
    return [];
  }

  static async getProcurementSources(): Promise<ProcurementSourceItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/sources`, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to fetch procurement sources', e);
    }
    return [];
  }

  static async syncProcurementSource(id: string) {
    const res = await fetch(`${API_BASE_URL}/sources/${id}/sync`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to sync procurement source');
    return await res.json();
  }

  static async getAdminStats() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/stats`, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to fetch admin stats', e);
    }
    return {
      totalTenders: 0,
      openTenders: 0,
      totalCompanies: 0,
      totalUsers: 0,
      totalSaved: 0,
      totalOpenOpportunityValue: 0,
      recentTenders: [],
    };
  }

  static async createTender(data: any) {
    const res = await fetch(`${API_BASE_URL}/tenders`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create tender');
    return await res.json();
  }
}
