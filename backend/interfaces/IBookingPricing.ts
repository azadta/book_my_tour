import { Types } from "mongoose";
import { CouponType } from "../models/Coupon";

export interface IAppliedCoupon {
  couponId: Types.ObjectId;
  code: string;
  title: string;
  type: CouponType;
  discountAmount: number;
}

export interface IBookingPricing {
  baseAmount:number,
  adultCount: number;
  childCount: number;
  adultUnitPrice: number;
  childUnitPrice: number;
  adultAmount: number;
  childAmount: number;
  addedActivitiesAmount: number;
  removedActivitiesAmount: number;
  subtotal: number;
  generalCoupon: IAppliedCoupon|null;
  bankCoupon: IAppliedCoupon|null;
  totalDiscount: number;
  finalAmount: number;
  walletApplied: number;
}
