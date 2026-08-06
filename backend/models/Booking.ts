import { model, Schema } from "mongoose";
import { IBooking } from "../interfaces/IBookingRepository";
import { IBookingPricing } from "../interfaces/IBookingPricing";

export interface IBookingDocument extends Omit<IBooking, "_id">, Document {}

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

const pricingSchema = new Schema<IBookingPricing>(
  {
    baseAmount: {
      type: Number,
      required: true,
    },
    addedActivitiesAmount: {
      type: Number,
      default: 0,
    },
    removedActivitiesAmount: {
      type: Number,
      default: 0,
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
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "FAILED", "CANCELLED"],
      default: "PENDING",
    },
    pricing: {
      type: pricingSchema,
      required: true,
    },
  },

  { timestamps: true },
);

export const Booking = model<IBookingDocument>("Booking", bookingSchema);
