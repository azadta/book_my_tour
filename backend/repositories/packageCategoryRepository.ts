import { injectable } from "inversify";
import { IPackageCategoryRepository } from "../interfaces/IPackageCategoryRepository";
import PackageCategory, { IPackageCategory } from "../models/PackageCategory";
import { BaseRepository } from "./baseRepository";

@injectable()
export class PackageCategoryRepository
  extends BaseRepository<IPackageCategory>
  implements IPackageCategoryRepository
{
  constructor() {
    super(PackageCategory);
  }

  findPackageCategoryByName(name: string): Promise<IPackageCategory | null> {
    return PackageCategory.findOne({ name });
  }
  async save(packageCategory: IPackageCategory): Promise<IPackageCategory> {
    return packageCategory.save();
  }
}
