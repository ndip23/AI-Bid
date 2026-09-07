import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async getUserNotifications(userId: string) {
    let notifs = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    if (notifs.length === 0) {
      await this.prisma.notification.createMany({
        data: [
          {
            userId,
            title: 'Action Required: Complete Capability Profile',
            message: 'Fill your Tax ID/RCCM, certifications, and operational countries to unlock bidding authorization.',
            type: 'COMPLIANCE_REQUIRED',
            isRead: false,
          },
          {
            userId,
            title: 'New High-Match Tenders Discovered',
            message: 'Verified opportunities in Construction, IT, and Energy matching your profile are ready for review.',
            type: 'NEW_MATCH',
            isRead: false,
          },
          {
            userId,
            title: 'Procurement Pipeline Active',
            message: 'Move tenders between Bookmarked, Under Review, and Bidding to track your team dossiers.',
            type: 'SYSTEM',
            isRead: false,
          },
        ],
      });

      notifs = await this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
    }

    return notifs;
  }

  async markAsRead(notificationId: string, userId: string) {
    const notif = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notif || notif.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async createNotification(userId: string, title: string, message: string, type: string) {
    return this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });
  }
}
