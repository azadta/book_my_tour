import { CouponType } from "../../../models/Coupon";

export interface createCouponRequestDTO {
  code: string;
  title: string;
  description: string;
  type?: CouponType;
  discountType: "PERCENTAGE" | "FLAT";
  discountValue: number;
  maxDiscountAmount?: number;
  minBookingAmount?: number;
  bankName?: string;
  allowedBins?: string[];
  razorpayOfferId?: string;
  validTill: Date;
  isActive: boolean;
}

export type updateCouponRequestDTO = createCouponRequestDTO

export interface ValidateCouponRequestDTO {
  code: string;
  bookingAmount: number;
  cardBin?: string;
}

export interface ToggleCouponStatusRequestDTO {
  isActive: boolean;
}
