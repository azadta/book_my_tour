import { Types } from "mongoose";
import {
  AttendanceStatus,
  IBookingDocument,
  IPopulatedBooking,
} from "../models/Booking";
import { Ipackage } from "../models/Package";
import { IOperatorBookingDetails } from "./IBooking";
import { IBooking } from "./IBookingRepository";

export interface IBookingService {
  processAdminCancellation(
    bookingId: string,
    approve: boolean,
    adminNotes?: string | undefined,
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
    bookingId: string,
    operatorId: string,
    reason: string,
  ): Promise<IBookingDocument | null>;
  operatorRescheduleBookingService(
    bookingId: string,
    operatorId: string,
    newStartDate: string,
  ): Promise<Ipackage | null>;
  updateAttendanceService(
    bookingId: string,
    operatorId: string,
    attendance: AttendanceStatus,
  ): Promise<IBookingDocument | null>;
  verifyCancellationService(
    bookingId: string,
    operatorId: string,
    action: "APPROVE" | "REJECT",
    operatorNotes?: string | undefined,
  ): Promise<IBookingDocument | null>;
  createBookingOrder(
    userId: string,
    dto: {
      packageId: string;
      addedActivityIds: string[];
      removedActivityIds: string[];
      generalCouponCode?: string;
      bankCouponCode?: string;
      useWallet: boolean;
    },
  ): Promise<
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
  verifyAndConfirmBooking(dto: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    packageId: string;
    userId: string;
  }): Promise<{
    message: "Booking confirmed successfully";
    booking: IBooking | null;
  }>;
  findBookingByOrderId(razorpayOrderId: string): Promise<IBooking>;
  getUserBookings(userId: string): Promise<IBooking[]>;
  cancelBooking(
    userId: string,
    bookingId: string,
    reason?: string | undefined,
  ): Promise<
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
