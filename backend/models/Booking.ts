import { model, Schema } from "mongoose";
import {
  IBooking,
  ILeadContact,
  ITourMember,
} from "../interfaces/IBookingRepository";
import { IBookingPricing } from "../interfaces/IBookingPricing";
import { Ipackage } from "./Package";

export interface IBookingDocument extends Omit<IBooking, "_id">, Document {}
export interface IPopulatedBooking extends Omit<IBooking, "packageId"> {
  packageId: Ipackage;
}

export type AttendanceStatus =
  | "PENDING"
  | "CHECKED_IN"
  | "NOT_SHOW"
  | "COMPLETED";

const AppliedCoupnSchema = new Schema(
  {
    couponId: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
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
      required:true
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
      enum: ["PENDING", "CONFIRMED", "CANCEL_REQUESTED", "FAILED", "CANCELLED"],
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
