import { NextFunction, Request, Response } from "express";

export interface IPackageReviewController {
  //user
  getPackageReviewsByPackageId: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  createPackageReview: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  updatePackageReview: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  deletePackageReview: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}
