import { CouponType } from "../models/Coupon";

export interface IAppliedCoupon {
  couponId: string;
  code: string;
  title: string;
  type: CouponType;
  discountAmount: number;
}

export interface IBookingPricing {
  baseAmount: number;
  addedActivitiesAmount: number;
  removedActivitiesAmount: number;
  subtotal: number;
  generalCoupon?: IAppliedCoupon;
  bankCoupon?: IAppliedCoupon
  totalDiscount: number;
  finalAmount: number;
}
