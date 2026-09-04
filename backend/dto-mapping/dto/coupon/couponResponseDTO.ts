import { CouponType } from "../../../models/Coupon";

export interface CouponResponseDTO {
  _id: string;
  code: string;
  title: string;
  description: string;
  type: CouponType;
  discountType: "PERCENTAGE" | "FLAT";
  discountValue: number;
  maxDiscountAmount?: number;
  minBookingAmount: number;
  bankName?: string;
  allowedBins?: string[];
  razorpayOfferId?: string;
  validTill: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AvailableCouponsResponseDTO {
  bankOffers: CouponResponseDTO[];
  generalCoupons: CouponResponseDTO[];
}

export interface ValidateCouponResponseDTO {
  discountAmount: number;
  finalPrice: number;
  coupon: CouponResponseDTO;
}

export interface PaginatedCouponResponseDTO {
  coupons: CouponResponseDTO[];
  totalCount: number;
}
