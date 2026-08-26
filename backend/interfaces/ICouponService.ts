import { ICouponDocument } from "../models/Coupon";

export interface ICouponService {
  getAllCoupons(
    page: number,
    limit: number,
  ): Promise<{
    coupons: ICouponDocument[];
    totalCount: number;
  }>;
  getCouponById(id: string): Promise<ICouponDocument>;
  createCoupon(couponData: Partial<ICouponDocument>): Promise<ICouponDocument>;
  updateCoupon(
    id: string,
    couponData: Partial<ICouponDocument>,
  ): Promise<ICouponDocument | null>;
  toggleCouponStatus(
    id: string,
    isActive: boolean,
  ): Promise<ICouponDocument | null>;
  getAllAvailableCoupons(): Promise<{
    bankOffers: ICouponDocument[];
    generalCoupons: ICouponDocument[];
  }>;
  validateAndCalculateCouponDiscount(
    code: string,
    bookingAmount: number,
    cardBin?: string | undefined,
  ): Promise<{
    discountAmount: number;
    finalPrice: number;
    coupon: ICouponDocument;
  }>;
}
