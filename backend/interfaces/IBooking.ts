import { HydratedDocument, Types } from "mongoose";
import { BookingStatus, IBookingDocument } from "../models/Booking";
import { IItineraryDay, Ipackage } from "../models/Package";
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
export interface IAdminBookingStats {
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

export type IPackageActivity = IItineraryDay["activities"][number];
export type IPackageOptionalActivity =
  IItineraryDay["optionalActivities"][number];
export type IPopulatedPackageSummary = Pick<
  Ipackage,
  "_id" | "name" | "images" | "startDate" | "duration" | "startPoint"
> & { destinations: Array<{ _id: Types.ObjectId; name: string }> };

export interface IPopulatedBookingDetails extends Omit<
  IBookingDocument,
  "packageId"
> {
  packageId: IPopulatedPackageSummary;
  addedActivities: IPackageOptionalActivity[];
  removedActivities: IPackageActivity[];
}
