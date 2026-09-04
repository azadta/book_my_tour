import { QueryFilter } from "mongoose";
import { Ipackage } from "../models/Package";

export interface IPackageService {
  getTotalPackagesCount(): Promise<number>;
  deletePackageService(packageId: string): Promise<Ipackage | null>;
  createPackageService(data: Partial<Ipackage>): Promise<Ipackage>;
  getSinglePackageService(id: string): Promise<Ipackage | null>;
  updatePackageService(
    packageId: string,
    data: Partial<Ipackage>,
  ): Promise<Ipackage | null>;
  updateOperatorPackageService(
    packageId: string,
    operatorId: string,
    data: Partial<Ipackage>,
  ): Promise<Ipackage | null>;
  deleteOperatorPackageService(
    packageId: string,
    operatorId: string,
  ): Promise<Ipackage | null>;
  getFilteredPaginatedPackagesService(
    filter: QueryFilter<Ipackage>,
    skip: number,
    limit: number,
  ): Promise<Ipackage[]>;
  getOperatorPackagesCountService(operatorId: string): Promise<number>;
  getPackageByIdAndOperatorService(
    packageId: string,
    operatorId: string,
  ): Promise<Ipackage>;
  getPaginatedPackagesService(skip: number, limit: number): Promise<Ipackage[]>;
  getAllPackagesService(): Promise<Ipackage[]>;
  getFilteredPackagesService(query: any): Promise<{
    packages: Ipackage[];
    totalCount: number;
    uniqueCategoryCount: number;
  }>;
  getPackageByIdService(id: string): Promise<Ipackage | null>;
  getPackagesByCategoryService(categoryName: string): Promise<Ipackage[]>;
}
