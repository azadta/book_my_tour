import { body } from "express-validator";
import {
  createCouponRequestDTO,
  updateCouponRequestDTO,
  ValidateCouponRequestDTO,
} from "../../dto/coupon/couponRequestDTO";

export class CouponRequestMapper {
  static toValidateCouponDTO(body: any): ValidateCouponRequestDTO {
    return {
      code: body?.code ? String(body.code).trim().toUpperCase() : "",
      bookingAmount: Number(body.bookingAmount) || 0,
      ...(body?.cardBin !== undefined && {
        cardBin: String(body.cardBin).trim(),
      }),
    };
  }

  static toCreateCouponDTO(dto: any): createCouponRequestDTO {
    return {
      code: dto?.code?.trim().toUpperCase(),
      title: dto?.title?.trim(),
      description: dto?.description?.trim(),
      type: dto.type,
      discountType: dto?.discountType,
      discountValue: Number(dto?.discountValue),
      ...(dto?.maxDiscountAmount !== undefined && {
        maxDiscountAmount: Number(dto.maxDiscountAmount),
      }),
      minBookingAmount:
        dto?.minBookingAmount !== undefined ? Number(dto.minBookingAmount) : 0,
      ...(dto?.bankName !== undefined && { bankName: dto.bankName.trim() }),
      ...(dto?.allowedBins !== undefined && { allowedBins: dto.allowedBins }),
      ...(dto?.razorpayOfferId !== undefined && {
        razorpayOfferId: dto.razorpayOfferId.trim(),
      }),
      validTill: new Date(dto?.validTill),
      isActive: dto?.isActive ?? true,
    };
  }

  static toUpdateCouponDTO(dto: any): updateCouponRequestDTO {
    return {
      code: dto?.code?.trim().toUpperCase(),
      title: dto?.title?.trim(),
      description: dto?.description?.trim(),
      type: dto.type,
      discountType: dto?.discountType,
      discountValue: Number(dto?.discountValue),
      ...(dto?.maxDiscountAmount && {
        maxDiscountAmount: Number(dto.maxDiscountAmount),
      }),
      minBookingAmount: dto?.minBookingAmount
        ? Number(dto.minBookingAmount)
        : 0,
      bankName: dto?.bankName?.trim(),
      allowedBins: dto?.allowedBins,
      razorpayOfferId: dto?.razorpayOfferId?.trim(),
      validTill: new Date(dto?.validTill),
      isActive: dto?.isActive ?? true,
    };
  }
}
