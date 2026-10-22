import { injectable } from "inversify";
import { IPayoutRepository } from "../interfaces/IPayoutRepository";
import { BaseRepository } from "./baseRepository";
import { IPayoutDocument, PayoutStatusType } from "../models/Payout";
import { Payout } from "../models/Payout";
import { HydratedDocument } from "mongoose";

@injectable()
export class PayoutRepository
  extends BaseRepository<IPayoutDocument>
  implements IPayoutRepository
{
  constructor() {
    super(Payout);
  }

  async fetchPayoutsByStatus(
    status: PayoutStatusType,
  ): Promise<HydratedDocument<IPayoutDocument>[]> {
    return Payout.find({ payoutStatus: status })
      .populate({
        path: "bookingId",
        select: "status attendance",
        populate: {
          path: "packageId",
          select: "name startDate duration amount",
        },
      })
      .populate("operatorId", "name email mobile")
      .sort({ createdAt: -1 });
  }

  async findPayoutsByOperatorId(
    operatorId: string,
  ): Promise<HydratedDocument<IPayoutDocument>[]> {
    return Payout.find({ operatorId })
      .populate({
        path: "bookingId",
        populate: {
          path: "packageId",
          select: "title startDate duration",
        },
      })
      .sort({ createdAt: -1 });
  }
}
