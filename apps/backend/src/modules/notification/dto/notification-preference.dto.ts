import { IsBoolean, IsNumber, IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateNotificationPreferenceDto {
  @IsOptional()
  @IsString()
  whatsappNumber?: string;

  @IsOptional()
  @IsBoolean()
  notifyWhatsApp?: boolean;

  @IsOptional()
  @IsBoolean()
  notifyEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  notifySms?: boolean;

  @IsOptional()
  @IsNumber()
  minMatchScoreForAlert?: number;

  @IsOptional()
  @IsNumber()
  minBudgetForAlert?: number;

  @IsOptional()
  @IsString()
  alertFrequency?: string;

  @IsOptional()
  @IsArray()
  targetCountries?: string[];

  @IsOptional()
  @IsArray()
  targetIndustries?: string[];
}

export class TestDispatchDto {
  @IsString()
  channel: 'WHATSAPP' | 'EMAIL' | 'SMS';

  @IsOptional()
  @IsString()
  tenderId?: string;

  @IsOptional()
  @IsString()
  targetPhone?: string;

  @IsOptional()
  @IsString()
  targetEmail?: string;
}
