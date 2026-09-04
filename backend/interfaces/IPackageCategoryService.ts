import { IPackageCategory } from "../models/PackageCategory";

export interface IPackageCategoryService {
  createCategoryService(
    data: Partial<IPackageCategory>,
  ): Promise<IPackageCategory>;
  getAllCategories(): Promise<IPackageCategory[]>;
  getActiveCategoryService(): Promise<IPackageCategory[]>;
}
