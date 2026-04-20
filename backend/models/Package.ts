import mongoose, { Document, Schema, Types } from "mongoose";
export interface Ipackage extends Document {
  name: string;
  amount: number;
  destinations: Types.ObjectId[];
  specifications: string;
  expiryDate: Date;
  remark: string;
  discount: number;
  availableSlots: string;
  images: string[];
  isCustomizable: boolean;
  category: Types.ObjectId;

  operatorId: Types.ObjectId;
}

const packageSchema = new Schema<Ipackage>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    destinations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Destination",
        required: true,
      },
    ],
    specifications: { type: String },
    expiryDate: {
      type: Date,
    },
    operatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Operator",
      required: true,
    },
    remark: String,

    isCustomizable: {
      type: Boolean,
      default: false,
    },
    discount: Number,
    availableSlots: { type: String },
    images: [{ type: String }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PackageCategory",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<Ipackage>("Package", packageSchema);
