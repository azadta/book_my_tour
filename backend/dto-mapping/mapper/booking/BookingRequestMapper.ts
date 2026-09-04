import {
  CancelBookingRequestDTO,
  CreateBookingRequestDTO,
  GetOperatorBookingsQueryDTO,
  OperatorCancelBookingRequestDTO,
  OperatorRescheduleBookingRequestDTO,
  ProcessAdminCancellationRequestDTO,
  UpdateAttendanceRequestDTO,
  VerifyCancellationRequestDTO,
  VerifyPaymentRequestDTO,
} from "../../dto/booking/bookingRequestDTO";

export class BookingRequestMapper {
  static toCancelBookingDTO(
    userId: string,
    params: any,
    body: any,
  ): CancelBookingRequestDTO {
    return {
      userId,
      bookingId: params.bookingId || "",
      reason: body?.reason ?? "",
    };
  }

  static toCreateBookingDTO(
    userId: string,
    body: any,
  ): CreateBookingRequestDTO {
    return {
      userId,
      packageId: body?.packageId || "",
      addedActivityIds: Array.isArray(body.addedActivityIds)
        ? body.addedActivityIds
        : [],
      removedActivityIds: Array.isArray(body.removedActivityIds)
        ? body.removedActivityIds
        : [],
      generalCouponCode: body?.generalCouponCode,
      bankCouponCode: body?.bankCouponCode,
      useWallet: Boolean(body?.useWallet),
    };
  }
  static toVerifyPaymentDTO(
    userId: string,
    body: any,
  ): VerifyPaymentRequestDTO {
    return {
      userId,
      razorpayOrderId: body?.razorpayOrderId ?? "",
      razorpayPaymentId: body?.razorpayPaymentId ?? "",
      razorpaySignature: body?.razorpaySignature ?? "",
      packageId: body.packageId ?? "",
    };
  }

  static toUpdateAttendanceDTO(
    operatorId: string,
    params: any,
    body: any,
  ): UpdateAttendanceRequestDTO {
    return {
      operatorId,
      bookingId: params?.bookingId || "",
      attendance: body?.attendance ?? "",
    };
  }

  static toOperatorCancelBookingDTO(
    operatorId: string,
    params: any,
    body: any,
  ): OperatorCancelBookingRequestDTO {
    return {
      operatorId,
      bookingId: params?.bookingId || "",
      reason: body.reason ?? "",
    };
  }
  static toOperatorReschuduleBookingDTO(
    operatorId: string,
    params: any,
    body: any,
  ): OperatorRescheduleBookingRequestDTO {
    return {
      operatorId,
      bookingId: params?.bookingId || "",
      startDate: body?.startDate ?? "",
    };
  }

  static toVerifyCancellationDTO(
    operatorId: string,
    params: any,
    body: any,
  ): VerifyCancellationRequestDTO {
    return {
      operatorId,
      bookingId: params?.bookingId ?? "",
      action: body.action === "APPROVE" ? "APPROVE" : "REJECT",
      operatorNotes: body?.operatorNotes ?? "",
    };
  }

  static toGetOperatorBookingsQueryDTO(
    operatorId: string,
    query: any,
  ): GetOperatorBookingsQueryDTO {
    const page = Number(query?.page) > 0 ? Number(query.page) : 1;
    const limit = Number(query?.limit) > 0 ? Number(query.limit) : 5;
    const skip = (page - 1) * limit;
    return {
      operatorId,
      ...(query?.status && { status: String(query.status) }),
      skip,
      limit,
    };
  }

  static toProcessAdminCancellationDTO(
    params: any,
    body: any,
  ): ProcessAdminCancellationRequestDTO {
    return {
      bookingId: params?.bookingId ?? "",
      approve: Boolean(body.approve),
      adminNotes: body?.adminNotes ?? undefined,
    };
  }
}
