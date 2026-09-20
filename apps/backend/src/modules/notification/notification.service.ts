import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AlertDispatcherService } from './alert-dispatcher.service';
import { UpdateNotificationPreferenceDto, TestDispatchDto } from './dto/notification-preference.dto';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private alertDispatcher: AlertDispatcherService,
  ) {}

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

  /**
   * Retrieves or initializes multi-channel notification preferences for a user.
   */
  async getPreferences(userId: string) {
    let pref = await this.prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!pref) {
      pref = await this.prisma.notificationPreference.create({
        data: {
          userId,
          whatsappNumber: '+237 681 10 84 39',
          notifyWhatsApp: true,
          notifyEmail: true,
          notifySms: false,
          minMatchScoreForAlert: 75,
          minBudgetForAlert: 0,
          alertFrequency: 'INSTANT',
          targetCountries: ['Cameroon', 'Nigeria', "Cote d'Ivoire"],
          targetIndustries: ['Cloud & IT Infrastructure', 'Civil Infrastructure & Construction'],
        },
      });
    }

    return pref;
  }

  /**
   * Updates multi-channel notification preferences.
   */
  async updatePreferences(userId: string, dto: UpdateNotificationPreferenceDto) {
    return this.prisma.notificationPreference.upsert({
      where: { userId },
      create: {
        userId,
        whatsappNumber: dto.whatsappNumber ?? '+237 681 10 84 39',
        notifyWhatsApp: dto.notifyWhatsApp ?? true,
        notifyEmail: dto.notifyEmail ?? true,
        notifySms: dto.notifySms ?? false,
        minMatchScoreForAlert: dto.minMatchScoreForAlert ?? 75,
        minBudgetForAlert: dto.minBudgetForAlert ?? 0,
        alertFrequency: dto.alertFrequency ?? 'INSTANT',
        targetCountries: dto.targetCountries ?? ['Cameroon', 'Nigeria', "Cote d'Ivoire"],
        targetIndustries: dto.targetIndustries ?? ['Cloud & IT Infrastructure'],
      },
      update: {
        ...(dto.whatsappNumber !== undefined && { whatsappNumber: dto.whatsappNumber }),
        ...(dto.notifyWhatsApp !== undefined && { notifyWhatsApp: dto.notifyWhatsApp }),
        ...(dto.notifyEmail !== undefined && { notifyEmail: dto.notifyEmail }),
        ...(dto.notifySms !== undefined && { notifySms: dto.notifySms }),
        ...(dto.minMatchScoreForAlert !== undefined && { minMatchScoreForAlert: dto.minMatchScoreForAlert }),
        ...(dto.minBudgetForAlert !== undefined && { minBudgetForAlert: dto.minBudgetForAlert }),
        ...(dto.alertFrequency !== undefined && { alertFrequency: dto.alertFrequency }),
        ...(dto.targetCountries !== undefined && { targetCountries: dto.targetCountries }),
        ...(dto.targetIndustries !== undefined && { targetIndustries: dto.targetIndustries }),
      },
    });
  }

  /**
   * Triggers an immediate test alert dispatch across WhatsApp or Email.
   */
  async testDispatch(userId: string, dto: TestDispatchDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { notificationPreference: true, company: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const pref = user.notificationPreference || (await this.getPreferences(userId));

    // Pick target tender (either provided ID or top featured high-match tender)
    let tender = null;
    if (dto.tenderId) {
      tender = await this.prisma.tender.findUnique({
        where: { id: dto.tenderId },
        include: { aiSummary: true },
      });
    }

    if (!tender) {
      tender = await this.prisma.tender.findFirst({
        where: {
          status: 'OPEN',
          aiSummary: { isNot: null },
        },
        orderBy: { createdAt: 'desc' },
        include: { aiSummary: true },
      });
    }

    if (!tender) {
      throw new NotFoundException('No active tender found for dispatch test');
    }

    const targetPhone = dto.targetPhone || pref.whatsappNumber || '+237 681 10 84 39';
    const targetEmail = dto.targetEmail || user.email;

    const dispatchResults = await this.alertDispatcher.dispatch({
      userId,
      recipientPhone: targetPhone,
      recipientEmail: targetEmail,
      tender,
      matchScore: 94,
      channels: [dto.channel],
    });

    return {
      success: true,
      message: `Test ${dto.channel} alert dispatched successfully!`,
      dispatchedTo: dto.channel === 'WHATSAPP' ? targetPhone : targetEmail,
      tender: {
        id: tender.id,
        title: tender.title,
        buyerName: tender.buyerName,
        buyerCountry: tender.buyerCountry,
      },
      results: dispatchResults,
    };
  }

  /**
   * Returns recent dispatched alerts for audit & preview.
   */
  async getAlertLogs(userId: string) {
    return this.prisma.alertLog.findMany({
      where: { userId },
      orderBy: { sentAt: 'desc' },
      take: 15,
    });
  }
}
