import { injectable } from "inversify";
import { IReviewRepository } from "../interfaces/IReviewRepository";
import { Review } from "../models/Review";
import { BaseRepository } from "./baseRepository";
import { CreateReviewDto, IReview } from "../interfaces/IReview";
import mongoose from "mongoose";
import { CreateReviewRequestDTO } from "../dto-mapper/dto/packageReview/packageReviewRequestDTO";

@injectable()
export class ReviewRepository
  extends BaseRepository<IReview>
  implements IReviewRepository
{
  constructor() {
    super(Review);
  }

  async getReviewsByPackageId(
    packageId: string,
    skip = 0,
    limit = 5,
  ): Promise<IReview[]> {
    return Review.find({ packageId })
      .populate("userId", "name image _id")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async getReviewStatsByPackageId(packageId: string) {
    const stats = await Review.aggregate([
      { $match: { packageId: new mongoose.Types.ObjectId(packageId) } },
      {
        $group: {
          _id: "$packageId",
          totalReviews: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          avgGuide: { $avg: "$categoryRatings.guide" },
          avgValue: { $avg: "$categoryRatings.value" },
          avgItinerary: { $avg: "$categoryRatings.itinerary" },
          avgTransport: { $avg: "$categoryRatings.transport" },
          fiveStar: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
          fourStar: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
          threeStar: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
          twoStar: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
          oneStar: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
        },
      },
    ]);

    return (
      stats[0] || {
        totalReviews: 0,
        averageRating: 0,
        avgGuide: 0,
        avgValue: 0,
        avgItinerary: 0,
        avgTransport: 0,
        fiveStar: 0,
        fourStar: 0,
        threeStar: 0,
        twoStar: 0,
        oneStar: 0,
      }
    );
  }

  async createReview(review: CreateReviewRequestDTO): Promise<IReview> {
    const createdReview = await Review.create(review);
    await createdReview.populate("userId", "name image");
    return createdReview;
  }

  async findUserReviewForPackage(
    userId: string,
    packageId: string,
  ): Promise<IReview | null> {
    return Review.findOne({ userId, packageId });
  }

  async updateReview(
    reviewId: string,
    updatedData: Partial<IReview>,
  ): Promise<IReview | null> {
    return Review.findByIdAndUpdate(reviewId, updatedData, {
      new: true,
    }).populate("userId", "name image");
  }
}
