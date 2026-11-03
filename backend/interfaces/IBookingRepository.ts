import { PendingCancellationInput } from "../dto-mapping/dto/booking/bookingResponseDTO";
import {
  BookingStatus,
  IBookingDocument,
  IPopulatedBooking,
} from "../models/Booking";
import { IBaseRepository } from "./IBaseRepository";
import {
  IBookingStatusBreakDown,
  IMonthlyRevenue,
  IOperatorBookingDetails,
  IOperatorBookingFilter,
  IOperatorBookingStats,
} from "./IBooking";
import { IBookingPricing } from "./IBookingPricing";

export interface ITourMember {
  type: "adult" | "child";
  firstName: string;
  lastName: string;
  dob: Date;
  gender: "male" | "female" | "other";
  passportNumber: string | null;
}

export interface ILeadContact {
  name: string;
  email: string;
  phone: string;
}
export interface IBookingCancellation {
  requestedAt: Date | null;
  processedAt: Date | null;
  refundAmount: number;
  reason: string;
  adminNotes: string;
}

export interface ICreateBookingDTO {
  userId: string;
  packageId: string;
  members: ITourMember[];
  primaryContact: ILeadContact;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  addedActivityIds?: string[];
  removedActivityIds?: string[];
  status: BookingStatus;
  pricing: IBookingPricing;
}

export interface IUpdateBookingStatusDTO {
  status: BookingStatus;
  razorpayPaymentId?: string;
}

export interface IBookingRepository extends IBaseRepository<IBookingDocument> {
  createBooking(dto: ICreateBookingDTO): Promise<IBookingDocument>;
  findByOrderId(razorpayOrderId: string): Promise<IBookingDocument | null>;
  updateStatusByOrderId(
    razorpayOrderID: string,
    dto: IUpdateBookingStatusDTO,
  ): Promise<IBookingDocument | null>;
  getUserBookings(
    userId: string,
    skip: number,
    limit: number,
  ): Promise<{ bookings: IBookingDocument[]; totalCount: number }>;
  findByBookingId(bookingId: string): Promise<IPopulatedBooking | null>;
  getPendingCancellationRequests(): Promise<PendingCancellationInput[]>;
  getOperatorBookings(
    filter: IOperatorBookingFilter,
    skip: number,
    limit: number,
  ): Promise<IPopulatedBooking[]>;
  getOperatorBookingsCount(filter: IOperatorBookingFilter): Promise<number>;
  getOperatorBookingDetails(
    bookingId: string,
    operatorId: string,
  ): Promise<IOperatorBookingDetails | null>;
  getOperatorStats(operatorId: string): Promise<IOperatorBookingStats>;
  getMonthlyRevenue(operatorId: string): Promise<IMonthlyRevenue[]>;
  getBookingStatusBreakDown(
    operatorId: string,
  ): Promise<IBookingStatusBreakDown[]>;
}
