import { Types } from "mongoose";
import { IReview } from "../../../interfaces/IReview";

export interface UserPopulatedDTO {
  _id: string;
  name: string;
  image?: string;
}

export interface CategoryRatingsDTO {
  guide: number;
  value: number;
  itinerary: number;
  transport: number;
}

export interface ReviewResponseDTO {
  _id: string;
  packageId: string;
  userId: string | UserPopulatedDTO;
  rating: number;
  categoryRatings: CategoryRatingsDTO;
  comment: string;
  images: string[];
  travelerType: "Couple" | "Solo" | "Family" | "Friends";
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  avgGuide: number;
  avgValue: number;
  avgItinerary: number;
  avgTransport: number;
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
}

export interface PackageReviewResponseDTO {
  reviews: ReviewResponseDTO[];
  stats: ReviewStats;
}
export interface UpdateReviewResponseDTO {
  review: ReviewResponseDTO | null;
  stats: ReviewStats;
}

export type ReviewWithOptionalPopulatedUser=Omit<IReview,'userId'>&{
  userId:Types.ObjectId|UserPopulatedDTO
}