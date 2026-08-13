import { Types } from "mongoose";
import { IBaseRepository } from "./IBaseRepository";
import { IBookingDocument, IPopulatedBooking } from "../models/Booking";
import { IBookingPricing } from "./IBookingPricing";
import { IOperatorBookingDetails, IOperatorBookingFilter, IOperatorBookingStats } from "./IBooking";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCEL_REQUESTED"
  | "FAILED"
  | "CANCELLED";

export interface IBooking {
  _id: string | Types.ObjectId;
  userId: Types.ObjectId | string;
  packageId: Types.ObjectId | string;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;

  addedActivityIds: string[];
  removedActivityIds: string[];
  status: BookingStatus;
  attendance:string,
  checkInTime:Date
  pricing: IBookingPricing;
  cancellation: {
    requestedAt: Date;
    processedAt: Date;
    refundAmount: number;
    reason: string;
    adminNotes: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateBookingDTO {
  userId: string;
  packageId: string;
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
  createBooking(dto: ICreateBookingDTO): Promise<IBooking>;
  findByOrderId(razorpayOrderId: string): Promise<IBooking | null>;
  updateStatusByOrderId(
    razorpayOrderID: string,
    dto: IUpdateBookingStatusDTO,
  ): Promise<IBooking | null>;
  getUserBookings(userId: string): Promise<IBooking[]>;
  findByBookingId(bookingId: string): Promise<IPopulatedBooking | null>;
  getPendingCancellationRequests(): Promise<IBooking[]>;
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
}
