import cookie from "cookie";
import { Server as HTTPServer } from "http";
import { inject, injectable } from "inversify";
import { Server, Socket } from "socket.io";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import type { IChatRepository } from "../interfaces/IChatRepository";
import type { IMessageRepository } from "../interfaces/IMessageRepository";
import type { ISecurityService } from "../interfaces/ISecurityService";
import { ISocketService } from "../interfaces/ISocketService";
import { Types } from "../types/types";
import { CustomError } from "../utils/customError";

export interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    role: string;
  };
}
@injectable()
export class SocketService implements ISocketService {
  private io!: Server;
  private onlineUsers = new Map<string, Set<string>>();
  constructor(
    @inject(Types.ChatRepository) private chatRepository: IChatRepository,
    @inject(Types.MessageRepository)
    private messageRepository: IMessageRepository,
    @inject(Types.SecurityService)
    private securityService: ISecurityService,
  ) {}
  public init(httpServer: HTTPServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
      },
    });
    this.io.use((socket: AuthenticatedSocket, next) => {
      try {
        const cookies = cookie.parse(socket.handshake.headers.cookie || "");
        const token = cookies.access_token;
        if (!token) {
          throw new CustomError(
            RESPONSE_MESSAGES.AUTH.ERROR.FAILED,
            StatusCode.UNAUTHORIZED,
          );
        }
        const decoded = this.securityService.verifyAccessToken(token);
        socket.user = {
          id: decoded.id,
          role: decoded.role,
        };
        next();
      } catch (error: any) {
        console.error(
          "socketAuthentication middleware error:",
          error?.message || error,
        );
        if (error?.name === "TokenExpiredError") {
          return next(
            new CustomError("TOKEN_EXPIRED", StatusCode.UNAUTHORIZED),
          );
        }

        next(
          new CustomError(
            RESPONSE_MESSAGES.AUTH.ERROR.ACCESS_DENIED,
            StatusCode.UNAUTHORIZED,
          ),
        );
      }
    });

    this.io.on("connection", (socket: AuthenticatedSocket) => {
      const userId = socket.user?.id;
      if (!userId) return;

      socket.join(`user:${userId}`);

      const setUserOnline = () => {
        if (!this.onlineUsers.has(userId)) {
          this.onlineUsers.set(userId, new Set());
        }
        const isFirstSocket = this.onlineUsers.get(userId)!.size === 0;
        this.onlineUsers.get(userId)!.add(socket.id);
        if (isFirstSocket) {
          this.io.emit("user_status_change", { userId, isOnline: true });
        }
        const activeOnlineUserIds = Array.from(this.onlineUsers.keys());
        socket.emit("online_users_list", activeOnlineUserIds);
      };

      const setUserOffline = () => {
        const userSockets = this.onlineUsers.get(userId);
        if (userSockets) {
          userSockets.delete(socket.id);
          if (userSockets.size === 0) {
            this.onlineUsers.delete(userId);
            this.io.emit("user_status_change", { userId, isOnline: false });
          }
        }
      };

      socket.on("enter_chat_page", () => {
        setUserOnline();
      });
      socket.on("leave_chat_page", () => {
        setUserOffline();
      });

      socket.on("join_chat", (chatId: string) => socket.join(`chat:${chatId}`));
      socket.on("leave_chat", (chatId: string) =>
        socket.leave(`chat:${chatId}`),
      );
      socket.on(
        "send_message",
        async (data: {
          chatId: string;
          text: string;
          recipientId: string;
          senderModel: "User" | "Operator" | "Admin";
        }) => {
          const isReciepentOnline = this.onlineUsers.has(data.recipientId);
          const message = await this.messageRepository.create({
            chatId: data.chatId,
            senderId: userId,
            senderModel: data.senderModel,
            text: data.text,
            status: isReciepentOnline ? "DELIVERED" : "SENT",
          });
          await this.chatRepository.incrementUnreadCount(
            data.chatId,
            data.recipientId,
            message._id.toString(),
          );
          this.io.to(`chat:${data.chatId}`).emit("receive_message", message);
          this.io
            .to(`user:${data.recipientId}`)
            .emit("new_message_notification", { chatId: data.chatId, message });
        },
      );

      socket.on("typing", ({ chatId, recipientId }) => {
        this.io
          .to(`user:${recipientId}`)
          .emit("user_typing", { chatId, userId });
      });

      socket.on("stop_typing", ({ chatId, recipientId }) => {
        this.io
          .to(`user:${recipientId}`)
          .emit("user_stop_typing", { chatId, userId });
      });

      socket.on(
        "mark_as_read",
        async ({
          chatId,
          messageIds,
        }: {
          chatId: string;
          messageIds?: string[];
        }) => {
          if (!messageIds || messageIds.length === 0) {
            await this.messageRepository.markAllMessagesAsReadInChat(
              chatId,
              userId,
            );
          } else {
            await this.messageRepository.markMessagesAsRead(messageIds, chatId);
          }

          await this.chatRepository.resetUnreadCount(chatId, userId);
          this.io
            .to(`chat:${chatId}`)
            .emit("message_read", { chatId, messageIds, readBy: userId });
        },
      );
      socket.on("clear_chat", ({ chatId }: { chatId: string }) => {
        this.io.to(`chat:${chatId}`).emit("chat_cleared", { chatId });
      });

      socket.on("disconnect", () => {
        setUserOffline();
      });
    });
  }

  public emitNotificationToUser(recipientId: string, notificationData: any) {
    if (this.io) {
      this.io
        .to(`user:${recipientId.toString()}`)
        .emit("new_notification", notificationData);
    }
  }
}
