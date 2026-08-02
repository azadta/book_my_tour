import { injectable } from "inversify";
import {
  ICreateRazorpayOrderDTO,
  IPaymentService,
  IVerifyPaymentDTO,
  IVerifyWebhookDTO,
} from "../interfaces/IPaymentService";
import Razorpay from "razorpay";
import crypto from "crypto";

@injectable()
export class RazorpayPaymentService implements IPaymentService {
  private razorpay: Razorpay;
  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });
  }

  async createOrder(data: ICreateRazorpayOrderDTO) {
    try {
      const options = {
        amount: Math.round(data.amount * 100),
        currency: data.currency || "INR",
        receipt: data.receipt,
        notes: data.notes || {},
      };

      const order = await this.razorpay.orders.create(options);

      return {
        id: order.id,
        currency: order.currency,
        amount: Number(order.amount),
      };
    } catch (error: any) {
      console.error(error);
    }
  }

  verifySignature(data: IVerifyPaymentDTO): boolean {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = data;
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(body)
      .digest("hex");

    return expectedSignature === razorpaySignature;
  }

  verifyWebhookSignature(data: IVerifyWebhookDTO): boolean {
    const { rawBody, signature, secret } = data;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");
    return expectedSignature === signature;
  }
}
