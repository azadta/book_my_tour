import { injectable } from "inversify";
import { HydratedDocument, Types } from "mongoose";
import { IPackageRepository } from "../interfaces/IPackageRepository";
import Package, { Ipackage } from "../models/Package";
import { BaseRepository } from "./baseRepository";

@injectable()
export class PackageRepository
  extends BaseRepository<Ipackage>
  implements IPackageRepository
{
  constructor() {
    super(Package);
  }

  async save(item: HydratedDocument<Ipackage>): Promise<Ipackage> {
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
    sortBy: string = "createdAt",
    sortOrder: string = "desc",
  ): Promise<Ipackage[]> {
    const order = sortOrder === "asc" ? 1 : -1;

    let sortField = sortBy;
    if (sortBy === "price") {
      sortField = "finalPrice";
    } else if (sortBy === "rating") {
      sortField = "averageRating";
    }
    const matchFilter = { ...filter };
    if (
      matchFilter.operatorId &&
      typeof matchFilter.operatorId === "string" &&
      Types.ObjectId.isValid(matchFilter.operatorId)
    ) {
      matchFilter.operatorId = new Types.ObjectId(matchFilter.operatorId);
    }

    return Package.aggregate([
      { $match: matchFilter },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "packageId",
          as: "reviewDocs",
        },
      },
      {
        $addFields: {
          reviewCount: { $size: "$reviewDocs" },
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviewDocs" }, 0] },
              then: { $round: [{ $avg: "$reviewDocs.rating" }, 1] },
              else: 0,
            },
          },
          finalPrice: {
            $cond: {
              if: { $gt: [`$discount`, 0] },
              then: {
                $subtract: [
                  "$amount",
                  { $multiply: ["$amount", { $divide: ["$discount", 100] }] },
                ],
              },
              else: "$amount",
            },
          },
        },
      },
      { $sort: { [sortField]: order, _id: 1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "destinations",
          localField: "destinations",
          foreignField: "_id",
          as: "destinations",
        },
      },
      {
        $lookup: {
          from: "packagecategories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "operators",
          localField: "operatorId",
          foreignField: "_id",
          as: "operatorId",
        },
      },
      { $unwind: { path: "$operatorId", preserveNullAndEmptyArrays: true } },
      { $project: { reviewDocs: 0, finalPrice: 0 } },
    ]);
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
  async deleteByIdAndOperator(
    packageId: string,
    operatorId: string,
  ): Promise<Ipackage | null> {
    return Package.findOneAndDelete({ _id: packageId, operatorId });
  }

  async getByIdAndOperator(
    packageId: string,
    operatorId: string,
  ): Promise<Ipackage | null> {
    return Package.findOne({ _id: packageId, operatorId });
  }

  async findPackageByCategory(categoryId: string): Promise<Ipackage[]> {
    return Package.find({ category: categoryId }).populate(
      "destinations category",
    );
  }
  async updatePackageById(
    packageId: string,
    data: Ipackage,
  ): Promise<Ipackage | null> {
    return Package.findByIdAndUpdate(packageId, data, { new: true });
  }
}
