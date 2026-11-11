import { NextFunction, Request, Response } from "express";

export interface IDashboardController {
  getAdminSummaryCounts: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;

  getOperatorDashboardData: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getAdminDashboardData: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}
