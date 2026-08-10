import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export enum SavedStatus {
  BOOKMARKED = 'BOOKMARKED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  BIDDING = 'BIDDING',
  PASSED = 'PASSED',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum TenderStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

export class QueryTendersDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsEnum(TenderStatus)
  @IsOptional()
  status?: TenderStatus;

  @IsNumber()
  @IsOptional()
  minScore?: number;

  @IsString()
  @IsOptional()
  sortBy?: 'deadline' | 'publishDate' | 'estimatedValue' | 'matchScore';
}

export class CreateTenderDto {
  @IsString()
  title: string;

  @IsString()
  refNumber: string;

  @IsString()
  buyerName: string;

  @IsString()
  buyerCountry: string;

  @IsString()
  industry: string;

  @IsNumber()
  estimatedValue: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  publishDate: string;

  @IsString()
  deadline: string;

  @IsString()
  description: string;

  @IsString()
  rawContent: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];

  @IsString()
  @IsOptional()
  sourceUrl?: string;
}

export class SaveTenderDto {
  @IsEnum(SavedStatus)
  @IsOptional()
  status?: SavedStatus;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsString()
  @IsOptional()
  notes?: string;
}
