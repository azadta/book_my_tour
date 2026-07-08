import { injectable } from "inversify";
import { IPackageRepository } from "../interfaces/IPackageRepository";
import Package, { Ipackage } from "../models/Package";
import { BaseRepository } from "./baseRepository";
import { Types } from "mongoose";

@injectable()
export class PackageRepository
  extends BaseRepository<Ipackage>
  implements IPackageRepository
{
  constructor() {
    super(Package);
  }

  findPaginatedPackages(skip: number, limit: number): Promise<Ipackage[]> {
    return Package.find()
      .skip(skip)
      .limit(limit)
      .populate("destinations category operatorId");
  }
  async save(item: Ipackage): Promise<Ipackage> {
    return item.save();
  }

  async countPackagesByOperatorId(operatorId: string): Promise<number> {
    return Package.countDocuments({ operatorId });
  }

  async getPackageByName(name: string): Promise<Ipackage | null> {
    return await Package.findOne({ name: { $regex: name, $options: "i" } });
  }

  async getPackageById(id: string): Promise<Ipackage | null> {
    return await Package.findById(id).populate("destinations category");
  }

  findAllPackages(): Promise<Ipackage[]> {
    return Package.find().populate("destinations category operatorId");
  }

  async getFilteredPackages(
    filter: any,
    skip: number,
    limit: number,
  ): Promise<Ipackage[]> {
    return Package.find(filter)
      .skip(skip)
      .limit(limit)
      .populate("destinations category");
  }

  async getFilteredPackagesCount(filter: any) {
    return Package.countDocuments(filter);
  }

  async getUsedCategoryIds(): Promise<Types.ObjectId[]> {
    return Package.distinct("category");
  }

  async getUniqueCategoryCount(filter: any): Promise<number> {
    const categories = await Package.distinct("category", filter);
    return categories.length;
  }


}
