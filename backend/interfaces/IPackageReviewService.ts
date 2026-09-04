import {
  CreateReviewRequestDTO,
  UpdateReviewRequestDTO,
} from "../dto-mapping/dto/package-review/packageReviewRequestDTO";
import { IReview } from "./IReview";

export interface IPackageReviewService {
  getPackageReviewService(
    packageId: string,
    page?: number,
    limit?: number,
  ): Promise<{
    reviews: IReview[];
    stats: any;
  }>;
  createPackageReviewService(
    reviewData: CreateReviewRequestDTO,
  ): Promise<IReview>;
  updatePackageReviewService(
    userId: string,
    reviewId: string,
    packageId: string,
    dto: UpdateReviewRequestDTO,
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
