import { NextFunction, Request, Response } from "express";

export interface IDashboardController{
    //admin
      getTotalUsersCount: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getTotalOperatorsCount: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  todaySignupCount: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getPendingOperatorsCount: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;

  //operator
    getOperatorDashboardData: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;

}