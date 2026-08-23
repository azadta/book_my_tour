import { injectable } from "inversify";
import { BaseRepository } from "./baseRepository";
import { INotification } from "../models/Notification";
import { INotificationRepository } from "../interfaces/INotificationRepository";
import { Notification } from "../models/Notification";

@injectable()
export class NotificationRepository
  extends BaseRepository<INotification>
  implements INotificationRepository
{
  constructor() {
    super(Notification);
  }
  async findByRecipient(recipientId: string): Promise<INotification[]> {
    return Notification.find({ recipientId })
      .populate("senderId", "name email image")
      .populate("bookingId")
      .sort({ createdAt: -1 });
  }

  async countUnread(recipientId: string): Promise<number> {
    return Notification.countDocuments({ recipientId, isRead: false });
  }

  async markAsRead(notificationId: string, recipientId: string): Promise<void> {
    await Notification.updateOne(
      { _id: notificationId, recipientId },
      { $set: { isRead: true } },
    );
  }

  async markAllAsRead(recipientId: string): Promise<void> {
    await Notification.updateMany(
      { recipientId, isRead: false },
      { $set: { isRead: true } },
    );
  }

  async deletAllByRecipient(recipientId:string):Promise<void>{
    await Notification.deleteMany({recipientId})
  }
}
