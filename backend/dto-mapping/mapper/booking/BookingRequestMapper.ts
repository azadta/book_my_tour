import {
  CancelBookingBody,
  CancelBookingRequestDTO,
  CreateBookingBody,
  CreateBookingRequestDTO,
  GetOperatorBookingsQuery,
  GetOperatorBookingsQueryDTO,
  OperatorCancelBookingRequestDTO,
  OperatorRescheduleBookingRequestDTO,
  ProcessAdminCancellationBody,
  ProcessAdminCancellationRequestDTO,
  toOperatorReschuduleBookingBody,
  UpdateAttendanceRequestDTO,
  VerifyBookingPaymentBody,
  VerifyCancellationRequestDTO,
  VerifyPaymentRequestDTO,
} from "../../dto/booking/bookingRequestDTO";

export class BookingRequestMapper {
  static toCancelBookingDTO(body: CancelBookingBody): CancelBookingRequestDTO {
    return {
      reason: body?.reason ?? "",
    };
  }

  static toCreateBookingDTO(body: CreateBookingBody): CreateBookingRequestDTO {
    return {
      packageId: body.packageId,
      adultCount: Number(body.adultCount),
      childCount: Number(body.childCount ?? 0),
      primaryContact: {
        name: body?.primaryContact.name,
        email: body?.primaryContact.email,
        phone: body?.primaryContact.phone,
      },
      members: Array.isArray(body?.members)
        ? body.members.map((member: any) => ({
            type: member.type,
            firstName: member.firstName,
            lastName: member.lastName,
            dob: new Date(member.dob),
            gender: member.gender,
            passportNumber: member.passportNumber || null,
          }))
        : [],

      addedActivityIds: Array.isArray(body.addedActivityIds)
        ? body.addedActivityIds
        : [],
      removedActivityIds: Array.isArray(body.removedActivityIds)
        ? body.removedActivityIds
        : [],
      ...(body.generalCouponCode !== undefined && {
        generalCouponCode: body.generalCouponCode,
      }),
      ...(body.bankCouponCode !== undefined && {
        bankCouponCode: body.generalCouponCode,
      }),
      isWalletApplied:
        body.isWalletApplied === true || body.isWalletApplied === "true",
    };
  }
  static toVerifyPaymentDTO(
    body: VerifyBookingPaymentBody,
  ): VerifyPaymentRequestDTO {
    return {
      razorpayOrderId: body.razorpayOrderId,
      razorpayPaymentId: body.razorpayPaymentId,
      razorpaySignature: body.razorpaySignature,
      packageId: body.packageId,
    };
  }

  static toUpdateAttendanceDTO(body: any): UpdateAttendanceRequestDTO {
    return {
      attendance: body?.attendance ?? "",
    };
  }

  static toOperatorCancelBookingDTO(
    body: any,
  ): OperatorCancelBookingRequestDTO {
    return {
      reason: body.reason ?? "",
    };
  }
  static toOperatorReschuduleBookingDTO(
    body: toOperatorReschuduleBookingBody,
  ): OperatorRescheduleBookingRequestDTO {
    return {
      startDate: new Date(body.startDate),
    };
  }

  static toVerifyCancellationDTO(body: any): VerifyCancellationRequestDTO {
    return {
      action: body.action === "APPROVE" ? "APPROVE" : "REJECT",
      operatorNotes: body?.operatorNotes ?? "",
    };
  }

  static toGetOperatorBookingsQueryDTO(
    query: GetOperatorBookingsQuery,
  ): GetOperatorBookingsQueryDTO {
    const page = Number(query?.page) > 0 ? Number(query.page) : 1;
    const limit = Number(query?.limit) > 0 ? Number(query.limit) : 5;
    const skip = (page - 1) * limit;
    return {
      ...(query?.status && { status: String(query.status) }),
      skip,
      limit,
    };
  }

  static toProcessAdminCancellationDTO(
    body: ProcessAdminCancellationBody,
  ): ProcessAdminCancellationRequestDTO {
    return {
      approve: body.approve,
      adminNotes: body.adminNotes,
    };
  }
}
