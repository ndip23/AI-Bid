import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsIn(['NEW_MATCH', 'DEADLINE_WARNING', 'STATUS_CHANGE', 'SYSTEM'])
  type: string;
}
