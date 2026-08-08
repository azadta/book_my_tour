import { IWalletDocument } from "../models/Wallet";

export interface IWalletService {
  getWallet(userId: string): Promise<IWalletDocument>;
  createTopupOrder(
    userId: string,
    amount: number,
  ): Promise<{
    orderId: string;
    amount: number;
    currency: string;
    keyId: string | undefined;
  }>;
  verifyTopupPayment(
    userId: string,
    dto: {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    },
  ): Promise<IWalletDocument | null>;
}
