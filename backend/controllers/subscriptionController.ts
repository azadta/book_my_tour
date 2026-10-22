import { inject, injectable } from "inversify";
import { ISubscriptionController } from "../interfaces/ISubscriptionController";
import type { ISubscriptionService } from "../interfaces/ISubscriptionService";
import { Types } from "../types/types";
import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../constants/statusCodeConstants";
import { RESPONSE_MESSAGES } from "../constants/messages";

  @injectable()
  export class SubscriptionController implements ISubscriptionController {
    constructor(
      @inject(Types.SubscriptionService)
      private _subscriptionService: ISubscriptionService,
    ) {}
    createOrder = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const operatorId = req.user?.id;
        const { planId } = req.body;
        const orderResponse =
          await this._subscriptionService.createSubscriptionOrder(
            operatorId as string,
            planId,
          );
        res.status(StatusCode.OK).json({
          message: RESPONSE_MESSAGES.SUBSCRIPTION.SUCCESS.CREATE_ORDER,
          data: orderResponse,
        });
      } catch (error) {
        next(error);
      }
    };

    verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const operatorId = req.user?.id;
        const { planId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
          req.body;
        const result =
          await this._subscriptionService.verifyAndActivateSubscription({
            operatorId: operatorId as string,
            planId,
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
