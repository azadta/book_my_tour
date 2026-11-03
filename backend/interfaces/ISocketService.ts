import { Server as HTTPServer } from "http";
import { INotification } from "../models/Notification";

export interface ISocketService {
  init(httpServer: HTTPServer): void;
  emitNotificationToUser(recipientId: string, notificationData:INotification): void;
  emitToUser<T>(userId: string, event: string, data: T): void
}
