import { inject, injectable } from "inversify";
import type { INotificationController } from "../interfaces/INotificationController";
import { Types } from "../types/types";
import type { INotificationService } from "../interfaces/INotificationService";
import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/customError";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import type { ISocketService } from "../interfaces/ISocketService";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject(Types.NotificationService)
    private notificationService: INotificationService,
    @inject(Types.SocketService)
    private socketService: ISocketService,
  ) {}

  createNotification = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const senderId = req.user?.id as string;
      const { recipientId, title, message, bookingId } = req.body;
      if (!recipientId || !title || !message) {
        throw new CustomError(
          RESPONSE_MESSAGES.COMMON.ERROR.MISSING_REQUIRED_FIELDS,
          StatusCode.BAD_REQUEST,
        );
      }
      const notification = await this.notificationService.createNotification({
        senderId,
        recipientId,
        title,
        message,
        bookingId,
      });
      this.socketService.emitNotificationToUser(recipientId, notification);

      res.status(201).json({
        message: RESPONSE_MESSAGES.NOTIFICATION.SUCCESS.SEND,
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  };
  getUserNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id as string;
      const result = await this.notificationService.getUserNotification(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string;
      const { notificationId } = req.params;
      const result = await this.notificationService.markAsRead(
        notificationId as string,
        userId,
      );
      res.status(200).json({
        message: RESPONSE_MESSAGES.NOTIFICATION.SUCCESS.MARKED_AS_READ,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
  markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string;
      const result = await this.notificationService.markAllAsRead(userId);
      res.status(StatusCode.OK).json({
        message: RESPONSE_MESSAGES.NOTIFICATION.SUCCESS.MARKED_ALL_AS_READ,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  clearAllNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id as string;
      const result =
        await this.notificationService.clearAllNotifications(userId);
      res
        .status(StatusCode.OK)
        .json({
          message: RESPONSE_MESSAGES.NOTIFICATION.SUCCESS.CLEARED_ALL,
          data: result,
        });
    } catch (error) {
      next(error);
    }
  };
}
