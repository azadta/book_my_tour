import { Types } from "mongoose";
import { Ipackage } from "../models/Package";
import { IBaseRepository } from "./IBaseRepository";

export interface IPackageRepository extends IBaseRepository<Ipackage> {
  countPackagesByOperatorId(operatorId: string): Promise<number>;
  getPackageByName(name: string): Promise<Ipackage | null>;
  getPackageById(id: string): Promise<Ipackage | null>;
  save(item: Ipackage): Promise<Ipackage>;
  findAllPackages(): Promise<Ipackage[]>;
  getFilteredPackages(
    filter: any,
    skip: number,
    limit: number,
    sortBy?: string,
    sortOrder?: string,
  ): Promise<Ipackage[]>;
  getFilteredPackagesCount(filter: any): Promise<number>;
  getUsedCategoryIds(): Promise<Types.ObjectId[]>;
  getUniqueCategoryCount(filter: any): Promise<number>;
  deleteByIdAndOperator(
    packageId: string,
    operatorId: string,
  ): Promise<Ipackage | null>;
  getByIdAndOperator(
    packageId: string,
    operatorId: string,
  ): Promise<Ipackage | null>;
  findPackageByCategory(categoryId: string): Promise<Ipackage[]>;
  updatePackageById(
    packageId: string,
    data: Partial<Ipackage>,
  ): Promise<Ipackage | null>;
}
