import { inject, injectable } from "inversify";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import {
  ReviewRequestBody,
  UpdateReviewRequestDTO,
} from "../dto-mapping/dto/package-review/packageReviewRequestDTO";
import { ReviewRequestMapper } from "../dto-mapping/mapper/package-review/ReviewRequestMapper";
import { ReviewResponseMapper } from "../dto-mapping/mapper/package-review/ReviewResponseMapper";
import { IPackageReviewService } from "../interfaces/IPackageReviewService";
import type { IReviewRepository } from "../interfaces/IReviewRepository";
import { Types } from "../types/types";
import { CustomError } from "../utils/customError";

@injectable()
export class PackageReviewService implements IPackageReviewService {
  constructor(
    @inject(Types.ReviewRepository)
    private _reviewRepository: IReviewRepository,
  ) {}

  async getPackageReviewService(packageId: string, page = 1, limit = 5) {
    const skip = (page - 1) * limit;
    const [reviews, stats] = await Promise.all([
      this._reviewRepository.getReviewsByPackageId(packageId, skip, limit),
      this._reviewRepository.getReviewStatsByPackageId(packageId),
    ]);
    return ReviewResponseMapper.toPackageReviewsResponseDTO(reviews, stats);
  }
  async createPackageReviewService(
    packageId: string,
    userId: string,
    body: ReviewRequestBody,
  ) {
    const dto = ReviewRequestMapper.toCreateReviewReqDTO(
      body,
      packageId as string,
      userId,
    );
    const existingReview =
      await this._reviewRepository.findUserReviewForPackage(
        dto.userId,
        dto.packageId,
      );
    if (existingReview) {
      throw new CustomError(
        RESPONSE_MESSAGES.REVIEW.ERROR.ALREADY_EXIST,
        StatusCode.BAD_REQUEST,
      );
    }

    const data = await this._reviewRepository.createReview(dto);
    return ReviewResponseMapper.toReviewResponseDTO(data);
  }

  async updatePackageReviewService(
    userId: string,
    reviewId: string,
    packageId: string,
    body: ReviewRequestBody,
  ) {
    const dto = ReviewRequestMapper.toUpdateReviewReqDTO(body);
    const review = await this._reviewRepository.findById(reviewId);
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
    const updatedReview = await this._reviewRepository.updateReview(
      reviewId,
      dto,
    );
    const stats =
      await this._reviewRepository.getReviewStatsByPackageId(packageId);
    return ReviewResponseMapper.toUpdateReviewResponseDTO(updatedReview, stats);
  }

  async deletePackageReviewService(
    userId: string,
    reviewId: string,
    packageId: string,
  ) {
    const review = await this._reviewRepository.findById(reviewId);
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
    await this._reviewRepository.deleteById(reviewId);
    const stats =
      await this._reviewRepository.getReviewStatsByPackageId(packageId);
    return ReviewResponseMapper.toReviewStatsDTO(stats);
  }
}
