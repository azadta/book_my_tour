import { subscriptionPlanRequestDTO } from "../dto-mapping/dto/subscriptionPlan/SubscriptionPlanRequestDTO";
import { ISubscriptionPlan } from "../models/SubscriptionPlan";

export interface ISubscriptionPlanService {
  createPlan(dto: subscriptionPlanRequestDTO): Promise<ISubscriptionPlan>;
  getAllPlans(): Promise<ISubscriptionPlan[]>;
  updatePlan(id: string, dto: subscriptionPlanRequestDTO): Promise<ISubscriptionPlan | null>;
  deletePlan(id: string): Promise<boolean>;
  getPlanDetail(id: string): Promise<ISubscriptionPlan>;
}
