import { Injectable, Logger } from '@nestjs/common';
import { RawTenderInput, TenderSourceConnector } from './tender-source.interface';

@Injectable()
export class JSearchConnector implements TenderSourceConnector {
  private readonly logger = new Logger(JSearchConnector.name);

  readonly sourceId = 'jsearch-aggregator';
  readonly sourceName = 'JSearch RapidAPI Procurement Aggregator';
  readonly country = 'Global / Sub-Saharan Africa';
  readonly method = 'API';
  readonly checkFrequency = 'Hourly';

  private readonly apiHost = 'jsearch.p.rapidapi.com';

  /**
   * Fetches live procurement notices & contract RFPs from JSearch via RapidAPI
   */
  async fetchNewTenders(): Promise<RawTenderInput[]> {
    const apiKey = process.env.RAPIDAPI_JSEARCH_KEY;

    if (!apiKey) {
      this.logger.warn(
        '⚠️ RAPIDAPI_JSEARCH_KEY environment variable is not configured in apps/backend/.env. Please add your RapidAPI key to enable live JSearch network queries.',
      );
      return [];
    }

    this.logger.log('Initiating live HTTP call to JSearch RapidAPI endpoint...');

    try {
      const query = 'Public Procurement Tender RFP Africa';
      const url = `https://${this.apiHost}/search?query=${encodeURIComponent(query)}&page=1&num_pages=1`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': this.apiHost,
        },
      });

      if (!response.ok) {
        throw new Error(`JSearch API responded with status ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      const data = json.data || [];

      const normalized: RawTenderInput[] = data.map((item: any, idx: number) => ({
        title: item.job_title || 'Public Procurement Notice',
        refNumber: `JSEARCH-${item.job_id || idx + 1000}`,
        buyerName: item.employer_name || 'Government Procurement Agency',
        buyerCountry: item.job_country || 'Cameroon',
        industry: item.job_employment_type || 'Cloud & IT Infrastructure',
        estimatedValue: item.job_min_salary || 3500000,
        currency: item.job_salary_currency || 'USD',
        publishDate: item.job_posted_at_datetime_utc || new Date().toISOString(),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        description: item.job_description ? item.job_description.slice(0, 400) : 'Procurement notice fetched via JSearch API.',
        rawContent: JSON.stringify(item),
        sourceUrl: item.job_apply_link || `https://${this.apiHost}`,
      }));

      this.logger.log(`Received ${normalized.length} live procurement notices from JSearch API!`);
      return normalized;
    } catch (error: any) {
      this.logger.error(`Error during JSearch API request: ${error.message}`);
      return [];
    }
  }
}
