import { inject, injectable } from "inversify";
import { INotificationService } from "../interfaces/INotificationService";

import type { INotificationRepository } from "../interfaces/INotificationRepository";
import { Types as mongooseType } from "mongoose";
import { Types } from "../types/types";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(Types.NotificationRepository)
    private _notificationRepository: INotificationRepository,
  ) {}
  async createNotification(data: {
    recipientId: string;
    senderId: string;
    title: string;
    message: string;
    bookingId?: string;
  }) {
    return this._notificationRepository.create({
      recipientId: new mongooseType.ObjectId(data.recipientId),
      senderId: new mongooseType.ObjectId(data.senderId),
      title: data.title,
      message: data.message,
      ...(data.bookingId && {
        bookingId: new mongooseType.ObjectId(data.bookingId),
      }),
    });
  }

  async getUserNotification(userId: string) {
    const [notifications, unreadCount] = await Promise.all([
      this._notificationRepository.findByRecipient(userId),
      this._notificationRepository.countUnread(userId),
    ]);
    return { notifications, unreadCount };
  }

  async markAsRead(notificationId: string, userId: string) {
    await this._notificationRepository.markAsRead(notificationId, userId);
    const unreadCount = await this._notificationRepository.countUnread(userId);
    return { unreadCount };
  }

  async markAllAsRead(userId: string) {
    await this._notificationRepository.markAllAsRead(userId);
    return { unreadCount: 0 };
  }

  async clearAllNotifications(userId: string) {
    await this._notificationRepository.deletAllByRecipient(userId);
    return { unreadCount: 0 };
  }
}
