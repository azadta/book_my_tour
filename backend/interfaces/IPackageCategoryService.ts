import { CreateCategoryInput, ICreateCategoryRequestDTO } from "../dto-mapping/dto/package-category/packageCategoryRequestDTO";
import { ICategoryResponseDTO } from "../dto-mapping/dto/package-category/packageCategoryResponseDTO";
import { IPackageCategory } from "../models/PackageCategory";

export interface IPackageCategoryService {
  createCategoryService(
    body: CreateCategoryInput,
  ): Promise<ICategoryResponseDTO>;
  getAllCategories(): Promise<ICategoryResponseDTO[]>;
  getActiveCategoryService(): Promise<ICategoryResponseDTO[]>;
}
