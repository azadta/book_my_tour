import { inject, injectable } from "inversify";
import { IChatController } from "../interfaces/IChatController";
import { Types } from "../types/types";
import type { IChatService } from "../interfaces/IChatService";
import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../constants/statusCodeConstants";
import { RESPONSE_MESSAGES } from "../constants/messages";

@injectable()
export class ChatController implements IChatController {
  constructor(@inject(Types.ChatService) private chatService: IChatService) {}
  accessChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUserId = req.user?.id;
      const rawUserRole = req.user?.role as "User" | "Admin" | "Operator";
      const { targetId, targetModel } = req.body;

      const toTitleCase = (str: string) =>
        (str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()) as
          | "User"
          | "Admin"
          | "Operator";
      const currentUserRole = toTitleCase(rawUserRole);
      const formattedTargetModel = toTitleCase(targetModel);
      const chat = await this.chatService.accessChatService(
        currentUserId as string,
        currentUserRole,
        targetId,
        formattedTargetModel,
      );
      res.status(StatusCode.OK).json(chat);
    } catch (error) {
      next(error);
    }
  };
  getMyChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const chats = await this.chatService.getMyChatsService(
        req.user?.id as string,
      );
      res.status(StatusCode.OK).json(chats);
    } catch (error) {
      next(error);
    }
  };

  getChatMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { chatId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await this.chatService.getChatMessagesService(
        chatId as string,
        page,
        limit,
      );
      res.status(StatusCode.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  clearChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { chatId } = req.params;
      const userId = req.user?.id as string;
      await this.chatService.clearChatService(chatId as string, userId);
      res
        .status(StatusCode.OK)
        .json({ message: RESPONSE_MESSAGES.CHAT.SUCCESS.CLEARED });
    } catch (error) {
      next(error);
    }
  };
}
