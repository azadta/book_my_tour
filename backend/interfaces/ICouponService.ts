import {
  createCouponRequestDTO,
  updateCouponRequestDTO,
  ValidateCouponRequestDTO,
} from "../dto-mapping/dto/coupon/couponRequestDTO";
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
  createCoupon(dto: createCouponRequestDTO): Promise<ICouponDocument>;
  updateCoupon(
    id: string,
    dto: updateCouponRequestDTO,
  ): Promise<ICouponDocument | null>;
  toggleCouponStatus(
    id: string,
    isActive: boolean,
  ): Promise<ICouponDocument | null>;
  getAllAvailableCoupons(): Promise<{
    bankOffers: ICouponDocument[];
    generalCoupons: ICouponDocument[];
  }>;
  validateAndCalculateCouponDiscount(dto: ValidateCouponRequestDTO): Promise<{
    discountAmount: number;
    finalPrice: number;
    coupon: ICouponDocument;
  }>;
}
