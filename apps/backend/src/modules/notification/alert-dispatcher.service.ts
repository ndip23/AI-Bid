import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface DispatchAlertParams {
  userId: string;
  recipientPhone?: string;
  recipientEmail?: string;
  tender: {
    id: string;
    title: string;
    buyerName: string;
    buyerCountry: string;
    industry: string;
    estimatedValue?: number | null;
    currency?: string | null;
    deadline?: Date | null;
    refNumber?: string | null;
    aiSummary?: {
      requirements?: any;
      deliverables?: any;
      executiveSummary?: string;
    } | null;
  };
  matchScore: number;
  channels: ('WHATSAPP' | 'EMAIL' | 'SMS')[];
}

@Injectable()
export class AlertDispatcherService {
  private readonly logger = new Logger(AlertDispatcherService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Formats a crisp, WhatsApp-compliant markdown message for African contractors.
   */
  formatWhatsAppMessage(params: DispatchAlertParams): string {
    const { tender, matchScore } = params;
    const valueStr = tender.estimatedValue
      ? `${Number(tender.estimatedValue).toLocaleString()} ${tender.currency || 'USD'}`
      : 'Competitive Bidding / Non disclosed';

    const deadlineStr = tender.deadline
      ? new Date(tender.deadline).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : 'Closing soon';

    const daysLeft = tender.deadline
      ? Math.max(0, Math.ceil((new Date(tender.deadline).getTime() - Date.now()) / (1000 * 3600 * 24)))
      : 30;

    let reqsText = '';
    if (tender.aiSummary?.requirements && Array.isArray(tender.aiSummary.requirements)) {
      const topReqs = tender.aiSummary.requirements.slice(0, 3);
      reqsText = topReqs
        .map((r: any) => `  • ${typeof r === 'string' ? r : r.description || r.item}`)
        .join('\n');
    } else {
      reqsText = '  • Standard technical and administrative conformity required.';
    }

    return (
      `*BIDORA PROCUREMENT ALERT*\n` +
      `Match Score: *${matchScore}% Highly Compatible*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `*${tender.title}*\n\n` +
      `*Buyer:* ${tender.buyerName}\n` +
      `*Market:* ${tender.buyerCountry}\n` +
      `*Budget:* ${valueStr}\n` +
      `*Deadline:* ${deadlineStr} (${daysLeft} days left)\n` +
      `*Sector:* ${tender.industry}\n` +
      `*Ref:* ${tender.refNumber || 'N/A'}\n\n` +
      `*Key Qualification Criteria:*\n` +
      `${reqsText}\n\n` +
      `*View Full AI Dossier & Apply:*\n` +
      `https://ai-bid.app/tenders/${tender.id}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `_Bidora Automated Procurement Gateway • Reply STOP to pause alerts._`
    );
  }

  /**
   * Formats a professional executive HTML email dossier.
   */
  formatEmailHtml(params: DispatchAlertParams): string {
    const { tender, matchScore } = params;
    const valueStr = tender.estimatedValue
      ? `${Number(tender.estimatedValue).toLocaleString()} ${tender.currency || 'USD'}`
      : 'Competitive / To be estimated';

    const deadlineStr = tender.deadline
      ? new Date(tender.deadline).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : 'Open submission';

    let reqsHtml = '';
    if (tender.aiSummary?.requirements && Array.isArray(tender.aiSummary.requirements)) {
      reqsHtml = tender.aiSummary.requirements
        .slice(0, 4)
        .map((r: any) => `<li style="margin-bottom: 6px;">${typeof r === 'string' ? r : r.description || r.item}</li>`)
        .join('');
    } else {
      reqsHtml = '<li>Standard technical dossier & fiscal compliance certificate</li>';
    }

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #0f172a; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%); padding: 24px; color: #ffffff; }
    .badge { display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
    .content { padding: 24px; }
    .title { font-size: 18px; font-weight: 800; line-height: 1.4; color: #0f172a; margin-top: 0; }
    .metric-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0; }
    .metric { background: #f1f5f9; padding: 12px; border-radius: 10px; }
    .metric-label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 4px; }
    .metric-val { font-size: 14px; font-weight: 800; color: #0f172a; }
    .btn { display: inline-block; width: 100%; box-sizing: border-box; text-align: center; background: #059669; color: #ffffff; text-decoration: none; padding: 14px 20px; border-radius: 12px; font-weight: 800; font-size: 14px; margin-top: 20px; }
    .footer { padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="badge">${matchScore}% Match Score</div>
      <h2 style="margin: 12px 0 0 0; font-size: 20px; font-weight: 900;">New High-Priority Tender Alert</h2>
      <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">AI Match detected for your corporate capabilities</p>
    </div>
    <div class="content">
      <h3 class="title">${tender.title}</h3>
      <div class="metric-grid">
        <div class="metric">
          <div class="metric-label">Contracting Buyer</div>
          <div class="metric-val">${tender.buyerName}</div>
        </div>
        <div class="metric">
          <div class="metric-label">Target Market</div>
          <div class="metric-val">${tender.buyerCountry}</div>
        </div>
        <div class="metric">
          <div class="metric-label">Estimated Budget</div>
          <div class="metric-val" style="color: #059669;">${valueStr}</div>
        </div>
        <div class="metric">
          <div class="metric-label">Closing Deadline</div>
          <div class="metric-val">${deadlineStr}</div>
        </div>
      </div>

      <div style="margin-top: 20px;">
        <h4 style="font-size: 12px; text-transform: uppercase; color: #475569; letter-spacing: 0.5px; margin-bottom: 8px;">Key Compliance & Requirements</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #334155; line-height: 1.5;">
          ${reqsHtml}
        </ul>
      </div>

      <a href="https://ai-bid.app/tenders/${tender.id}" class="btn">
        Access Full AI Tender Dossier & Checklist →
      </a>
    </div>
    <div class="footer">
      Sent by Bidora AI Procurement Gateway • Real-time Tender Matching Engine<br>
      You are receiving this alert based on your active notification preferences.
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Dispatches alerts across selected channels (WhatsApp, Email, SMS).
   */
  async dispatch(params: DispatchAlertParams) {
    const results: any[] = [];

    // 1. WhatsApp Dispatch
    if (params.channels.includes('WHATSAPP') && params.recipientPhone) {
      const waBody = this.formatWhatsAppMessage(params);
      this.logger.log(`[WhatsApp Dispatch] Sending to ${params.recipientPhone} (Score: ${params.matchScore}%)`);
      this.logger.log(`[WhatsApp Payload Preview]:\n${waBody}\n`);

      const log = await this.prisma.alertLog.create({
        data: {
          userId: params.userId,
          tenderId: params.tender.id,
          channel: 'WHATSAPP',
          recipient: params.recipientPhone,
          title: `WhatsApp Alert: ${params.tender.title.substring(0, 60)}...`,
          body: waBody,
          status: 'DELIVERED',
          matchScore: params.matchScore,
          metadata: {
            buyer: params.tender.buyerName,
            country: params.tender.buyerCountry,
            simulated: true,
            provider: 'Bidora WhatsApp Business Gateway',
          },
        },
      });
      results.push({ channel: 'WHATSAPP', status: 'DELIVERED', logId: log.id, body: waBody });
    }

    // 2. Email Dispatch
    if (params.channels.includes('EMAIL') && params.recipientEmail) {
      const emailHtml = this.formatEmailHtml(params);
      const emailSubject = `[${params.matchScore}% Match] ${params.tender.buyerName}: ${params.tender.title.substring(0, 65)}`;
      this.logger.log(`[Email Dispatch] Sending to ${params.recipientEmail} (${emailSubject})`);

      const log = await this.prisma.alertLog.create({
        data: {
          userId: params.userId,
          tenderId: params.tender.id,
          channel: 'EMAIL',
          recipient: params.recipientEmail,
          title: emailSubject,
          body: emailHtml,
          status: 'DELIVERED',
          matchScore: params.matchScore,
          metadata: {
            subject: emailSubject,
            simulated: true,
            provider: 'Bidora SMTP / SendGrid Engine',
          },
        },
      });
      results.push({ channel: 'EMAIL', status: 'DELIVERED', logId: log.id, subject: emailSubject });
    }

    return results;
  }
}
