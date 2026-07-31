import { IsString, IsNotEmpty, IsNumber, IsOptional, IsIn, IsDateString, IsArray } from 'class-validator';

export class PublishTenderDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  refNumber: string;

  @IsString()
  @IsNotEmpty()
  buyerName: string;

  @IsString()
  @IsNotEmpty()
  buyerCountry: string;

  @IsString()
  @IsNotEmpty()
  industry: string;

  @IsNumber()
  estimatedValue: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsDateString()
  publishDate: string;

  @IsDateString()
  deadline: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  rawContent: string;

  @IsString()
  @IsOptional()
  sourceUrl?: string;

  @IsArray()
  @IsOptional()
  attachments?: string[];
}

export class UpdateTenderStatusDto {
  @IsString()
  @IsIn(['OPEN', 'CLOSED', 'CANCELLED'])
  status: string;
}
