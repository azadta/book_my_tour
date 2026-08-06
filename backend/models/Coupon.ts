import { Document, model, Schema } from "mongoose";

export enum CouponType {
  GENERAL = "GENERAL",
  BANK = "BANK",
}

export interface ICouponDocument extends Document {
  code: string;
  title: string;
  description: string;
  type: CouponType;
  discountType: "PERCENTAGE" | "FLAT";
  discountValue: number;
  maxDiscountAmount: number;
  minBookingAmount?: number;
  bankName: string;
  allowedBins?: string[];
  razorpayOfferId: string;
  validTill: Date;
  isActive: boolean;
}

const couponSchema = new Schema<ICouponDocument>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(CouponType),
      default: CouponType.GENERAL,
    },
    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FLAT"],
      required: true,
    },
    discountValue: {
      type: Number,

      required: true,
    },
    maxDiscountAmount: {
      type: Number,
    },
    minBookingAmount: { type: Number, default: 0 },
    bankName: {
      type: String,
    },
    allowedBins: [{ type: String }],
    razorpayOfferId: { type: String },
    validTill: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Coupon = model<ICouponDocument>("Coupon", couponSchema);
