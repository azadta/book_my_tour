import {
  BookingCancellationDTO,
  BookingCouponDTO,
  BookingPricingDTO,
  BookingResponseDTO,
  cancelBookingResponseDTO,
  CreateBookingOrderResponseDTO,
  OperatorBookingListResponseDTO,
  PendingCancellationItemResponseDTO,
  ProcessAdminCancellationResponseDTO,
  VerifyPamentResponseDTO,
} from "../../dto/booking/bookingResponseDTO";

export class BookingResponseMapper {
  private static mapCoupon(coupon: any): BookingCouponDTO | null {
    if (!coupon) return null;
    return {
      couponId: coupon.couponId?.toString() ?? "",
      code: coupon.code ?? "",
      title: coupon.title ?? "",
      type: coupon.type ?? "",
      discountAmount: Number(coupon.discountAmount ?? 0),
    };
  }
  private static mapPricing(pricing: any): BookingPricingDTO {
    return {
      baseAmount: Number(pricing?.baseAmount ?? 0),
      addedActivitiesAmount: Number(pricing.addedActivitiesAmount ?? 0),
      removedActivitiesAmount: Number(pricing.removedActivitiesAmount ?? 0),
      subtotal: Number(pricing?.subtotal ?? 0),
      generalCoupon: this.mapCoupon(pricing?.generalCoupon),
      bankCoupon: this.mapCoupon(pricing?.bankCoupon),
      totalDiscount: Number(pricing?.discount ?? 0),
      walletApplied: Number(pricing.walletApplied ?? 0),
      finalAmount: Number(pricing?.finalAmount ?? 0),
    };
  }

  private static mapCancellation(cancellation: any): BookingCancellationDTO {
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
  static toBookingDTO(entity: any): BookingResponseDTO {
    return {
      _id: entity?._id.toString() ?? "",
      userId:
        typeof entity?.userId === "object" && entity?.userId !== null
          ? {
              _id: entity?.userId?._id.toString() ?? "",
              name: entity.userId?.name ?? "",
            }
          : (entity?.userId.toString() ?? ""),
      packageId:
        typeof entity?.packageId === "object" && entity?.packageId !== null
          ? {
              _id: entity?.packageId?._id.toString() ?? "",
              name: entity.packageId?.name ?? "",
              startDate: new Date(
                entity?.packageId?.startDate ?? Date.now(),
              ).toISOString(),
              images: Array.isArray(entity?.packageId?.images)
                ? entity.packageId.images
                : [],
            }
          : (entity?.packageId.toString() ?? ""),
      razorpayOrderId: entity.razorpayOrderId ?? "",
      razorpayPaymentId: entity.razorpayPaymentId ?? null,
      addedActivityIds: Array.isArray(entity?.addedActivityIds)
        ? entity.addedActivityIds.map((id: any) => id.toString())
        : [],
      removedActivityIds: Array.isArray(entity?.removedActivityIds)
        ? entity.removedActivityIds.map((id: any) => id.toString())
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
  static toBookingListDTO(entities: any[]): BookingResponseDTO[] {
    if (!Array.isArray(entities)) return [];
    return entities.map((entity) => this.toBookingDTO(entity));
  }

  static toCancelBookingResponseDTO(
    serviceResult: any,
  ): cancelBookingResponseDTO {
    return {
      requiresAdminApproval: Boolean(serviceResult?.requiresAdminApproval),
      refundAmount: Number(
        serviceResult?.refundAmount ?? serviceResult?.estimatedRefund ?? 0,
      ),
      message: serviceResult.message ?? "",
      booking: this.toBookingDTO(serviceResult?.booking),
    };
  }

  static toCreateBookingOrderResposeDTO(
    serviceResult: any,
  ): CreateBookingOrderResponseDTO {
    return {
      isFullyPaidByWallet: serviceResult.isFullyPaidByWallet,
      keyId: serviceResult.keyId ?? "",
      packageDescription: serviceResult.packageDescription ?? "",
      packageName: serviceResult.packageName ?? "",
      orderId: serviceResult?.orderId ?? "",
      amount: Number(serviceResult?.amount ?? 0),
      currency: serviceResult?.currency ?? "INR",
    };
  }

  static toVerifyPayementResponseDTO(
    serviceResult: any,
  ): VerifyPamentResponseDTO {
    return {
      message: serviceResult?.message ?? "",
      bookingId: serviceResult?.bookingId,
    };
  }

  static toOperatorBookingListResponseDTO(
    data: any,
    page: number,
    limit: number,
  ): OperatorBookingListResponseDTO {
    const rawBookings = Array.isArray(data?.bookings)
      ? data.bookings
      : Array.isArray(data)
        ? data
        : [];
    const totalCount = Number(data?.totalCount ?? rawBookings.length);
    return {
      bookings: this.toBookingListDTO(rawBookings),
      totalCount,
      page,
      limit,
    };
  }

  static toPendingCancellationListDTO(
    entities: any[],
  ): PendingCancellationItemResponseDTO[] {
    if (!Array.isArray(entities)) return [];
    return entities.map((entity) => ({
      _id: entity._id?.toString() ?? "",
      user: {
        _id: entity?.userId?._id.toString ?? "",
        name: entity?.userId?.name ?? "",
        email: entity?.userId?.email ?? "",
        phone: entity?.userId?.phone,
      },
      package: {
        _id: entity?.packageId?._id.toString() ?? "",
        name: entity?.packageId?.name ?? "",
        ...(entity?.packageId?.startDate && {
          startDate: new Date(entity.packageId.startDate).toISOString(),
        }),
      },
      cancellationReason:
        entity?.cancellation?.reason ?? entity?.cancellationReason,
      ...(entity?.cancellation?.requestedAt && {
        requestedAt: new Date(entity.cancellation.requestedAt).toISOString(),
      }),

      refundAmount: Number(entity?.cancellation?.refundAmount ?? 0),
    }));
  }

  static toProcessAdminCancellationResponseDTO(
    updatedBookingEntity: any,
    approve: boolean,
    successMessage: string,
  ): ProcessAdminCancellationResponseDTO {
    return {
      success: true,
      message: successMessage,
      data: this.toBookingDTO(updatedBookingEntity),
    };
  }
}
