import { Types } from "mongoose";
import { IBaseRepository } from "./IBaseRepository";
import { IBookingDocument } from "../models/Booking";
import { IBookingPricing } from "./IBookingPricing";

export type BookingStatus = "PENDING" | "CONFIRMED" | "FAILED" | "CANCELLED";

export interface IBooking {
  _id: string | Types.ObjectId;
  userId: Types.ObjectId | string;
  packageId: Types.ObjectId | string;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;

  addedActivityIds: string[];
  removedActivityIds: string[];
  status: BookingStatus;
  pricing: IBookingPricing;

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
  findByBookingId(bookingId: string): Promise<IBooking | null>;
}
