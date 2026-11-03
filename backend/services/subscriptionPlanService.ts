import { inject, injectable } from "inversify";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import { subscriptionPlanRequestDTO } from "../dto-mapping/dto/subscriptionPlan/SubscriptionPlanRequestDTO";
import type { ISubscriptionPlanRepository } from "../interfaces/ISubscriptionPlanRepository";
import { ISubscriptionPlanService } from "../interfaces/ISubscriptionPlanService";
import { ISubscriptionPlan } from "../models/SubscriptionPlan";
import { Types } from "../types/types";
import { CustomError } from "../utils/customError";

@injectable()
export class SubscriptionPlanService implements ISubscriptionPlanService {
  constructor(
    @inject(Types.SubscriptionPlanRepository)
    private _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}

  async createPlan(dto: subscriptionPlanRequestDTO): Promise<ISubscriptionPlan> {
    return await this._subscriptionPlanRepository.create(dto);
  }

  async getAllPlans(): Promise<ISubscriptionPlan[]> {
    return await this._subscriptionPlanRepository.findAll();
  }

  async updatePlan(id: string, dto: subscriptionPlanRequestDTO): Promise<ISubscriptionPlan | null> {
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
