import { NextFunction, Request, Response } from "express";

export interface ICommonAuthController {
  refresh: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
