import { Server as HTTPServer } from "http";

export interface ISocketService {
  init(httpServer: HTTPServer): void;
  emitNotificationToUser(recipientId: string, notificationData: any): void;
  emitToUser(userId: string, event: string, data: any): void
}
