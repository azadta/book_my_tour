import {
  CreateReviewRequestDTO,
  UpdateReviewRequestDTO,
} from "../dto-mapper/dto/packageReview/packageReviewRequestDTO";
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
