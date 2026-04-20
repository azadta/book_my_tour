import mongoose, { Document, Schema } from "mongoose";
export interface Ilocation {
  latitude: number;
  longitude: number;
}

export interface IDestination extends Document {
  name: string;
  location: Ilocation;
  images: { url: string; public_id: string }[];
  createdAt: Date;
}

const destinationSchema = new Schema<IDestination>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: { type: Number, required: true },
  },
  images: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IDestination>("Destination", destinationSchema);
