import { IOperator } from "./IOperator";

export interface ISubscriptionService {
  createSubscriptionOrder(
    operatorId: string,
    planId: string,
  ): Promise<{
    orderId: string;
    amount: number;
    currency: string;
    keyId: string | undefined;
    planName: string;
    planDescription: string;
  }>;
  verifyAndActivateSubscription(dto: {
    operatorId: string;
    planId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Promise<{
    message: "Your subscription has been successfully activated";
    operator: IOperator;
  }>;
}
