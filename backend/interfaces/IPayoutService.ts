import { IPayoutDocument } from "../models/Payout";

export interface IPayoutService {
  sincAndFetchEligiblePayouts(): Promise<IPayoutDocument[]>;
  createPayoutOrder(payoutId: string): Promise<{
    orderId: string;
    amount: number;
    currency: string;
    keyId: string | undefined;
    operatorName: string;
    payoutDescription: string;
  }>;
  verifyAndCompletePayout(dto: {
    payoutId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Promise<{
    message: "Payout transferred and recorded successfully";
    payout: IPayoutDocument;
  }>;
}
