import { NextFunction, Request, Response } from "express";

export interface IChatController {
  accessChat(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMyChats(req: Request, res: Response, next: NextFunction): Promise<void>;
  getChatMessages(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  clearChat: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
