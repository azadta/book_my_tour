import { NextFunction, Request, Response } from "express";

export interface IPayoutController {
  getEligiblePayouts: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  createOrder: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  verifyPayment: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}
