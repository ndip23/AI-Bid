import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { TenderSourceConnector, RawTenderInput } from './tender-source.interface';

/**
 * Live Connector for Nigeria Bureau of Public Procurement (BPP)
 */
@Injectable()
export class BppNigeriaConnector implements TenderSourceConnector {
  private readonly logger = new Logger(BppNigeriaConnector.name);

  readonly sourceId = 'ng-bpp-nopo';
  readonly sourceName = 'Nigeria Bureau of Public Procurement (BPP)';
  readonly country = 'Nigeria';
  readonly method = 'HTML';
  readonly checkFrequency = 'Hourly';

  async fetchNewTenders(): Promise<RawTenderInput[]> {
    const results: RawTenderInput[] = [];
    try {
      this.logger.log('Fetching live tenders from Nigeria BPP Portal (bpp.gov.ng)...');
      const response = await axios.get('https://www.bpp.gov.ng/tenders', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        timeout: 15000,
      });

      const $ = cheerio.load(response.data);
      $('tr, .tender-item, article').each((idx, el) => {
        const text = $(el).text().trim();
        const link = $(el).find('a').attr('href');
        if (text && text.length > 15 && link) {
          const fullUrl = link.startsWith('http') ? link : `https://www.bpp.gov.ng${link}`;
          results.push({
            title: text.split('\n')[0].substring(0, 150),
            refNumber: `BPP-NG-${Date.now().toString().slice(-6)}-${idx}`,
            buyerName: 'Federal Republic of Nigeria — BPP',
            buyerCountry: 'Nigeria',
            industry: 'Public Procurement Nigeria',
            estimatedValue: 0,
            currency: 'NGN',
            publishDate: new Date().toISOString(),
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            description: text.substring(0, 400),
            rawContent: text,
            sourceUrl: fullUrl,
          });
        }
      });
    } catch (err: any) {
      this.logger.warn(`BPP Nigeria live crawl warning: ${err.message}`);
    }
    return results;
  }
}
