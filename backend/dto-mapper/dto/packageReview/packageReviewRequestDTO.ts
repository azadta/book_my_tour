export interface CreateReviewRequestDTO {
  userId: string;
  packageId: string;
  rating: number;
  categoryRatings?: {
    guide: number;
    value: number;
    itinerary: number;
    transport: number;
  };

  comment: string;
  travelerType?: "Couple" | "Solo" | "Family" | "Friends";
  images?: string[];
}
export interface UpdateReviewRequestDTO {
  rating?: number;
  categoryRatings?: {
    guide: number;
    value: number;
    itinerary: number;
    transport: number;
  };
  comment?: string;
  travelerType?: "Couple" | "Solo" | "Family" | "Friends";
  images?: string[];
}
