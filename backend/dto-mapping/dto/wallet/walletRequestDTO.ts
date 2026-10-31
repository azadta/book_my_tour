import { IWalletTransaction } from "../../../models/Wallet";

export interface CreateTopupOrderRequestDTO {
  amount: number;
}
export interface CreateTopupOrderInput {
  amount: number;
}

export interface verifyTopupPaymentRequestDTO {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}
export interface verifyTopupPaymentInput {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export type CreateWalletTransactionDTO = Omit<
  IWalletTransaction,
  "_id" | "createdAt" | "updatedAt"
>;
