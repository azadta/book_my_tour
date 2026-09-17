import { inject, injectable } from "inversify";
import { IPackageReviewController } from "../interfaces/IPackageReviewController";
import { Types } from "../types/types";
import type { IPackageReviewService } from "../interfaces/IPackageReviewService";
import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../constants/statusCodeConstants";
import { ReviewResponseMapper } from "../dto-mapping/mapper/package-review/ReviewResponseMapper";
import { ReviewRequestMapper } from "../dto-mapping/mapper/package-review/ReviewRequestMapper";
import { CustomError } from "../utils/customError";
import { RESPONSE_MESSAGES } from "../constants/messages";

@injectable()
export class PackageReviewController implements IPackageReviewController {
  constructor(
    @inject(Types.PackageReviewService)
    private packageReviewService: IPackageReviewService,
  ) {}
  //user
  getPackageReviewsByPackageId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { packageId } = req.params;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      const data = await this.packageReviewService.getPackageReviewService(
        packageId as string,
        page,
        limit,
      );
      res
        .status(StatusCode.OK)
        .json(
          ReviewResponseMapper.toPackageReviewsResponseDTO(
            data.reviews,
            data.stats,
          ),
        );
    } catch (error) {
      next(error);
    }
  };

  createPackageReview = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { packageId } = req.params;

      const userId = req.user?.id as string;
      const payload = ReviewRequestMapper.toCreateReviewReqDTO(
        req.body,
        packageId as string,
        userId,
      );
      const data =
        await this.packageReviewService.createPackageReviewService(payload);

      res
        .status(StatusCode.CREATED)
        .json(ReviewResponseMapper.toReviewResponseDTO(data));
    } catch (error) {
      next(error);
    }
  };

  updatePackageReview = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { reviewId, packageId } = req.params;

      const userId = req.user?.id;
      if (!userId) {
        return next(
          new CustomError(
            RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED,
            StatusCode.UNAUTHORIZED,
          ),
        );
      }

      const dto = ReviewRequestMapper.toUpdateReviewReqDTO(req.body);

      const updatedData =
        await this.packageReviewService.updatePackageReviewService(
          userId!,
          reviewId as string,
          packageId as string,
          dto,
        );
      res.status(StatusCode.OK).json({
        success: true,
        message: RESPONSE_MESSAGES.REVIEW.SUCCESS.UPDATE,
        data: ReviewResponseMapper.toUpdateReviewResponseDTO(
          updatedData.review,
          updatedData.stats,
        ),
      });
    } catch (error) {
      next(error);
    }
  };

  deletePackageReview = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { reviewId, packageId } = req.params;
      const userId = req.user?.id;
      const result = await this.packageReviewService.deletePackageReviewService(
        userId!,
        reviewId as string,
        packageId as string,
      );
      res.status(StatusCode.OK).json({
        success: true,
        message: RESPONSE_MESSAGES.REVIEW.SUCCESS.DELETE,
        data: ReviewResponseMapper.toReviewStatsDTO(result.stats),
      });
    } catch (error) {
      next(error);
    }
  };
}
