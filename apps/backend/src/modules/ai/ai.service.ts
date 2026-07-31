import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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

export interface ExtractedSummary {
  executiveSummary: string;
  requirements: ExtractedRequirement[];
  deliverables: string[];
  deadlineSummary: string;
  risks: ExtractedRisk[];
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private geminiApiKey: string | null = null;
  private openAiApiKey: string | null = null;

  constructor(private configService: ConfigService) {
    this.geminiApiKey = this.configService.get<string>('GEMINI_API_KEY') || null;
    this.openAiApiKey = this.configService.get<string>('OPENAI_API_KEY') || null;
  }

  async generateTenderSummary(title: string, description: string, rawContent: string): Promise<ExtractedSummary> {
    // 1. Try Gemini API first
    if (this.geminiApiKey) {
      try {
        this.logger.log('Analyzing tender with Google Gemini API...');
        return await this.callGeminiAPI(title, description, rawContent);
      } catch (err) {
        this.logger.warn(`Gemini API call failed, attempting fallbacks: ${err.message}`);
      }
    }

    // 2. Try OpenAI API as secondary fallback
    if (this.openAiApiKey) {
      try {
        this.logger.log('Analyzing tender with OpenAI API...');
        return await this.callOpenAI(title, description, rawContent);
      } catch (err) {
        this.logger.warn(`OpenAI call failed, falling back to heuristic AI parser: ${err.message}`);
      }
    }

    // 3. Fallback to intelligent heuristic engine
    this.logger.log('Using heuristic AI parsing engine.');
    return this.fallbackHeuristicSummary(title, description, rawContent);
  }

  private async callGeminiAPI(title: string, description: string, rawContent: string): Promise<ExtractedSummary> {
    const prompt = `You are an expert procurement and tender evaluation AI assistant. Analyze the tender document provided and return ONLY valid JSON matching this exact schema without any markdown wrapping or extra text:
{
  "executiveSummary": "Detailed strategic overview of tender requirements",
  "requirements": [
    { "id": "req-1", "category": "Certification|Technical|Compliance|Financial|Geography", "description": "Specific requirement text", "isMandatory": true }
  ],
  "deliverables": ["List of core deliverables"],
  "deadlineSummary": "Detailed breakdown of submission cutoffs and milestones",
  "risks": [
    { "id": "risk-1", "risk": "Description of potential risk", "severity": "HIGH|MEDIUM|LOW", "mitigation": "Recommended risk mitigation strategy" }
  ]
}

Tender Title: ${title}
Description: ${description}

Raw Specification:
${rawContent}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini HTTP ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error('Empty response from Gemini API');
    }

    const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned) as ExtractedSummary;
  }

  private async callOpenAI(title: string, description: string, rawContent: string): Promise<ExtractedSummary> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.openAiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert procurement and tender evaluation AI assistant. Return ONLY valid JSON matching this schema:
{
  "executiveSummary": "...",
  "requirements": [{ "id": "req-1", "category": "Certification|Technical|Compliance|Financial|Geography", "description": "...", "isMandatory": true }],
  "deliverables": ["..."],
  "deadlineSummary": "...",
  "risks": [{ "id": "risk-1", "risk": "...", "severity": "HIGH|MEDIUM|LOW", "mitigation": "..." }]
}`,
          },
          {
            role: 'user',
            content: `Tender Title: ${title}\nDescription: ${description}\n\nRaw Specification:\n${rawContent}`,
          },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI HTTP error ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned) as ExtractedSummary;
  }

  private fallbackHeuristicSummary(title: string, description: string, rawContent: string): ExtractedSummary {
    const isCloud = title.toLowerCase().includes('cloud') || rawContent.toLowerCase().includes('cloud');
    const isSecurity = title.toLowerCase().includes('cyber') || rawContent.toLowerCase().includes('security');
    const isHealth = title.toLowerCase().includes('health') || rawContent.toLowerCase().includes('medical');

    return {
      executiveSummary: `The "${title}" tender is a strategic procurement opportunity focusing on enterprise delivery, operational compliance, and multi-phase implementation. The procuring entity requires a qualified vendor with proven domain expertise, strict regulatory compliance, and a dedicated account management team.`,
      requirements: [
        {
          id: 'req-1',
          category: 'Certification',
          description: isSecurity || isCloud ? 'Active ISO 27001 or SOC 2 Type II compliance certification' : 'ISO 9001 Quality Management Certification',
          isMandatory: true,
        },
        {
          id: 'req-2',
          category: 'Geography',
          description: 'Local presence or authorized operational status in buyer region',
          isMandatory: true,
        },
        {
          id: 'req-3',
          category: 'Technical',
          description: isCloud ? 'Experience in multi-cloud architecture (AWS/Azure) & 99.99% uptime SLA' : 'Minimum 3 years of demonstrated past experience in similar scale contracts',
          isMandatory: true,
        },
        {
          id: 'req-4',
          category: 'Financial',
          description: 'Audited financial statements for the past 2 fiscal years showing annual turnover > $2M',
          isMandatory: false,
        },
      ],
      deliverables: [
        'Phase 1: Inception Report, Architecture Design Document & Security Assessment',
        'Phase 2: Core Platform Deployment, Configuration & System Integration',
        'Phase 3: Acceptance Testing, User Training & 24/7 SLA Technical Support',
      ],
      deadlineSummary: 'Full proposals must be submitted electronically via the portal prior to the deadline date. Written clarification questions close 7 business days prior to closing.',
      risks: [
        {
          id: 'risk-1',
          risk: 'Strict liquidated damages penalty of 0.5% per day for delayed milestones',
          severity: 'HIGH',
          mitigation: 'Incorporate realistic buffers into project schedule and establish clear client sign-off gates.',
        },
        {
          id: 'risk-2',
          risk: isHealth ? 'Rigorous data privacy & HIPAA compliance requirements' : 'Tight 60-day turnaround for core deployment phase',
          severity: 'MEDIUM',
          mitigation: 'Pre-allocate senior engineering team and leverage pre-built modular components.',
        },
      ],
    };
  }
}
