import { Controller, Get, Post, Put, Param, Body, Patch, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UpdateNotificationPreferenceDto, TestDispatchDto } from './dto/notification-preference.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getUserNotifications(@GetUser('id') userId: string) {
    return this.notificationService.getUserNotifications(userId);
  }

  @Patch(':id/read')
  markAsRead(
    @Param('id') notificationId: string,
    @GetUser('id') userId: string,
  ) {
    return this.notificationService.markAsRead(notificationId, userId);
  }

  @Patch('read-all')
  markAllAsRead(@GetUser('id') userId: string) {
    return this.notificationService.markAllAsRead(userId);
  }

  @Get('preferences')
  getPreferences(@GetUser('id') userId: string) {
    return this.notificationService.getPreferences(userId);
  }

  @Put('preferences')
  updatePreferences(
    @GetUser('id') userId: string,
    @Body() dto: UpdateNotificationPreferenceDto,
  ) {
    return this.notificationService.updatePreferences(userId, dto);
  }

  @Post('test-dispatch')
  testDispatch(
    @GetUser('id') userId: string,
    @Body() dto: TestDispatchDto,
  ) {
    return this.notificationService.testDispatch(userId, dto);
  }

  @Get('alert-logs')
  getAlertLogs(@GetUser('id') userId: string) {
    return this.notificationService.getAlertLogs(userId);
  }
}
