import { CreateReviewDto, IReview } from "./IReview";

export interface IPackageReviewService {
  getPackageReviewService(
    packageId: string,
    page?: number,
    limit?: number,
  ): Promise<{
    reviews: IReview[];
    stats: any;
  }>;
  createPackageReviewService(reviewData: CreateReviewDto): Promise<IReview>;
  updatePackageReviewService(
    userId: string,
    reviewId: string,
    packageId: string,
    updatePayload: any,
  ): Promise<{
    review: IReview | null;
    stats: any;
  }>;
  deletePackageReviewService(
    userId: string,
    reviewId: string,
    packageId: string,
  ): Promise<{
    stats: any;
  }>;
}
