import { inject, injectable } from "inversify";
import { ISubscriptionPlanController } from "../interfaces/ISubscriptionPlanController";
import { Types } from "../types/types";
import type { ISubscriptionPlanService } from "../interfaces/ISubscriptionPlanService";
import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../constants/statusCodeConstants";
import { RESPONSE_MESSAGES } from "../constants/messages";

@injectable()
export class SubscriptionPlanController implements ISubscriptionPlanController {
  constructor(
    @inject(Types.SubscriptionPlanService)
    private _subscriptionPlanService: ISubscriptionPlanService,
  ) {}

  createPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const plan = await this._subscriptionPlanService.createPlan(req.body);
      res.status(StatusCode.CREATED).json(plan);
    } catch (error) {
      next(error);
    }
  };

  getAllPlans = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const plans = await this._subscriptionPlanService.getAllPlans();
      res.status(StatusCode.OK).json(plans);
    } catch (error) {
      next(error);
    }
  };

  updatePlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await this._subscriptionPlanService.updatePlan(
        req.params.id as string,
        req.body,
      );
      res.status(StatusCode.OK).json(updated);
    } catch (error) {
      next(error);
    }
  };

  deletePlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this._subscriptionPlanService.deletePlan(req.params.id as string);
      res
        .status(StatusCode.OK)
        .json({ message: RESPONSE_MESSAGES.SUBSCRIPTION_PLAN.SUCCESS.DELETED });
    } catch (error) {
      next(error);
    }
  };
  getPlanDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const plan = await this._subscriptionPlanService.getPlanDetail(
        req.params.id as string,
      );
      res.status(StatusCode.OK).json(plan);
    } catch (error) {
      next(error);
    }
  };
}
