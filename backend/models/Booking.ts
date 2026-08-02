import { model, Schema } from "mongoose";
import { IBooking } from "../interfaces/IBookingRepository";

export interface IBookingDocument extends Omit<IBooking, "_id">, Document {}

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
    totalAmount: {
      type: Number,
      required: true,
    },
    addedActivityIds: [{ type: String }],
    removedActivityIds: [{ type: String }],
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "FAILED", "CANCELLED"],
      default: "PENDING",
    },
  },
  { timestamps: true },
);

export const Booking=model<IBookingDocument>('Booking',bookingSchema)
