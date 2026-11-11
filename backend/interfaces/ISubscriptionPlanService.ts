


import { SubscriptionPlanRequestDTO } from "../dto-mapping/dto/subscriptionPlan/subscriptionPlanRequestDTO";
import { ISubscriptionPlan } from "../models/SubscriptionPlan";

export interface ISubscriptionPlanService {
  createPlan(dto: SubscriptionPlanRequestDTO): Promise<ISubscriptionPlan>;
  getAllPlans(): Promise<ISubscriptionPlan[]>;
  updatePlan(id: string, dto: SubscriptionPlanRequestDTO): Promise<ISubscriptionPlan | null>;
  deletePlan(id: string): Promise<boolean>;
  getPlanDetail(id: string): Promise<ISubscriptionPlan>;
}
