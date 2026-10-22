import { HydratedDocument } from "mongoose";
import { IPayoutDocument, PayoutStatusType } from "../models/Payout";
import { IBaseRepository } from "./IBaseRepository";

export interface IPayoutRepository extends IBaseRepository<IPayoutDocument> {
  fetchPayoutsByStatus(
    status: PayoutStatusType,
  ): Promise<HydratedDocument<IPayoutDocument>[]>;
  findPayoutsByOperatorId(
    operatorId: string,
  ): Promise<HydratedDocument<IPayoutDocument>[]>;
}
