import { ICouponDocument } from "../../../models/Coupon";
import {
  AvailableCouponsResponseDTO,
  AvailalbleCouponsMapperInput,
  CouponResponseDTO,
  ValidateCouponResponseDTO,
} from "../../dto/coupon/couponResponseDTO";

export class CouponResponseMapper {
  static toCouponResponseDTO(doc: ICouponDocument): CouponResponseDTO {
    return {
      _id: doc?._id?.toString() ?? "",
      code: doc?.code ?? "",
      title: doc.title ?? "",
      description: doc.description ?? "",
      type: doc?.type,
      discountType: doc?.discountType,
      discountValue: doc?.discountValue,
      maxDiscountAmount: doc?.maxDiscountAmount,
      minBookingAmount: doc?.minBookingAmount ?? 0,
      bankName: doc?.bankName,
      ...(doc.allowedBins !== undefined && { allowedBins: doc?.allowedBins }),
      razorpayOfferId: doc.razorpayOfferId,
      validTill: doc.validTill.toISOString(),
      isActive: doc.isActive,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  }

  static toCouponResponseDTOList(docs: ICouponDocument[]): CouponResponseDTO[] {
    return docs.map((doc) => this.toCouponResponseDTO(doc));
  }

  static toAvailableCouponsDTO(
    data: AvailalbleCouponsMapperInput,
  ): AvailableCouponsResponseDTO {
    return {
      bankOffers: this.toCouponResponseDTOList(data?.bankOffers),
      generalCoupons: this.toCouponResponseDTOList(data?.generalCoupons),
    };
  }

  static toValidateCouponResponseDTO(data: any): ValidateCouponResponseDTO {
    return {
      discountAmount: data?.discountAmount,
      finalPrice: data?.finalPrice,
      coupon: this.toCouponResponseDTO(data?.coupon),
    };
  }
}
