import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { TenderSourceConnector, RawTenderInput } from './tender-source.interface';

/**
 * Live Connector for Kenya Public Procurement Information Portal (PPIP)
 */
@Injectable()
export class PpipKenyaConnector implements TenderSourceConnector {
  private readonly logger = new Logger(PpipKenyaConnector.name);

  readonly sourceId = 'ke-ppip-tenders';
  readonly sourceName = 'Kenya Public Procurement Information Portal (PPIP)';
  readonly country = 'Kenya';
  readonly method = 'HTML';
  readonly checkFrequency = 'Hourly';

  async fetchNewTenders(): Promise<RawTenderInput[]> {
    const results: RawTenderInput[] = [];
    try {
      this.logger.log('Fetching live tenders from Kenya PPIP Portal (tenders.go.ke)...');
      const response = await axios.get('https://tenders.go.ke', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        timeout: 15000,
      });

      const $ = cheerio.load(response.data);
      $('tr, .tender-card, .notice-item').each((idx, el) => {
        const text = $(el).text().trim();
        const link = $(el).find('a').attr('href');
        if (text && text.length > 15 && link) {
          const fullUrl = link.startsWith('http') ? link : `https://tenders.go.ke${link}`;
          results.push({
            title: text.split('\n')[0].substring(0, 150),
            refNumber: `PPIP-KE-${Date.now().toString().slice(-6)}-${idx}`,
            buyerName: 'Government of Kenya — PPIP Portal',
            buyerCountry: 'Kenya',
            industry: 'Public Procurement Kenya',
            estimatedValue: 0,
            currency: 'KES',
            publishDate: new Date().toISOString(),
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            description: text.substring(0, 400),
            rawContent: text,
            sourceUrl: fullUrl,
          });
        }
      });
    } catch (err: any) {
      this.logger.warn(`PPIP Kenya live crawl warning: ${err.message}`);
    }
    return results;
  }
}
