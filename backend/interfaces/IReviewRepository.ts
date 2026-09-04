import { CreateReviewRequestDTO } from "../dto-mapping/dto/package-review/packageReviewRequestDTO";
import { IBaseRepository } from "./IBaseRepository";
import { CreateReviewDto, IReview } from "./IReview";

export interface IReviewRepository extends IBaseRepository<IReview> {
  getReviewsByPackageId(
    packageId: string,
    skip?: number,
    limit?: number,
  ): Promise<IReview[]>;
  getReviewStatsByPackageId(packageId: string): Promise<any>;
  createReview(review: CreateReviewRequestDTO): Promise<IReview>;
  findUserReviewForPackage(
    userId: string,
    packageId: string,
  ): Promise<IReview | null>;
  updateReview(
    reviewId: string,
    updatedData: Partial<IReview>,
  ): Promise<IReview | null>;
}
