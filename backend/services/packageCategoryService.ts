import { inject, injectable } from "inversify";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import type { IPackageCategoryRepository } from "../interfaces/IPackageCategoryRepository";
import { IPackageCategoryService } from "../interfaces/IPackageCategoryService";
import type { IPackageRepository } from "../interfaces/IPackageRepository";
import { IPackageCategory } from "../models/PackageCategory";
import { Types } from "../types/types";
import { CustomError } from "../utils/customError";

@injectable()
export class PackageCategoryService implements IPackageCategoryService {
  constructor(
    @inject(Types.PackageCategoryRepository)
    private packageCategoryRepository: IPackageCategoryRepository,
    @inject(Types.PackageRepository)
    private packageRepository: IPackageRepository,
  ) {}

  async createCategoryService(
    data: Partial<IPackageCategory>,
  ): Promise<IPackageCategory> {
    const existing =
      await this.packageCategoryRepository.findPackageCategoryByName(
        data?.name as string,
      );
    if (existing)
      throw new CustomError(
        RESPONSE_MESSAGES.CATEGORY.ERROR.ALREADY_EXIST,
        StatusCode.BAD_REQUEST,
      );
    return this.packageCategoryRepository.create(data);
  }
  getAllCategories() {
    return this.packageCategoryRepository.findAll();
  }

  async getActiveCategoryService() {
    const categoryIds = await this.packageRepository.getUsedCategoryIds();

    return this.packageCategoryRepository.findCategoriesByIds(categoryIds);
  }
}
