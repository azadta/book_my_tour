import { Types } from "mongoose";
import {
  PackageReviewResponseDTO,
  ReviewResponseDTO,
  ReviewStats,
  ReviewWithOptionalPopulatedUser,
  UpdateReviewResponseDTO,
  UserPopulatedDTO,
  UserSummaryInput
} from "../../dto/package-review/packageReviewResponseDTO";

export class ReviewResponseMapper {
  private static mapUser(
    userId: UserSummaryInput | Types.ObjectId,
  ): string | UserPopulatedDTO {
    if (!userId) return "";
    if (userId instanceof Types.ObjectId) return userId.toString();

    return {
      _id: userId._id.toString(),
      name: userId.name || "",
      image: userId.image || "",
    };
  }

  static toReviewResponseDTO(review:ReviewWithOptionalPopulatedUser): ReviewResponseDTO {
    return {
      _id: review._id ? review._id.toString() : "",
      packageId: review.packageId ? review.packageId.toString() : "",
      userId: this.mapUser(review.userId),
      rating: review.rating ?? 0,
      categoryRatings: {
        guide: review.categoryRatings?.guide ?? 5,
        value: review.categoryRatings?.value ?? 5,
        itinerary: review.categoryRatings?.itinerary ?? 5,
        transport: review.categoryRatings?.transport ?? 5,
      },
      comment: review.comment || "",
      images: Array.isArray(review.images) ? review.images : [],
      travelerType: review.travelerType || "Couple",
      createdAt: review.createdAt
        ? new Date(review.createdAt).toISOString()
        : new Date().toISOString(),
      updatedAt: review.updatedAt
        ? new Date(review.updatedAt).toISOString()
        : new Date().toISOString(),
    };
  }

  static toReviewStatsDTO(stats: ReviewStats): ReviewStats {
    return {
      totalReviews: stats.totalReviews ?? 0,
      averageRating: Number((stats.averageRating ?? 0).toFixed(1)),
      avgGuide: Number((stats.avgGuide ?? 0).toFixed(1)),
      avgValue: Number((stats.avgValue ?? 0).toFixed(1)),
      avgItinerary: Number((stats.avgItinerary ?? 0).toFixed(1)),
      avgTransport: Number((stats.avgTransport ?? 0).toFixed(1)),
      fiveStar: stats?.fiveStar ?? 0,
      fourStar: stats?.fourStar ?? 0,
      threeStar: stats?.threeStar ?? 0,
      twoStar: stats?.twoStar ?? 0,
      oneStar: stats?.oneStar ?? 0,
    };
  }

  static toPackageReviewsResponseDTO(
    reviews: ReviewWithOptionalPopulatedUser[],
    stats: ReviewStats,
  ): PackageReviewResponseDTO {
    return {
      reviews: Array.isArray(reviews)
        ? reviews.map((rev) => this.toReviewResponseDTO(rev))
        : [],
      stats: this.toReviewStatsDTO(stats),
    };
  }
  static toUpdateReviewResponseDTO(
    review: ReviewWithOptionalPopulatedUser,
    stats: ReviewStats,
  ): UpdateReviewResponseDTO {
    return {
      review: review ? this.toReviewResponseDTO(review) : null,
      stats: this.toReviewStatsDTO(stats),
    };
  }
}
