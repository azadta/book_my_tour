import { INotification } from "../models/Notification";

export interface INotificationService {
  createNotification(data: {
    recipientId: string;
    senderId: string;
    title: string;
    message: string;
    bookingId?: string;
  }): Promise<INotification>;
  getUserNotification(userId: string): Promise<{
    notifications: INotification[];
    unreadCount: number;
  }>;
  markAsRead(
    notificationId: string,
    userId: string,
  ): Promise<{
    unreadCount: number;
  }>;
  markAllAsRead(userId: string): Promise<{
    unreadCount: number;
  }>;
  clearAllNotifications(userId: string): Promise<{
    unreadCount: number;
  }>;
}
