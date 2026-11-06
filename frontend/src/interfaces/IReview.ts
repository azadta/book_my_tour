import type { BaseFormData } from "./interfaces";


export interface ReviewFormData extends BaseFormData {
  rating: number;
  "categoryRatings.guide": number;
  "categoryRatings.value": number;
  "categoryRatings.itinerary": number;
  "categoryRatings.transport": number;
  travelerType: "Couple" | "Solo" | "Family" | "Friends";
  comment: string;
  images: (File | string)[];
}
export interface IReviewItem {
  _id: string;
  userId: { _id: string; name: string; image?: string };
  rating: number;
  categoryRatings: {
    guide: number;
    value: number;
    itinerary: number;
    transport: number;
  };
  comment: string;
  travelerType: string;
  createdAt: string;
  images?: string[];
}

export interface IReviewStats {
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