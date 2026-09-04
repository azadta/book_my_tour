import { Types } from "mongoose";
import {
  AttendanceStatus,
  IBookingDocument,
  IPopulatedBooking,
} from "../models/Booking";
import { Ipackage } from "../models/Package";
import { IOperatorBookingDetails } from "./IBooking";
import { IBooking } from "./IBookingRepository";
import {
  CancelBookingRequestDTO,
  CreateBookingRequestDTO,
  OperatorCancelBookingRequestDTO,
  OperatorRescheduleBookingRequestDTO,
  ProcessAdminCancellationRequestDTO,
  UpdateAttendanceRequestDTO,
  VerifyCancellationRequestDTO,
  VerifyPaymentRequestDTO,
} from "../dto-mapping/dto/booking/bookingRequestDTO";

export interface IBookingService {
  processAdminCancellation(
    dto: ProcessAdminCancellationRequestDTO,
  ): Promise<IBookingDocument | null>;
  getPendingCancelationRequests(): Promise<IBooking[]>;
  getOperatorBookingsService(
    operatorId: string,
    status: string | undefined,
    skip: number,
    limit: number,
  ): Promise<{
    bookings: IPopulatedBooking[];
    totalCount: number;
  }>;
  getOperatorBookingDetailsService(
    bookingId: string,
    operatorId: string,
  ): Promise<IOperatorBookingDetails>;
  operatorCancelBookingService(
    dto: OperatorCancelBookingRequestDTO,
  ): Promise<IBookingDocument | null>;
  operatorRescheduleBookingService(
    dto: OperatorRescheduleBookingRequestDTO,
  ): Promise<Ipackage | null>;
  updateAttendanceService(
    dto: UpdateAttendanceRequestDTO,
  ): Promise<IBookingDocument | null>;
  verifyCancellationService(
    dto: VerifyCancellationRequestDTO,
  ): Promise<IBookingDocument | null>;
  createBookingOrder(dto: CreateBookingRequestDTO): Promise<
    | {
        isFullyPaidByWallet: boolean;
        bookingId: string | Types.ObjectId;
        orderId: string;
        amount?: never;
        currency?: never;
        keyId?: never;
        packageName?: never;
        packageDescription?: never;
        offerId?: never;
      }
    | {
        isFullyPaidByWallet: boolean;
        orderId: string;
        amount: number;
        currency: string;
        keyId: string | undefined;
        packageName: string;
        packageDescription: string;
        offerId: string | null;
        bookingId?: never;
      }
  >;
  verifyAndConfirmBooking(dto: VerifyPaymentRequestDTO): Promise<{
    message: "Booking confirmed successfully";
    booking: IBooking | null;
  }>;
  findBookingByOrderId(razorpayOrderId: string): Promise<IBooking>;
  getUserBookings(userId: string): Promise<IBooking[]>;
  cancelBooking(dto: CancelBookingRequestDTO): Promise<
    | {
        requiresAdminApproval: boolean;
        message: "Booking cancelled successfully. 100% refund added to your wallet";
        refundAmount: number;
        booking: IBookingDocument | null;
        estimatedRefund?: never;
      }
    | {
        requiresAdminApproval: boolean;
        message: "Cancellation request submitted. Subject to admin approval(50% estimated refund).";
        estimatedRefund: number;
        booking: IBookingDocument | null;
        refundAmount?: never;
      }
  >;
}
