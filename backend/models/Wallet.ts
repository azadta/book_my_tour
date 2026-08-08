import { Document, model, Schema, Types } from "mongoose";

export interface IWalletTransaction {
  transactionId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  type: "CREDIT" | "DEBIT";
  purpose: "WALLET_TOPUP" | "BOOKING_PAYMENT" | "REFUND";
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  description: string;
  createdAt?: Date;
}

export interface IWalletDocument extends Document {
  userId:Types.ObjectId;
  balance: number;
  transactions: IWalletTransaction[];
}

const transactionSchema = new Schema<IWalletTransaction>(
  {
    transactionId: { type: String, required: true },
    razorpayOrderId: { type: String, default: null },
    razorpayPaymentId: { type: String, default: null },
    type: { type: String, enum: ["CREDIT", "DEBIT"], required: true },
    purpose: {
      type: String,
      enum: ["WALLET_TOPUP", "BOOKING_PAYMENT", "REFUND"],
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    description: { type: String, required: true },
  },
  { timestamps: true },
);

const WalletSchema = new Schema<IWalletDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "USER",
      required: true,
      unique: true,
      index: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    transactions: [transactionSchema],
  },
  { timestamps: true },
);

export const Wallet = model<IWalletDocument>("Wallet", WalletSchema);
