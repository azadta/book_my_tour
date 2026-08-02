import { inject, injectable } from "inversify";
import { Types } from "../types/types";
import type { IPaymentService } from "../interfaces/IPaymentService";
import type { IBookingRepository } from "../interfaces/IBookingRepository";
import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../constants/statusCodeConstants";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { IWebhookController } from "../interfaces/IWebhookController";

@injectable()
export class WebhookController implements IWebhookController {
  constructor(
    @inject(Types.PaymentService) private paymentService: IPaymentService,
    @inject(Types.BookingRepository)
    private bookingRepository: IBookingRepository,
  ) {}

  handleRazorpayWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const signature = req.headers["x-razorpay-signature"] as string;
      const rawBody = (req as any).rawBody || JSON.stringify(req.body);
      const isValid = this.paymentService.verifyWebhookSignature({
        rawBody,
        signature,
        secret: process.env.RAZORPAY_WEBHOOK_SECRET as string,
      });
      if (!isValid) {
        res
          .status(StatusCode.BAD_REQUEST)
          .json({ message: RESPONSE_MESSAGES.BOOKING.ERROR.INVALID_SIGNATURE });
      }
      const event = req.body;
      if (event.event === "order.paid") {
        const paymentEntity = event.payload.payment.entity;
        const orderId = paymentEntity.order_id;
        const paymentId = paymentEntity.id;
        await this.bookingRepository.updateStatusByOrderId(orderId, {
          status: "CONFIRMED",
          razorpayPaymentId: paymentId,
        });
      }

      if (event.event === "payment.failed") {
        const paymentEntity = event.payload.payment.entity;
        const orderId = paymentEntity.order_id;
        await this.bookingRepository.updateStatusByOrderId(orderId, {
          status: "FAILED",
        });
      }
      res.status(StatusCode.OK).json({ status: "ok" });
    } catch (error) {
      next(error);
    }
  };
}
