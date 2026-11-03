import { Types } from "mongoose";
import {
  IAppliedCoupon,
  IBookingPricing,
} from "../../../interfaces/IBookingPricing";
import { IBookingCancellation } from "../../../interfaces/IBookingRepository";
import { IBookingDocument } from "../../../models/Booking";
import {
  BookingCancellationDTO,
  BookingCouponDTO,
  BookingPricingDTO,
  BookingResponseDTO,
  BookingResponseInput,
  cancelBookingResponseDTO,
  cancelBookingResponseinput,
  CreateBookingOrderResponseDTO,
  CreateBookingOrderResponseInput,
  OperatorBookingListResponseDTO,
  PendingCancellationInput,
  PendingCancellationItemResponseDTO,
  VerifyPamentResponseDTO,
  VerifyPamentResponseInput,
} from "../../dto/booking/bookingResponseDTO";

export class BookingResponseMapper {
  private static mapCoupon(
    coupon: IAppliedCoupon | null,
  ): BookingCouponDTO | null {
    if (!coupon) return null;
    return {
      couponId: coupon.couponId?.toString() ?? "",
      code: coupon.code ?? "",
      title: coupon.title ?? "",
      type: coupon.type ?? "",
      discountAmount: Number(coupon.discountAmount ?? 0),
    };
  }
  private static mapPricing(pricing: IBookingPricing): BookingPricingDTO {
    return {
      baseAmount: Number(pricing.baseAmount),
      adultCount: Number(pricing.adultCount),
      childCount: Number(pricing.childCount),
      adultUnitPrice: Number(pricing.adultUnitPrice),
      childUnitPrice: Number(pricing.childUnitPrice),
      adultAmount: Number(pricing.adultAmount),
      childAmount: Number(pricing.childAmount),
      addedActivitiesAmount: Number(pricing.addedActivitiesAmount ?? 0),
      removedActivitiesAmount: Number(pricing.removedActivitiesAmount ?? 0),
      subtotal: Number(pricing?.subtotal ?? 0),
      generalCoupon: this.mapCoupon(pricing?.generalCoupon),
      bankCoupon: this.mapCoupon(pricing?.bankCoupon),
      totalDiscount: Number(pricing?.totalDiscount ?? 0),
      walletApplied: Number(pricing.walletApplied ?? 0),
      finalAmount: Number(pricing?.finalAmount ?? 0),
    };
  }

  private static mapCancellation(
    cancellation: IBookingCancellation,
  ): BookingCancellationDTO {
    return {
      requestedAt: cancellation?.requestedAt
        ? new Date(cancellation.requestedAt).toISOString()
        : null,
      processedAt: cancellation?.processedAt
        ? new Date(cancellation.processedAt).toISOString()
        : null,
      refundAmount: Number(cancellation?.refundAmount ?? 0),
      reason: cancellation?.reason ?? "",
      adminNotes: cancellation?.adminNotes ?? "",
    };
  }
  static toBookingDTO(entity: BookingResponseInput): BookingResponseDTO {
    return {
      _id: entity?._id.toString() ?? "",
      userId:
        entity.userId instanceof Types.ObjectId
          ? entity.userId.toString()
          : {
              _id: entity?.userId?._id.toString() ?? "",
              name: entity.userId?.name ?? "",
              email: entity.userId?.email ?? "",
            },

      packageId:
        entity.packageId instanceof Types.ObjectId
          ? entity.packageId.toString()
          : {
              _id: entity?.packageId?._id.toString() ?? "",
              name: entity.packageId?.name ?? "",
              startDate: new Date(
                entity?.packageId?.startDate ?? Date.now(),
              ).toISOString(),
              images: Array.isArray(entity?.packageId?.images)
                ? entity.packageId.images
                : [],
            },

      razorpayOrderId: entity.razorpayOrderId ?? "",
      razorpayPaymentId: entity.razorpayPaymentId ?? null,
      addedActivityIds: Array.isArray(entity?.addedActivityIds)
        ? entity.addedActivityIds
        : [],
      removedActivityIds: Array.isArray(entity?.removedActivityIds)
        ? entity.removedActivityIds
        : [],

      status: entity?.status ?? "PENDING",

      attendance: entity?.attendance ?? "PENDING",
      checkInTime: entity?.checkInTime
        ? new Date(entity.checkInTime).toISOString()
        : null,
      cancellation: this.mapCancellation(entity?.cancellation),
      pricing: this.mapPricing(entity?.pricing),
      createdAt: entity?.createdAt
        ? new Date(entity.createdAt).toISOString()
        : new Date().toISOString(),
      updatedAt: entity?.updatedAt
        ? new Date(entity.updatedAt).toISOString()
        : new Date().toISOString(),
    };
  }
  static toBookingListDTO(
    entities: BookingResponseInput[] | IBookingDocument[],
  ): BookingResponseDTO[] {
    if (!Array.isArray(entities)) return [];
    return entities.map((entity) => this.toBookingDTO(entity));
  }

  static toCancelBookingResponseDTO(
    serviceResult: cancelBookingResponseinput,
  ): cancelBookingResponseDTO {
    return {
      requiresAdminApproval: Boolean(serviceResult?.requiresAdminApproval),
      refundAmount: Number(serviceResult?.refundAmount ?? 0),
      message: serviceResult.message ?? "",
      booking: this.toBookingDTO(serviceResult?.booking),
    };
  }

  static toCreateBookingOrderResposeDTO(
    serviceResult: CreateBookingOrderResponseInput,
  ): CreateBookingOrderResponseDTO {
    return {
      isFullyPaidByWallet: serviceResult.isFullyPaidByWallet,
      bookingId: serviceResult.bookingId.toString(),
      keyId: serviceResult.keyId ?? "",
      packageDescription: serviceResult.packageDescription ?? "",
      packageName: serviceResult.packageName ?? "",
      orderId: serviceResult?.orderId ?? "",
      amount: Number(serviceResult?.amount ?? 0),
      currency: serviceResult?.currency ?? "INR",
    };
  }

  static toVerifyPayementResponseDTO(
    serviceResult: VerifyPamentResponseInput,
  ): VerifyPamentResponseDTO {
    return {
      message: serviceResult?.message ?? "",
      ...(serviceResult.bookingId && {
        bookingId: serviceResult?.bookingId.toString(),
      }),
    };
  }

  static toOperatorBookingListResponseDTO(
    data: { bookings: BookingResponseInput[]; totalCount: number },
    page: number,
    limit: number,
  ): OperatorBookingListResponseDTO {
    const totalCount = Number(data?.totalCount ?? data.bookings.length);
    return {
      bookings: this.toBookingListDTO(data.bookings),
      totalCount,
      page,
      limit,
    };
  }

  static toPendingCancellationListDTO(
    entities: PendingCancellationInput[],
  ): PendingCancellationItemResponseDTO[] {
    if (!Array.isArray(entities)) return [];
    return entities.map((entity) => ({
      _id: entity._id?.toString() ?? "",
      user: {
        _id: entity?.userId?._id.toString() ?? "",
        name: entity?.userId?.name ?? "",
        email: entity?.userId?.email ?? "",
        ...(entity.userId.phone && { phone: entity?.userId?.phone }),
      },
      package: {
        _id: entity?.packageId?._id.toString() ?? "",
        name: entity?.packageId?.name ?? "",
        ...(entity?.packageId?.startDate && {
          startDate: new Date(entity.packageId.startDate).toISOString(),
        }),
      },
      cancellationReason: entity?.cancellation?.reason ?? "",
      ...(entity?.cancellation?.requestedAt && {
        requestedAt: new Date(entity.cancellation.requestedAt).toISOString(),
      }),

      refundAmount: Number(entity?.cancellation?.refundAmount ?? 0),
    }));
  }
}
