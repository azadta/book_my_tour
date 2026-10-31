import { inject, injectable } from "inversify";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import {
  CreateCategoryInput
} from "../dto-mapping/dto/package-category/packageCategoryRequestDTO";
import { ICategoryResponseDTO } from "../dto-mapping/dto/package-category/packageCategoryResponseDTO";
import { PackageCategoryRequestMapper } from "../dto-mapping/mapper/package-category/PackageCategoryRequestMapper";
import { CategoryResponseMapper } from "../dto-mapping/mapper/package-category/PackageCategoryResponseMapper";
import type { IPackageCategoryRepository } from "../interfaces/IPackageCategoryRepository";
import { IPackageCategoryService } from "../interfaces/IPackageCategoryService";
import type { IPackageRepository } from "../interfaces/IPackageRepository";
import { Types } from "../types/types";
import { CustomError } from "../utils/customError";

@injectable()
export class PackageCategoryService implements IPackageCategoryService {
  constructor(
    @inject(Types.PackageCategoryRepository)
    private _packageCategoryRepository: IPackageCategoryRepository,
    @inject(Types.PackageRepository)
    private _packageRepository: IPackageRepository,
  ) {}

  async createCategoryService(
    body: CreateCategoryInput,
  ): Promise<ICategoryResponseDTO> {
    const dto = PackageCategoryRequestMapper.toCreatePackageCategory(body);
    const existing =
      await this._packageCategoryRepository.findPackageCategoryByName(
        dto?.name as string,
      );
    if (existing)
      throw new CustomError(
        RESPONSE_MESSAGES.CATEGORY.ERROR.ALREADY_EXIST,
        StatusCode.BAD_REQUEST,
      );
    const category = await this._packageCategoryRepository.create(dto);
    return CategoryResponseMapper.toCategoryResponseDTO(category);
  }
  async getAllCategories() {
    const categories = await this._packageCategoryRepository.findAll();
    return CategoryResponseMapper.toCategoryListResponseDTO(categories);
  }

  async getActiveCategoryService() {
    const categoryIds = await this._packageRepository.getUsedCategoryIds();

    const categories =
      await this._packageCategoryRepository.findCategoriesByIds(categoryIds);
    return CategoryResponseMapper.toCategoryListResponseDTO(categories);
  }
}
