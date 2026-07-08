import { injectable } from "inversify";
import { IPackageCategoryRepository } from "../interfaces/IPackageCategoryRepository";
import PackageCategory, { IPackageCategory } from "../models/PackageCategory";
import { BaseRepository } from "./baseRepository";
import { Types } from "mongoose";

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

  async findCategoriesByIds(ids:Types.ObjectId[]):Promise<IPackageCategory[]>{
    return PackageCategory.find({_id:{$in:ids}}).select('name _id').sort({name:1})

  }
}
