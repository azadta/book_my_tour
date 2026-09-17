import { inject, injectable } from "inversify";
import { ICouponController } from "../interfaces/ICouponController";
import { Types } from "../types/types";
import type{ ICouponService } from "../interfaces/ICouponService";
import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../constants/statusCodeConstants";
import { CouponResponseMapper } from "../dto-mapping/mapper/coupon/CouponResponseMapper";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { CouponRequestMapper } from "../dto-mapping/mapper/coupon/CouponRequestMapper";

@injectable()
export class CouponController implements ICouponController{
  constructor(@inject(Types.CouponService) private couponService:ICouponService ){

  }
    //operator
      getCoupons = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.couponService.getAllAvailableCoupons();
      res
        .status(StatusCode.OK)
        .json(CouponResponseMapper.toAvailableCouponsDTO(data));
    } catch (error) {
      next(error);
    }
  };


  getAllCoupons = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const result = await this.couponService.getAllCoupons(page, limit);
      res.status(StatusCode.OK).json({
        coupons: CouponResponseMapper.toCouponResponseDTOList(result.coupons),
        totalCount: result.totalCount,
      });
    } catch (error) {
      next(error);
    }
  };

  getCouponById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const coupon = await this.couponService.getCouponById(id as string);
      res
        .status(StatusCode.OK)
        .json(CouponResponseMapper.toCouponResponseDTO(coupon));
    } catch (error) {
      next(error);
    }
  };

  createCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = CouponRequestMapper.toCreateCouponDTO(req.body);
      const rawCoupon = await this.couponService.createCoupon(dto);
      res.status(StatusCode.CREATED).json({
        message: RESPONSE_MESSAGES.COUPON.SUCCESS.CREATED,
        coupon: CouponResponseMapper.toCouponResponseDTO(rawCoupon),
      });
    } catch (error) {
      next(error);
    }
  };

  updateCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const dto = CouponRequestMapper.toUpdateCouponDTO(req.body);

      const rawUpdatedCoupon = await this.couponService.updateCoupon(
        id as string,
        dto,
      );
      res.status(StatusCode.OK).json({
        message: RESPONSE_MESSAGES.COUPON.SUCCESS.UPDATE,
        updatedCoupon:
          CouponResponseMapper.toCouponResponseDTO(rawUpdatedCoupon),
      });
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
      const updatedCoupon = await this.couponService.toggleCouponStatus(
        id as string,
        isActive,
      );
      res.status(StatusCode.OK).json({
        message: RESPONSE_MESSAGES.COUPON.SUCCESS.TOGGLE_STATUS(isActive),
        coupon: CouponResponseMapper.toCouponResponseDTO(updatedCoupon),
      });
    } catch (error) {
      next(error);
    }
  };

  //user
    validateCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, bookingAmount } = req.body;
      if (!code || !bookingAmount) {
        res
          .status(StatusCode.BAD_REQUEST)
          .json(RESPONSE_MESSAGES.COUPON.ERROR.CODE_AND_BOOKING_AMOUNT_MISSING);
          return
      }
      const dto = CouponRequestMapper.toValidateCouponDTO(req.body);
      const result =
        await this.couponService.validateAndCalculateCouponDiscount(dto);
      res
        .status(StatusCode.OK)
        .json(CouponResponseMapper.toValidateCouponResponseDTO(result));
    } catch (error) {
      next(error);
    }
  };





}