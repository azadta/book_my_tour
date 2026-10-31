import {
  ReviewRequestBody,
  UpdateReviewRequestDTO,
} from "../dto-mapping/dto/package-review/packageReviewRequestDTO";
import {
  PackageReviewResponseDTO,
  ReviewResponseDTO,
  ReviewStats,
  UpdateReviewResponseDTO,
} from "../dto-mapping/dto/package-review/packageReviewResponseDTO";
import { IReview } from "./IReview";

export interface IPackageReviewService {
  getPackageReviewService(
    packageId: string,
    page?: number,
    limit?: number,
  ): Promise<PackageReviewResponseDTO>;
  createPackageReviewService(
    packageId: string,
    userId: string,
    body: ReviewRequestBody,
  ): Promise<ReviewResponseDTO>;
  updatePackageReviewService(
    userId: string,
    reviewId: string,
    packageId: string,
    body: ReviewRequestBody,
  ): Promise<UpdateReviewResponseDTO>;
  deletePackageReviewService(
    userId: string,
    reviewId: string,
    packageId: string,
  ): Promise<ReviewStats>;
}
