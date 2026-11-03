import { inject, injectable } from "inversify";
import { ISubscriptionPlanController } from "../interfaces/ISubscriptionPlanController";
import { Types } from "../types/types";
import type { ISubscriptionPlanService } from "../interfaces/ISubscriptionPlanService";
import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../constants/statusCodeConstants";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { sendSuccessResponse } from "../utils/apiResponse";

@injectable()
export class SubscriptionPlanController implements ISubscriptionPlanController {
  constructor(
    @inject(Types.SubscriptionPlanService)
    private _subscriptionPlanService: ISubscriptionPlanService,
  ) {}

  createPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const plan = await this._subscriptionPlanService.createPlan(req.body);
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.SUBSCRIPTION_PLAN.SUCCESS.CREATE,
        plan,
        StatusCode.CREATED,
      );
    } catch (error) {
      next(error);
    }
  };

  getAllPlans = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const plans = await this._subscriptionPlanService.getAllPlans();
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.SUBSCRIPTION_PLAN.SUCCESS.FETCH_ALL,
        plans,
        StatusCode.OK,
      );
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
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.SUBSCRIPTION_PLAN.SUCCESS.UPDATE,
        updated,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  deletePlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this._subscriptionPlanService.deletePlan(req.params.id as string);
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.SUBSCRIPTION_PLAN.SUCCESS.DELETED,
        undefined,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };
  getPlanDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const plan = await this._subscriptionPlanService.getPlanDetail(
        req.params.id as string,
      );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.SUBSCRIPTION_PLAN.SUCCESS.FETCH,
        plan,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };
}
