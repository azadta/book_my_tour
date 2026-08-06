import { ICouponRepository } from "../interfaces/ICouponRepository";
import { Coupon, CouponType, ICouponDocument } from "../models/Coupon";
import { BaseRepository } from "./baseRepository";

export class CouponRepository
  extends BaseRepository<ICouponDocument>
  implements ICouponRepository
{
  constructor() {
    super(Coupon);
  }
  async findActiveCoupons(): Promise<ICouponDocument[]> {
    return Coupon.find({
      isActive: true,
      validTill: { $gte: new Date() },
    }).sort({ createdAt: -1 });
  }

  async findByCode(code: string): Promise<ICouponDocument | null> {
    return Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      validTill: { $gte: new Date() },
    });
  }

  async findBankOffersByBin(bin: string): Promise<ICouponDocument[]> {
    return Coupon.find({
      type: CouponType.BANK,
      allowedBins: bin,
      isActive: true,
      validTill: { $gte: new Date() },
    });
  }

  async findAllCoupons(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ coupons: ICouponDocument[]; totalCount: number }> {
    const skip = (page - 1) * limit;
    const [coupons, totalCount] = await Promise.all([
      Coupon.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Coupon.countDocuments(),
    ]);
    return { coupons, totalCount };
  }

  async toggleStatus(
    id: string,
    isActive: boolean,
  ): Promise<ICouponDocument | null> {
    return Coupon.findByIdAndUpdate(id, { $set: { isActive } }, { new: true });
  }

  async updateCouponById(
    id: string,
    updatePayload: any,
  ): Promise<ICouponDocument | null> {
    return Coupon.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });
  }
}
