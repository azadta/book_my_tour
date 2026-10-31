import {
  CancelBookingBody,
  CreateBookingBody,
  OperatorCancelBookingBody,
  toOperatorReschuduleBookingBody,
  toVerifyCancellationBody,
  UpdateAttendanceBody,
  VerifyBookingPaymentBody
} from "../dto-mapping/dto/booking/bookingRequestDTO";
import {
  BookingResponseDTO,
  cancelBookingResponseDTO,
  CreateBookingOrderResponseDTO,
  OperatorBookingListResponseDTO,
  PendingCancellationItemResponseDTO,
  VerifyPamentResponseDTO,
} from "../dto-mapping/dto/booking/bookingResponseDTO";
import { IPackageResponseDTO } from "../dto-mapping/dto/package/packageResponseDTO";

export interface IBookingService {
  getPendingCancelationRequests(): Promise<
    PendingCancellationItemResponseDTO[]
  >;
  processAdminCancellation(
    body: unknown,
    params: any,
  ): Promise<BookingResponseDTO>;

  getOperatorBookingsService(
    operatorId: string,
    query: any,
  ): Promise<OperatorBookingListResponseDTO>;
  getOperatorBookingDetailsService(
    bookingId: string,
    operatorId: string,
  ): Promise<BookingResponseDTO>;
  operatorCancelBookingService(
    bookingId: string,
    operatorId: string,
    body: OperatorCancelBookingBody,
  ): Promise<BookingResponseDTO>;
  operatorRescheduleBookingService(
    bookingId: string,
    operatorId: string,
    body: toOperatorReschuduleBookingBody,
  ): Promise<IPackageResponseDTO>;
  updateAttendanceService(
    operatorId: string,
    bookingId: string,
    body: UpdateAttendanceBody,
  ): Promise<BookingResponseDTO>;
  verifyCancellationService(
    bookingId: string,
    operatorId: string,
    body: toVerifyCancellationBody,
  ): Promise<BookingResponseDTO>;
  createBookingOrder(
    userId: string,
    body: CreateBookingBody,
  ): Promise<CreateBookingOrderResponseDTO>;
  verifyAndConfirmBooking(
    userId: string,
    body: VerifyBookingPaymentBody,
  ): Promise<VerifyPamentResponseDTO>;
  findBookingByOrderId(razorpayOrderId: string): Promise<BookingResponseDTO>;
  getUserBookings(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<{
    bookings: BookingResponseDTO[];
    totalCount: number;
  }>;
  cancelBooking(
    userId: string,
    bookingId: string,
    body: CancelBookingBody,
  ): Promise<cancelBookingResponseDTO>;
}
