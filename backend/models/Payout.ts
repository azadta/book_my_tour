import { Document, model, Schema, Types } from "mongoose";

export type PayoutStatusType = "PENDING" | "ELIGIBLE" | "PAID" | "FAILED";
export interface IPayoutDocument extends Document {
  bookingId: Types.ObjectId|string;
  operatorId: Types.ObjectId|string;
  packageId: Types.ObjectId|string;
  grossAmount: number;
  platformCommissionRate: number;
  platformCommissionAmount: number;
  netPayoutAmount: number;
  payoutStatus:PayoutStatusType;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  paidAt: Date;
  createdAt: Date;
  updatedAt: Date;
}


const payoutSchema = new Schema<IPayoutDocument>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
      index: true,
    },
    operatorId: {
      type: Schema.Types.ObjectId,
      ref: "Operator",
      required: true,
      index: true,
    },
    packageId: {
      type: Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    grossAmount: {
      type: Number,
      required: true,
    },
    platformCommissionRate: {
      type: Number,
      required: true,
      default: 5,
    },
    platformCommissionAmount: {
      type: Number,
      required: true,
    },
    netPayoutAmount: {
      type: Number,
      required: true,
    },
    payoutStatus: {
      type: String,
      enum: ["PENDING", "ELIGIBLE", "PAID", "FAILED"],
      default: "PENDING",
      index: true,
    },
    razorpayOrderId: {
      type: String,
      default: null,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);
export const Payout = model<IPayoutDocument>("Payout", payoutSchema);
