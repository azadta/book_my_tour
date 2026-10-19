import { NextFunction, Request, Response } from "express";
import { ISubscriptionPlan } from "../models/SubscriptionPlan";

export interface ISubscriptionPlanController {
  createPlan: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getAllPlans: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  updatePlan: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  deletePlan: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getPlanDetail: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}
