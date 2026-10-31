import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import { ICouponController } from "../interfaces/ICouponController";
import type { ICouponService } from "../interfaces/ICouponService";
import { Types } from "../types/types";
import { sendSuccessResponse } from "../utils/apiResponse";
import { CustomError } from "../utils/customError";

@injectable()
export class CouponController implements ICouponController {
  constructor(
    @inject(Types.CouponService) private _couponService: ICouponService,
  ) {}

  getCoupons = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this._couponService.getAllAvailableCoupons();
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.COUPON.SUCCESS.FETCH_AVAILABLE_COUPONS,
        data,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  getAllCoupons = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const result = await this._couponService.getAllCoupons(page, limit);
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.COUPON.SUCCESS.FETCH_COUPONS,
        result,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  getCouponById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const coupon = await this._couponService.getCouponById(id as string);
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.COUPON.SUCCESS.FETCH_COUPON,
        coupon,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  createCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const coupon = await this._couponService.createCoupon(req.body);
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.COUPON.SUCCESS.CREATED,
        coupon,
        StatusCode.CREATED,
      );
    } catch (error) {
      next(error);
    }
  };

  updateCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const updatedCoupon = await this._couponService.updateCoupon(
        id as string,
        req.body,
      );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.COUPON.SUCCESS.UPDATE,
        updatedCoupon,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  toggleCouponStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const updatedCoupon = await this._couponService.toggleCouponStatus(
        id as string,
        isActive,
      );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.COUPON.SUCCESS.TOGGLE_STATUS(isActive),
        updatedCoupon,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  validateCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, bookingAmount } = req.body;
      if (!code || !bookingAmount) {
        throw new CustomError(
          RESPONSE_MESSAGES.COUPON.ERROR.CODE_AND_BOOKING_AMOUNT_MISSING,
          StatusCode.BAD_REQUEST,
        );
      }

      const result =
        await this._couponService.validateAndCalculateCouponDiscount(req.body);
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.COUPON.SUCCESS.VALIDATE,
        result,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };
}
