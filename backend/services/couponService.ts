import { inject, injectable } from "inversify";
import { ICouponService } from "../interfaces/ICouponService";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { CustomError } from "../utils/customError";
import { CouponType, ICouponDocument } from "../models/Coupon";
import { StatusCode } from "../constants/statusCodeConstants";
import type { ICouponRepository } from "../interfaces/ICouponRepository";
import { Types } from "../types/types";

@injectable()
export class CouponService implements ICouponService {
  constructor(
    @inject(Types.CouponRepository)
    private couponRepository: ICouponRepository,
  ) {}

  async getAllCoupons(page: number, limit: number) {
    return await this.couponRepository.findAllCoupons(page, limit);
  }

  async getCouponById(id: string) {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new CustomError(
        RESPONSE_MESSAGES.COUPON.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    return coupon;
  }

  async createCoupon(couponData: Partial<ICouponDocument>) {
    if (!couponData.code) {
      throw new CustomError(
        RESPONSE_MESSAGES.COUPON.ERROR.COUPON_CODE_MISSING,
        StatusCode.BAD_REQUEST,
      );
    }
    const existingCoupon = await this.couponRepository.findOne({
      code: couponData.code.toUpperCase(),
    });
    if (existingCoupon) {
      throw new CustomError(
        RESPONSE_MESSAGES.COUPON.ERROR.CODE_ALREADY_EXIST,
        StatusCode.BAD_REQUEST,
      );
    }

    return await this.couponRepository.create({
      ...couponData,
      code: couponData.code.toUpperCase(),
    });
  }

  async updateCoupon(
    id: string,
    couponData: Partial<ICouponDocument>,
  ): Promise<ICouponDocument | null> {
    const existingCoupon = await this.couponRepository.findById(id);
    if (!existingCoupon) {
      throw new CustomError(
        RESPONSE_MESSAGES.COUPON.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }

    if (
      couponData.code &&
      couponData.code.toUpperCase() !== existingCoupon.code
    ) {
      const codeTaken = await this.couponRepository.findOne({
        code: couponData.code.toUpperCase(),
        _id: { $ne: id },
      });

      if (codeTaken) {
        throw new CustomError(
          RESPONSE_MESSAGES.COUPON.ERROR.CODE_ALREADY_EXIST,
          StatusCode.BAD_REQUEST,
        );
      }
    }
    if (couponData.code) couponData.code = couponData.code.toUpperCase();
    const updatedPayload: {
      $set: Partial<ICouponDocument>;
      $unset: Record<string, string>;
    } = {
      $set: { ...couponData },
      $unset: {},
    };

    if (couponData.type === CouponType.GENERAL) {
      ((updatedPayload.$unset.bankName = ""),
        (updatedPayload.$unset.allowedBins = ""),
        delete updatedPayload.$set.bankName);
      delete updatedPayload.$set.allowedBins;
    }

    return this.couponRepository.updateCouponById(id, updatedPayload);
  }

  async toggleCouponStatus(id: string, isActive: boolean) {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new CustomError(
        RESPONSE_MESSAGES.COUPON.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    return this.couponRepository.toggleStatus(id, isActive);
  }

  async getAllAvailableCoupons() {
    const coupons = await this.couponRepository.findActiveCoupons();
    const bankOffers = coupons.filter((c) => c.type === CouponType.BANK);
    const generalCoupons = coupons.filter((c) => c.type === CouponType.GENERAL);
    return { bankOffers, generalCoupons };
  }

  async validateAndCalculateCouponDiscount(
    code: string,
    bookingAmount: number,
    cardBin?: string,
  ): Promise<{
    discountAmount: number;
    finalPrice: number;
    coupon: ICouponDocument;
  }> {
    const coupon = await this.couponRepository.findByCode(code);
    if (!coupon) {
      throw new CustomError(
        RESPONSE_MESSAGES.COUPON.ERROR.INVALID_CODE,
        StatusCode.BAD_REQUEST,
      );
    }
    if (coupon.minBookingAmount && bookingAmount < coupon.minBookingAmount) {
      throw new CustomError(
        RESPONSE_MESSAGES.COUPON.ERROR.MINIMUM_AMOUNT(coupon.minBookingAmount),
      );
    }
    if (coupon.type === CouponType.BANK) {
      if (!cardBin) {
        throw new CustomError(RESPONSE_MESSAGES.COUPON.ERROR.CARD_BIN_MISSING);
      }
      if (
        coupon.allowedBins &&
        coupon.allowedBins.length > 0 &&
        !coupon.allowedBins.includes(cardBin)
      ) {
        throw new CustomError(
          RESPONSE_MESSAGES.COUPON.ERROR.BANK_MISMATCH(coupon.bankName),
        );
      }
    }

    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (bookingAmount * coupon.discountValue) / 100;
      if (
        coupon.maxDiscountAmount &&
        discountAmount > coupon.maxDiscountAmount
      ) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }
    const finalPrice = Math.max(0, bookingAmount - discountAmount);
    return { discountAmount, finalPrice, coupon };
  }
}
