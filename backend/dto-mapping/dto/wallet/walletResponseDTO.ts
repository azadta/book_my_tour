export interface WalletTransactionResponseDTO {
  _id: string;
  transactionId: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  type: "CREDIT" | "DEBIT";
  purpose: "WALLET_TOPUP" | "BOOKING_PAYMENT" | "REFUND";
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  description: string;
  createdAt: string;
}

export interface WalletResponseDTO {
  _id: string;
  userId: string;
  balance: number;
  transactions: WalletTransactionResponseDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface TopupOrderResponseDTO {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}
