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
import { sendSuccessResponse } from "../utils/apiResponse";

@injectable()
export class PackageReviewController implements IPackageReviewController {
  constructor(
    @inject(Types.PackageReviewService)
    private _packageReviewService: IPackageReviewService,
  ) {}

  getPackageReviewsByPackageId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { packageId } = req.params;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      const data = await this._packageReviewService.getPackageReviewService(
        packageId as string,
        page,
        limit,
      );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.REVIEW.SUCCESS.FETCH,
        data,
        StatusCode.OK,
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

      const data = await this._packageReviewService.createPackageReviewService(
        packageId as string,
        userId,
        req.body,
      );

      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.REVIEW.SUCCESS.CREATE,
        data,
        StatusCode.CREATED,
      );
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

      const userId = req.user?.id as string;

      const updatedData =
        await this._packageReviewService.updatePackageReviewService(
          userId!,
          reviewId as string,
          packageId as string,
          req.body,
        );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.REVIEW.SUCCESS.UPDATE,
        updatedData,
        StatusCode.OK,
      );
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
      const result =
        await this._packageReviewService.deletePackageReviewService(
          userId!,
          reviewId as string,
          packageId as string,
        );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.REVIEW.SUCCESS.DELETE,
        result,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };
}
