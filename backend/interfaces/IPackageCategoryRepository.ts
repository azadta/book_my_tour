import { IPackageCategory } from "../models/PackageCategory";
import { IBaseRepository } from "./IBaseRepository";

export interface IPackageCategoryRepository extends IBaseRepository<IPackageCategory> {
  findPackageCategoryByName(name: string): Promise<IPackageCategory | null>;
  save(packageCategory: IPackageCategory): Promise<IPackageCategory>;
}
