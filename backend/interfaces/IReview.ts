import { Document, Types } from "mongoose";

export interface IReview extends Document {
  packageId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  categoryRatings: {
    guide: number;
    value: number;
    itinerary: number;
    transport: number;
  };
  comment: string;
  images?: string[];
  travelerType?: "Couple" | "Solo" | "Family" | "Friends";
  createdAt: Date;
}

export interface CreateReviewDto {
  userId: string;
  packageId: string;
  reviewPayload: {
    rating: number;
    categoryRatings: {
      guide: number;
      value: number;
      itinerary: number;
      transport: number;
    };
    comment: string;
    travelerType: string;
    images?: string[];
  };
}
