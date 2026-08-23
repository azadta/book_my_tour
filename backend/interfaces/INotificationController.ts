import { NextFunction, Request, Response } from "express";

export interface INotificationController {
  createNotification: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getUserNotifications: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  markAsRead: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  markAllAsRead: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  clearAllNotifications: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}
