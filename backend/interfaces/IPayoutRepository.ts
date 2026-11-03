import { HydratedDocument } from "mongoose";
import { IPayoutDocument, PayoutStatusType } from "../models/Payout";
import { IBaseRepository } from "./IBaseRepository";
import { PayoutWithPopulatedDetails } from "./IPayout";

export interface IPayoutRepository extends IBaseRepository<IPayoutDocument> {
  fetchPayoutsByStatus(
    status: PayoutStatusType,
  ): Promise<PayoutWithPopulatedDetails[]>;
  findPayoutsByOperatorId(
    operatorId: string,
  ): Promise<HydratedDocument<IPayoutDocument>[]>;
}
