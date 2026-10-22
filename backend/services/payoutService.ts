import { inject, injectable } from "inversify";
import { IPayoutService } from "../interfaces/IPayoutService";
import { Types } from "../types/types";
import type { IPayoutRepository } from "../interfaces/IPayoutRepository";
import type { IOperatorRepository } from "../interfaces/IOperatorRepository";
import type { IPaymentService } from "../interfaces/IPaymentService";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import { CustomError } from "../utils/customError";
import { PayoutRepository } from "../repositories/payoutRepository";
import { HydratedDocument } from "mongoose";
import { IPayoutDocument } from "../models/Payout";

@injectable()
export class PayoutService implements IPayoutService {
  constructor(
    @inject(Types.PayoutRepository)
    private _payoutRepository: IPayoutRepository,
    @inject(Types.OperatorRepository)
    private _operatorRepository: IOperatorRepository,
    @inject(Types.PaymentService) private _paymentService: IPaymentService,
  ) {}
  async sincAndFetchEligiblePayouts(): Promise<IPayoutDocument[]> {
    const pendingPayouts =
      await this._payoutRepository.fetchPayoutsByStatus("PENDING");

    const now = new Date();
    const eligibleIds: string[] = [];
    for (const payout of pendingPayouts) {
      const booking: any = payout.bookingId;
      const pkg = booking?.packageId;
      if (
        booking &&
        pkg &&
        booking.status === "CONFIRMED" &&
        booking.attendance === "COMPLETED"
      ) {
        const startDate = new Date(pkg.startDate);
        const tourEndDate = new Date(startDate);
        tourEndDate.setDate(tourEndDate.getDate() + pkg.duration.day);
        if (now >= tourEndDate) {
          eligibleIds.push(payout._id.toString());
        }
      }
    }

    if (eligibleIds.length > 0) {
      await this._payoutRepository.updateMany(
        { _id: { $in: eligibleIds }, payoutStatus: "PENDING" },
        { payoutStatus: "ELIGIBLE" },
      );
    }

    return this._payoutRepository.fetchPayoutsByStatus("ELIGIBLE");
  }

  async createPayoutOrder(payoutId: string) {
    const payout = await this._payoutRepository.findById(payoutId);
    if (!payout) {
      throw new CustomError(
        RESPONSE_MESSAGES.PAYOUT.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    if (payout.payoutStatus !== "ELIGIBLE") {
      throw new CustomError(
        RESPONSE_MESSAGES.PAYOUT.ERROR.ALREADY_PROCESSED,
        StatusCode.BAD_REQUEST,
      );
    }

    const operator = await this._operatorRepository.findById(
      payout.operatorId.toString(),
    );
    if (!operator) {
      throw new CustomError(
        RESPONSE_MESSAGES.OPERATOR.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }

    const order = await this._paymentService.createOrder({
      amount: payout.netPayoutAmount,
      currency: "INR",
      receipt: `reciept-payout-${Date.now()}`,
      notes: {
        payoutId: payout._id.toString(),
        operatorId: payout.operatorId.toString(),
      },
    });
    if (!order) {
      throw new CustomError(
        RESPONSE_MESSAGES.PAYOUT.ERROR.INITIATE,
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      operatorName: operator.name,
      payoutDescription: `Operator payout -Net amount :Rs ${payout.netPayoutAmount}`,
    };
  }

  async verifyAndCompletePayout(dto: {
    payoutId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    const isValid = this._paymentService.verifySignature({
      razorpayOrderId: dto.razorpayOrderId,
      razorpayPaymentId: dto.razorpayPaymentId,
      razorpaySignature: dto.razorpaySignature,
    });
    if (!isValid) {
      throw new CustomError(
        RESPONSE_MESSAGES.PAYOUT.ERROR.INVALID_SIGNATURE,
        StatusCode.BAD_REQUEST,
      );
    }

    const updatedPayout = await this._payoutRepository.updateById(
      dto.payoutId,
      {
        payoutStatus: "PAID",
        razorpayOrderId: dto.razorpayOrderId,
        razorpayPaymentId: dto.razorpayPaymentId,
        paidAt: new Date(),
      },
    );
    if (!updatedPayout) {
      throw new CustomError(
        RESPONSE_MESSAGES.PAYOUT.ERROR.UPDATE,
        StatusCode.NOT_FOUND,
      );
    }

    return {
      message: RESPONSE_MESSAGES.PAYOUT.SUCCESS.TRANSFERRED,
      payout: updatedPayout,
    };
  }
}
