import { Ipackage } from "../models/Package";
import { IBooking } from "./IBookingRepository";
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
  IBooking,
  "packageId" | "userId"
> {
  packageId: Ipackage;
  userId: IUser;
}
