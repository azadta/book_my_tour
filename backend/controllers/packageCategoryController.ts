import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import { IPackageCategoryController } from "../interfaces/IPackageCategoryController";
import type { IPackageCategoryService } from "../interfaces/IPackageCategoryService";
import { Types } from "../types/types";
import { sendSuccessResponse } from "../utils/apiResponse";

@injectable()
export class PackageCategoryController implements IPackageCategoryController {
  constructor(
    @inject(Types.PackageCategoryService)
    private _packageCategoryService: IPackageCategoryService,
  ) {}

  createPackageCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const category = await this._packageCategoryService.createCategoryService(
        req.body,
      );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.CATEGORY.SUCCESS.CREATED,
        category,
        StatusCode.CREATED,
      );
    } catch (error) {
      next(error);
    }
  };

  getAllPackageCategories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const categories = await this._packageCategoryService.getAllCategories();
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.CATEGORY.SUCCESS.FETCH_ALL,
        categories,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };
  getActiveCategories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const categories =
        await this._packageCategoryService.getActiveCategoryService();
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.CATEGORY.SUCCESS.FETCH_ACTIVE,
        categories,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };
}
