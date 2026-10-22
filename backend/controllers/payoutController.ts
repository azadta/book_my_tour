import { inject, injectable } from "inversify";
import { IPayoutController } from "../interfaces/IPayoutController";
import { Types } from "../types/types";
import type { IPayoutService } from "../interfaces/IPayoutService";
import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../constants/statusCodeConstants";

@injectable()
export class PayoutController implements IPayoutController {
  constructor(
    @inject(Types.PayoutService) private _payoutService: IPayoutService,
  ) {}

  getEligiblePayouts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const payouts = await this._payoutService.sincAndFetchEligiblePayouts();
      res.status(StatusCode.OK).json({ data: payouts });
    } catch (error) {
      next(error);
    }
  };

  createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { payoutId } = req.body;
      const orderResponse =
        await this._payoutService.createPayoutOrder(payoutId);
      res.status(StatusCode.OK).json({ data: orderResponse });
    } catch (error) {
      next(error);
    }
  };

  verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        payoutId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      } = req.body;
      const result = await this._payoutService.verifyAndCompletePayout({
        payoutId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });
      res.status(StatusCode.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
}
