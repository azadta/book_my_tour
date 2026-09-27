import { Types } from "mongoose";
import { IBaseRepository } from "./IBaseRepository";
import { IBookingDocument, IPopulatedBooking } from "../models/Booking";
import { IBookingPricing } from "./IBookingPricing";
import {
  IOperatorBookingDetails,
  IOperatorBookingFilter,
  IOperatorBookingStats,
} from "./IBooking";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCEL_REQUESTED"
  | "FAILED"
  | "CANCELLED";

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

export interface IBooking {
  _id: string | Types.ObjectId;
  userId: Types.ObjectId | string;
  packageId: Types.ObjectId | string;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;

  addedActivityIds: string[];
  removedActivityIds: string[];
  primaryContact: ILeadContact;
  members: ITourMember[];
  status: BookingStatus;
  attendance: string;
  checkInTime: Date;
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
  createBooking(dto: ICreateBookingDTO): Promise<IBooking>;
  findByOrderId(razorpayOrderId: string): Promise<IBooking | null>;
  updateStatusByOrderId(
    razorpayOrderID: string,
    dto: IUpdateBookingStatusDTO,
  ): Promise<IBooking | null>;
  getUserBookings(
    userId: string,
    skip: number,
    limit: number,
  ): Promise<{ bookings: IBooking[]; totalCount: number }>;
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
