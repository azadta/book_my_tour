import { HydratedDocument, Types } from "mongoose";
import { AttendanceStatus, BookingStatus } from "../models/Booking";
import { IPayoutDocument } from "../models/Payout";

interface PopulatedPackage {
  _id: Types.ObjectId;
  name: string;
  startDate: Date;
  duration: {
    day: number;
    night: number;
  };
  amount: number;
}

export interface PopulatedBooking {
  _id: Types.ObjectId;
  status: BookingStatus;
  attendance: AttendanceStatus;
  packageId: PopulatedPackage;
}

export interface PopulatedOperator {
  _id: Types.ObjectId;
  name: string;
  email: string;
  mobile: string;
}

export type PayoutWithPopulatedDetails = Omit<
  HydratedDocument<IPayoutDocument>,
  "bookingId" | "operatorId"
> & {
  bookingId: PopulatedBooking;
  operatorId: PopulatedOperator;
};
