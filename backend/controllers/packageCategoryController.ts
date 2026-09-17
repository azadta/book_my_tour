import { inject, injectable } from "inversify";
import { IPackageCategoryController } from "../interfaces/IPackageCategoryController";
import { Types } from "../types/types";
import type { IPackageCategoryService } from "../interfaces/IPackageCategoryService";
import { NextFunction, Request, Response } from "express";
import { PackageCategoryRequestMapper } from "../dto-mapping/mapper/package-category/PackageCategoryRequestMapper";
import { StatusCode } from "../constants/statusCodeConstants";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { CategoryResponseMapper } from "../dto-mapping/mapper/package-category/PackageCategoryResponseMapper";

@injectable()
export class PackageCategoryController implements IPackageCategoryController {
  constructor(
    @inject(Types.PackageCategoryService)
    private packageCategoryService: IPackageCategoryService,
  ) {}

  //admin
  createPackageCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const dto = PackageCategoryRequestMapper.toCreatePackageCategory(
        req.body,
      );
      const rawCategory =
        await this.packageCategoryService.createCategoryService(dto);
      res.status(StatusCode.CREATED).json({
        message: RESPONSE_MESSAGES.CATEGORY.SUCCESS.CREATED,
        category: CategoryResponseMapper.toCategoryResponseDTO(rawCategory),
      });
    } catch (error) {
      next(error);
    }
  };



  //user
  getAllPackageCategories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const categories = await this.packageCategoryService.getAllCategories();
      res.json(CategoryResponseMapper.toCategoryListResponseDTO(categories));
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
      const rawCategories =
        await this.packageCategoryService.getActiveCategoryService();
      res.status(200).json({
        categories:
          CategoryResponseMapper.toCategoryListResponseDTO(rawCategories),
      });
    } catch (error) {
      next(error);
    }
  };
}
