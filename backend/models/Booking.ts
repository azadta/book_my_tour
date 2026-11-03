import { HydratedDocument, model, Schema, Types } from "mongoose";
import { IAppliedCoupon, IBookingPricing } from "../interfaces/IBookingPricing";
import {

  IBookingCancellation,
  ILeadContact,
  ITourMember,
} from "../interfaces/IBookingRepository";
import { Ipackage } from "./Package";

export interface IPopulatedBooking extends Omit<IBookingDocument, "packageId"> {
  packageId: HydratedDocument<Ipackage>;
}

export type AttendanceStatus =
  | "PENDING"
  | "CHECKED_IN"
  | "NOT_SHOW"
  | "COMPLETED";

export const BOOKING_STATUS = [
  "PENDING",
  "CONFIRMED",
  "CANCEL_REQUESTED",
  "FAILED",
  "CANCELED",
] as const;

export type BookingStatus = (typeof BOOKING_STATUS)[number];

const AppliedCoupnSchema = new Schema<IAppliedCoupon>(
  {
    couponId: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["GENERAL", "BANK"],
      required: true,
    },
    discountAmount: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const tourMemberSchema = new Schema<ITourMember>(
  {
    type: { type: String, enum: ["adult", "child"], required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, require: true, trim: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    passportNumber: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { _id: false },
);

const leadContactSchema = new Schema<ILeadContact>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const pricingSchema = new Schema<IBookingPricing>(
  {
    adultCount: {
      type: Number,
      required: true,
      min: 1,
    },
    childCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    adultUnitPrice: {
      type: Number,
      required: true,
    },
    childUnitPrice: {
      type: Number,
      default: 0,
    },
    adultAmount: {
      type: Number,
      required: true,
    },
    childAmount: {
      type: Number,
      default: 0,
    },

    addedActivitiesAmount: {
      type: Number,
      default: 0,
    },
    removedActivitiesAmount: {
      type: Number,
      default: 0,
    },
    baseAmount: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    generalCoupon: {
      type: AppliedCoupnSchema,
      default: null,
    },
    bankCoupon: {
      type: AppliedCoupnSchema,
      default: null,
    },
    totalDiscount: {
      type: Number,
      default: 0,
    },
    walletApplied: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  },
);
export interface IBookingDocument {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  packageId: Types.ObjectId;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;

  addedActivityIds: string[];
  removedActivityIds: string[];
  primaryContact: ILeadContact;
  members: ITourMember[];
  status: BookingStatus;
  attendance: "PENDING" | "CHECKED_IN" | "NOT_SHOW" | "COMPLETED";
  checkInTime: Date;
  pricing: IBookingPricing;
  cancellation: IBookingCancellation;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBookingDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    packageId: {
      type: Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    razorpayOrderId: {
      type: String,

      required: true,
      unique: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },

    addedActivityIds: [{ type: String }],
    removedActivityIds: [{ type: String }],
    primaryContact: { type: leadContactSchema, required: true },
    members: [tourMemberSchema],
    status: {
      type: String,
      enum: BOOKING_STATUS,
      default: "PENDING",
    },
    attendance: {
      type: String,
      enum: ["PENDING", "CHECKED_IN", "NOT_SHOW", "COMPLETED"],
      default: "PENDING",
    },
    checkInTime: { type: Date, default: null },
    cancellation: {
      requestedAt: { type: Date, default: null },
      processedAt: { type: Date, default: null },
      refundAmount: { type: Number, default: 0 },
      reason: { type: String, default: "" },
      adminNotes: { type: String, default: "" },
    },
    pricing: {
      type: pricingSchema,
      required: true,
    },
  },

  { timestamps: true },
);

export const Booking = model<IBookingDocument>("Booking", bookingSchema);
