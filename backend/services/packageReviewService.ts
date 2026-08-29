import { inject, injectable } from "inversify";
import { IPackageReviewService } from "../interfaces/IPackageReviewService";
import { StatusCode } from "../constants/statusCodeConstants";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { CustomError } from "../utils/customError";
import { CreateReviewDto } from "../interfaces/IReview";
import type { IReviewRepository } from "../interfaces/IReviewRepository";
import { Types } from "../types/types";
import {
  CreateReviewRequestDTO,
  UpdateReviewRequestDTO,
} from "../dto-mapper/dto/packageReview/packageReviewRequestDTO";

@injectable()
export class PackageReviewService implements IPackageReviewService {
  constructor(
    @inject(Types.ReviewRepository)
    private reviewRepository: IReviewRepository,
  ) {}

  async getPackageReviewService(packageId: string, page = 1, limit = 5) {
    const skip = (page - 1) * limit;
    const [reviews, stats] = await Promise.all([
      this.reviewRepository.getReviewsByPackageId(packageId, skip, limit),
      this.reviewRepository.getReviewStatsByPackageId(packageId),
    ]);

    return { reviews, stats };
  }
  async createPackageReviewService(reviewData: CreateReviewRequestDTO) {
    const existingReview = await this.reviewRepository.findUserReviewForPackage(
      reviewData.userId,
      reviewData.packageId,
    );
    if (existingReview) {
      throw new CustomError(
        RESPONSE_MESSAGES.REVIEW.ERROR.ALREADY_EXIST,
        StatusCode.BAD_REQUEST,
      );
    }

    return this.reviewRepository.createReview(reviewData);
  }

  async updatePackageReviewService(
    userId: string,
    reviewId: string,
    packageId: string,
    dto: UpdateReviewRequestDTO,
  ) {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new CustomError(
        RESPONSE_MESSAGES.REVIEW.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    if (review.userId.toString() !== userId) {
      throw new CustomError(
        RESPONSE_MESSAGES.REVIEW.ERROR.FORBIDDEN,
        StatusCode.FORBIDDEN,
      );
    }
    const updatedReview = await this.reviewRepository.updateReview(
      reviewId,
      dto,
    );
    const stats =
      await this.reviewRepository.getReviewStatsByPackageId(packageId);
    return { review: updatedReview, stats };
  }

  async deletePackageReviewService(
    userId: string,
    reviewId: string,
    packageId: string,
  ) {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new CustomError(
        RESPONSE_MESSAGES.REVIEW.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }

    if (review.userId.toString() !== userId) {
      throw new CustomError(
        RESPONSE_MESSAGES.REVIEW.ERROR.FORBIDDEN,
        StatusCode.FORBIDDEN,
      );
    }

    await this.reviewRepository.deleteById(reviewId);
    const stats =
      await this.reviewRepository.getReviewStatsByPackageId(packageId);
    return { stats };
  }
}
