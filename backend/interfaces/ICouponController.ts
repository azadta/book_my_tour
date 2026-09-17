import { NextFunction, Request, Response } from "express";

export interface ICouponController {
  //operator
  getCoupons: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  validateCoupon: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getAllCoupons: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getCouponById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  createCoupon: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  updateCoupon: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  toggleCouponStatus: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}
