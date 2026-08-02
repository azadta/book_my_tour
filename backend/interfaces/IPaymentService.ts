export interface ICreateRazorpayOrderDTO {
  amount: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface IVerifyPaymentDTO {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface IPaymentService {
  createOrder(
    data: ICreateRazorpayOrderDTO,
  ): Promise<{ id: string; currency: string; amount: number } | undefined>;
  verifySignature(data: IVerifyPaymentDTO): boolean;
  verifyWebhookSignature(data: IVerifyWebhookDTO): boolean;
}

export interface IVerifyWebhookDTO {
  rawBody: string;
  signature: string;
  secret: string;
}
