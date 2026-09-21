import { Company, SavedTender, Tender, User, NotificationItem } from '../types';

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
const API_BASE_URL = rawApiUrl.endsWith('/api/v1')
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/+$/, '')}/api/v1`;

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

  static async updateProfile(data: { username?: string; email?: string }): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(sanitizeErrorMessage(err, 'Failed to update personal details.'));
    }
    return await res.json();
  }

  static async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(sanitizeErrorMessage(err, 'Failed to change password. Please verify your current password.'));
    }
    return await res.json();
  }

  static handleAuthFailure() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('company');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
  }

  static async getCompanyProfile(): Promise<Company | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/company/profile`, { headers: this.getHeaders() });
      if (res.status === 401) {
        this.handleAuthFailure();
        return null;
      }
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
    if (res.status === 401) {
      this.handleAuthFailure();
      throw new Error('Session expired. Please sign in again.');
    }
    if (!res.ok) {
      throw new Error('Failed to update company profile');
    }
    this.tendersCache = null;
    return await res.json();
  }

  private static tendersCache: { key: string; data: Tender[]; timestamp: number } | null = null;
  private static tenderDetailsCache = new Map<string, { data: Tender; timestamp: number }>();

  static clearTendersCache() {
    this.tendersCache = null;
    this.tenderDetailsCache.clear();
  }

  static getCachedTender(id: string): Tender | null {
    const cached = this.tenderDetailsCache.get(id);
    if (cached && (Date.now() - cached.timestamp) < 5 * 60 * 1000) {
      return cached.data;
    }
    // Also check if available from the list cache
    if (this.tendersCache?.data) {
      const found = this.tendersCache.data.find((t) => t.id === id);
      if (found) return found;
    }
    return null;
  }

  static async prefetchTenderDetails(id: string): Promise<void> {
    if (!id) return;
    const cached = this.tenderDetailsCache.get(id);
    if (cached && (Date.now() - cached.timestamp) < 3 * 60 * 1000) return;
    this.getTenderDetails(id).catch(() => {});
  }

  static async getTenders(params?: { search?: string; industry?: string; country?: string; minScore?: number; limit?: number; offset?: number }): Promise<Tender[]> {
    const key = JSON.stringify(params || {});
    const now = Date.now();
    if (this.tendersCache && this.tendersCache.key === key && (now - this.tendersCache.timestamp) < 180000) {
      return this.tendersCache.data;
    }

    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.industry) queryParams.append('industry', params.industry);
    if (params?.country) queryParams.append('country', params.country);
    if (params?.minScore) queryParams.append('minScore', String(params.minScore));
    queryParams.append('limit', String(params?.limit || 1000));
    if (params?.offset) queryParams.append('offset', String(params.offset));

    const url = `${API_BASE_URL}/tenders?${queryParams.toString()}`;
    const maxRetries = 2;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch(url, { headers: this.getHeaders() });

        if (res.status === 401) {
          this.handleAuthFailure();
          throw new Error('UNAUTHORIZED: Session expired. Please log in again.');
        }

        if (res.ok) {
          const data = await res.json();
          this.tendersCache = { key, data, timestamp: now };
          // Seed tenderDetailsCache with basic items so clicking them is instantly fast
          if (Array.isArray(data)) {
            data.slice(0, 30).forEach((t) => {
              if (t?.id && !this.tenderDetailsCache.has(t.id)) {
                this.tenderDetailsCache.set(t.id, { data: t, timestamp: now });
              }
            });
          }
          return data;
        }

        // On server error / gateway timeout (e.g. Render free-tier cold spin up)
        if (res.status >= 500 && attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
          continue;
        }

        throw new Error(`Server returned HTTP ${res.status}`);
      } catch (e: any) {
        if (e?.message?.includes('UNAUTHORIZED')) {
          throw e;
        }
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
          continue;
        }
        console.error('Failed to fetch tenders after retries:', e);
        throw e;
      }
    }
    return [];
  }

  static async getTenderDetails(id: string): Promise<Tender> {
    const cached = this.tenderDetailsCache.get(id);
    const now = Date.now();
    // If full detail (with aiSummary) is already cached, return immediately
    if (cached && (cached.data as any)?.aiSummary && (now - cached.timestamp) < 180000) {
      return cached.data;
    }

    const res = await fetch(`${API_BASE_URL}/tenders/${id}`, { headers: this.getHeaders() });
    if (!res.ok) {
      if (cached?.data) return cached.data;
      throw new Error('Tender not found');
    }
    const data = await res.json();
    this.tenderDetailsCache.set(id, { data, timestamp: now });
    return data;
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

  static async markNotificationAsRead(id: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to mark notification as read', e);
    }
  }

  static async markAllNotificationsAsRead() {
    try {
      const res = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to mark all notifications as read', e);
    }
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

  static async getAdminCompanies() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/companies`, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to fetch admin companies', e);
    }
    return [];
  }

  static async getAdminUsers() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users`, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to fetch admin users', e);
    }
    return [];
  }

  static async getDailyFreshnessStatus() {
    try {
      const res = await fetch(`${API_BASE_URL}/publishers/daily-freshness/status`, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to fetch freshness status', e);
    }
    return null;
  }

  static async triggerDailyFreshness(target = 15) {
    const res = await fetch(`${API_BASE_URL}/publishers/daily-freshness`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ target }),
    });
    if (!res.ok) throw new Error('Failed to trigger daily freshness engine');
    return await res.json();
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

  // Multi-Channel Alerts & Notification Preferences
  static async getNotificationPreferences() {
    try {
      const res = await fetch(`${API_BASE_URL}/notifications/preferences`, {
        headers: this.getHeaders(),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to get notification preferences', e);
    }
    return null;
  }

  static async updateNotificationPreferences(data: any) {
    const res = await fetch(`${API_BASE_URL}/notifications/preferences`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update alert preferences');
    }
    return await res.json();
  }

  static async testDispatchAlert(data: {
    channel: 'WHATSAPP' | 'EMAIL' | 'SMS';
    targetPhone?: string;
    targetEmail?: string;
    tenderId?: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/notifications/test-dispatch`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to dispatch test alert');
    }
    return await res.json();
  }

  static async getAlertLogs() {
    try {
      const res = await fetch(`${API_BASE_URL}/notifications/alert-logs`, {
        headers: this.getHeaders(),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to fetch alert logs', e);
    }
    return [];
  }
}

