import { inject, injectable } from "inversify";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import type { IOperatorRepository } from "../interfaces/IOperatorRepository";
import type { IPaymentService } from "../interfaces/IPaymentService";
import type { ISubscriptionPlanRepository } from "../interfaces/ISubscriptionPlanRepository";
import { ISubscriptionService } from "../interfaces/ISubscriptionService";
import { Types } from "../types/types";
import { CustomError } from "../utils/customError";
@injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @inject(Types.OperatorRepository)
    private _operatorRepository: IOperatorRepository,
    @inject(Types.SubscriptionPlanRepository)
    private _subscriptionPlanRepository: ISubscriptionPlanRepository,
    @inject(Types.PaymentService) private _paymentService: IPaymentService,
  ) {}

  async createSubscriptionOrder(operatorId: string, planId: string) {
    const plan = await this._subscriptionPlanRepository.findById(planId);
    if (!plan) {
      throw new CustomError(
        RESPONSE_MESSAGES.SUBSCRIPTION_PLAN.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }

    const order = await this._paymentService.createOrder({
      amount: plan.price,
      currency: "INR",
      receipt: `reciept-sub-${Date.now()}`,
      notes: {
        operatorId,
        planId,
      },
    });
    if (!order) {
      throw new CustomError(
        RESPONSE_MESSAGES.PAYMENT.ERROR.INITIATE,
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      planName: plan.name,
      planDescription: `Operator Subscription - ${plan.durationDays} Days Validity`,
    };
  }

  async verifyAndActivateSubscription(dto: {
    operatorId: string;
    planId: string;
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
        RESPONSE_MESSAGES.SUBSCRIPTION.ERROR.INVALID_SIGNATURE,
        StatusCode.BAD_REQUEST,
      );
    }

    const plan = await this._subscriptionPlanRepository.findById(dto.planId);
    if (!plan) {
      throw new CustomError(
        RESPONSE_MESSAGES.SUBSCRIPTION_PLAN.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }

    const operator = await this._operatorRepository.findById(dto.operatorId);
    if (!operator) {
      throw new CustomError(
        RESPONSE_MESSAGES.OPERATOR.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    const startDate = new Date();
    let endDate = new Date();
    if (
      operator.subscriptionDetails?.status === "active" &&
      operator.subscriptionDetails.endDate &&
      new Date(operator.subscriptionDetails.endDate) > startDate
    ) {
      endDate = new Date(operator.subscriptionDetails.endDate);
    }
    endDate.setDate(endDate.getDate() + plan.durationDays);

    const updatedOperator = await this._operatorRepository.updateById(
      dto.operatorId,
      {
        isPremium: true,
        subscriptionDetails: {
          planId: plan._id,
          startDate,
          endDate,
          status: "active",
        },
      },
    );
    if (!updatedOperator) {
      throw new CustomError(
        RESPONSE_MESSAGES.SUBSCRIPTION.ERROR.UPDATE,
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      message: RESPONSE_MESSAGES.SUBSCRIPTION.SUCCESS.ACTIVATE,
      operator: updatedOperator,
    };
  }
}
