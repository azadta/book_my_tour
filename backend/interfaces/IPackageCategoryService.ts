import { ICreateCategoryRequestDTO } from "../dto-mapping/dto/package-category/packageCategoryRequestDTO";
import { IPackageCategory } from "../models/PackageCategory";

export interface IPackageCategoryService {
  createCategoryService(
    dto: ICreateCategoryRequestDTO,
  ): Promise<IPackageCategory>;
  getAllCategories(): Promise<IPackageCategory[]>;
  getActiveCategoryService(): Promise<IPackageCategory[]>;
}
