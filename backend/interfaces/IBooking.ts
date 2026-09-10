import { Ipackage } from "../models/Package";
import { IBooking } from "./IBookingRepository";
import { IUser } from "./IUser";
import { HydratedDocument } from "mongoose";

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
  IBooking,
  "packageId" | "userId"
> {
  packageId: HydratedDocument<Ipackage>;
  userId: HydratedDocument<IUser>;
}
