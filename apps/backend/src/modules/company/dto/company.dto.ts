import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCompanyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  taxId?: string;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  countries?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  certifications?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  services?: string[];

  @IsString()
  @IsOptional()
  annualRevenue?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  teamSize?: number;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class AddTeamMemberDto {
  @IsString()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  role?: string;
}
