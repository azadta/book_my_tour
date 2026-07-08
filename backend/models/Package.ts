import mongoose, { Document, Schema, Types } from "mongoose";

export interface IActivity {
  id: string;
  name: string;
  cost: number;
  customizable: boolean;
}

export interface IOptionalActivity {
  id: string;
  name: string;
  cost: number;
}

export interface IItineraryDay {
  day: number;
  title: string;
  description: string;
  gallery: string[];
  activities: IActivity[];
  optionalActivities: IOptionalActivity[];
}

export interface Ipackage extends Document {
  name: string;
  amount: number;
  destinations: Types.ObjectId[];
  duration: {
    day: number;
    night: number;
  };
  specifications: string;
  activities: string;
  startDate: Date;
  remark: string;
  discount: number;
  availableSlots: string;
  images: string[];

  category: Types.ObjectId;

  operatorId: Types.ObjectId;
  itinerary: IItineraryDay[];
}

const ActivitySchema = new Schema<IActivity>(
  {
    id: String,
    name: String,
    cost: Number,
    customizable: Boolean,
  },
  { _id: false },
);

const OptionalActivitySchema = new Schema<IOptionalActivity>(
  {
    id: String,
    name: String,
    cost: Number,
  },
  { _id: false },
);

const ItinerarySchema = new Schema<IItineraryDay>(
  {
    day: Number,
    title: String,
    description: String,
    gallery: [String],
    activities: [ActivitySchema],
    optionalActivities: [OptionalActivitySchema],
  },
  { _id: false },
);

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
    duration: {
      day: {
        type: Number,
        required: true,
      },
      night: {
        type: Number,
        required: true,
      },
    },
    specifications: { type: String },
    activities: { type: String },
    startDate: {
      type: Date,
    },
    operatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Operator",
      required: true,
    },
    remark: String,

 
    discount: Number,
    availableSlots: { type: String },
    images: [{ type: String }],
    itinerary: [ItinerarySchema],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PackageCategory",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<Ipackage>("Package", packageSchema);
