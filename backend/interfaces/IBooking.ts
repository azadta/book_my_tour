import { HydratedDocument, Types } from "mongoose";
import { BookingStatus, IBookingDocument } from "../models/Booking";
import { Ipackage } from "../models/Package";
import { IUser } from "./IUser";

export interface IOperatorBookingFilter {
  operatorId: string;
  status?: string | undefined;
  search?: string;
}

export interface IOperatorBookingStats {
  totalBookings: number;
  confirmedBookings: number;
  cancelRequestedBookings: number;
  totalRevenue: number;
}

export interface IOperatorBookingDetails extends Omit<
  IBookingDocument,
  "packageId" | "userId"
> {
  packageId: HydratedDocument<Ipackage> | Types.ObjectId;
  userId: HydratedDocument<IUser> | Types.ObjectId;
}

export interface IBookingStatusBreakDown {
  status: BookingStatus;
  count: number;
}

export interface IMonthlyRevenue {
  year: number;
  month: number;
  totalRevenue: number;
  totalBookings: number;
}
