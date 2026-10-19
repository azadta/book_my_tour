import { HydratedDocument } from "mongoose";
import { ISubscriptionPlan } from "../models/SubscriptionPlan";
import { IBaseRepository } from "./IBaseRepository";

export interface ISubscriptionPlanRepository extends IBaseRepository<ISubscriptionPlan> {
  findAll(): Promise<HydratedDocument<ISubscriptionPlan>[]>;
}
