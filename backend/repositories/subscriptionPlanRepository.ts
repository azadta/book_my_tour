import { injectable } from "inversify";
import { BaseRepository } from "./baseRepository";
import { ISubscriptionPlan } from "../models/SubscriptionPlan";
import { ISubscriptionPlanRepository } from "../interfaces/ISubscriptionPlanRepository";
import { SubscriptionPlan } from "../models/SubscriptionPlan";
import { HydratedDocument } from "mongoose";

@injectable()
export class SubscriptionPlanRepository
  extends BaseRepository<ISubscriptionPlan>
  implements ISubscriptionPlanRepository
{
  constructor() {
    super(SubscriptionPlan);
  }

  async findAll(): Promise<HydratedDocument<ISubscriptionPlan>[]> {
    return SubscriptionPlan.find();
  }
}
