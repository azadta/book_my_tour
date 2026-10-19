import { inject, injectable } from "inversify";
import { ISubscriptionPlanService } from "../interfaces/ISubscriptionPlanService";
import { Types } from "../types/types";
import type { ISubscriptionPlanRepository } from "../interfaces/ISubscriptionPlanRepository";
import { HydratedDocument } from "mongoose";
import { ISubscriptionPlan } from "../models/SubscriptionPlan";
import { CustomError } from "../utils/customError";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";

@injectable()
export class SubscriptionPlanService implements ISubscriptionPlanService {
  constructor(
    @inject(Types.SubscriptionPlanRepository)
    private _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}

  async createPlan(dto: any): Promise<ISubscriptionPlan> {
    return await this._subscriptionPlanRepository.create(dto);
  }

  async getAllPlans(): Promise<ISubscriptionPlan[]> {
    return await this._subscriptionPlanRepository.findAll();
  }

  async updatePlan(id: string, dto: any): Promise<ISubscriptionPlan | null> {
    const plan = await this._subscriptionPlanRepository.updateById(id, dto);
    if (!plan) {
      throw new CustomError(
        RESPONSE_MESSAGES.SUBSCRIPTION_PLAN.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    return plan;
  }

  async deletePlan(id: string): Promise<boolean> {
    const deleted = await this._subscriptionPlanRepository.deleteById(id);
    if (!deleted) {
      throw new CustomError(
        RESPONSE_MESSAGES.SUBSCRIPTION_PLAN.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    return true;
  }

  async getPlanDetail(id: string): Promise<ISubscriptionPlan> {
    const plan = await this._subscriptionPlanRepository.findById(id);
    if (!plan) {
      throw new CustomError(
        RESPONSE_MESSAGES.SUBSCRIPTION_PLAN.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    return plan
  }
}
