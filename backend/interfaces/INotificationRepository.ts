import { INotification } from "../models/Notification";
import { BaseRepository } from "../repositories/baseRepository";

export interface INotificationRepository extends BaseRepository<INotification> {
  findByRecipient(recipientId: string): Promise<INotification[]>;
  countUnread(recipientId: string): Promise<number>;
  markAsRead(notificationId: string, recipientId: string): Promise<void>;
  markAllAsRead(recipientId: string): Promise<void>;
  deletAllByRecipient(recipientId: string): Promise<void>;
}
