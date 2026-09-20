import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { AlertDispatcherService } from './alert-dispatcher.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, AlertDispatcherService],
  exports: [NotificationService, AlertDispatcherService],
})
export class NotificationModule {}
