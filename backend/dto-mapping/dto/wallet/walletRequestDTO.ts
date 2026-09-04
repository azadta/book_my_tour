export interface CreateTopupOrderRequestDTO {
  amount: number;
}

export interface verifyTopupPaymentRequestDTO {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}
