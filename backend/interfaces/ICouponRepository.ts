import { ICouponDocument } from "../models/Coupon";
import { IBaseRepository } from "./IBaseRepository";

export interface ICouponRepository extends IBaseRepository<ICouponDocument> {
  findActiveCoupons(): Promise<ICouponDocument[]>;
  findByCode(code: string): Promise<ICouponDocument | null>;
  findBankOffersByBin(bin: string): Promise<ICouponDocument[]>;
  findAllCoupons(
    page: number,
    limit:number
  ): Promise<{ coupons: ICouponDocument[]; totalCount: number }>;
  toggleStatus(id: string, isActive: boolean): Promise<ICouponDocument | null>;
  updateCouponById(id: string, updatePayload: any): Promise<ICouponDocument | null>
}
