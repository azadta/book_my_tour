import { Schema, model } from "mongoose";
import { IReview } from "../interfaces/IReview";


const ReviewSchema = new Schema<IReview>(
  {
    packageId: { type: Schema.Types.ObjectId, ref: "Package", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    categoryRatings: {
      guide: { type: Number, default: 5 },
      value: { type: Number, default: 5 },
      itinerary: { type: Number, default: 5 },

      transport: { type: Number, default: 5 },
    },
    comment: {
      type: String,
      required: true,
      maxLength: 1000,
    },
    images: [{ type: String }],
    travelerType: {
      type: String,
      enum: ["Couple", "Solo", "Family", "Friends"],
      default: "Couple",
    },
  },
  { timestamps: true },
);

ReviewSchema.index({ packageId: 1, createdAt: -1 });
export const Review=model<IReview>('Review',ReviewSchema)
