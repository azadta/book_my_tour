import {
  createCouponInput,
  createCouponRequestDTO,
  updateCouponRequestDTO,
  ValidateCouponBody,
  ValidateCouponRequestDTO,
} from "../dto-mapping/dto/coupon/couponRequestDTO";
import {
  AvailableCouponsResponseDTO,
  CouponResponseDTO,
  ValidateCouponResponseDTO,
} from "../dto-mapping/dto/coupon/couponResponseDTO";
import { ICouponDocument } from "../models/Coupon";

export interface ICouponService {
  getCouponById(id: string): Promise<CouponResponseDTO>;
  createCoupon(body: createCouponInput): Promise<CouponResponseDTO>;
  updateCoupon(id: string, body: createCouponInput): Promise<CouponResponseDTO>;
  toggleCouponStatus(id: string, isActive: boolean): Promise<CouponResponseDTO>;

  validateAndCalculateCouponDiscount(
    body: ValidateCouponBody,
  ): Promise<ValidateCouponResponseDTO>;
  getAllAvailableCoupons(): Promise<AvailableCouponsResponseDTO>;
  getAllCoupons(
    page: number,
    limit: number,
  ): Promise<{
    coupons: CouponResponseDTO[];
    totalCount: number;
  }>;
}
