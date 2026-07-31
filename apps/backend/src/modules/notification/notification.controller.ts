import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

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
}
