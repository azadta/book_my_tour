import { NextFunction, Request, Response } from "express";

export interface IWalletController {
  //user
  getWallet: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  createWalletTopupOrder: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  verifyWalletTopupPayment: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}
