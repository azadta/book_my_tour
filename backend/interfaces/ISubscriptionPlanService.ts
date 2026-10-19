import { ISubscriptionPlan } from "../models/SubscriptionPlan";

export interface ISubscriptionPlanService {
  createPlan(dto: any): Promise<ISubscriptionPlan>;
  getAllPlans(): Promise<ISubscriptionPlan[]>;
  updatePlan(id: string, dto: any): Promise<ISubscriptionPlan | null>;
  deletePlan(id: string): Promise<boolean>;
  getPlanDetail(id: string): Promise<ISubscriptionPlan>;
}
