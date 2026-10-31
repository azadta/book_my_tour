import { QueryFilter } from "mongoose";
import { PackageInput } from "../dto-mapping/dto/package/packageRequestDTO";
import { IPackageResponseDTO } from "../dto-mapping/dto/package/packageResponseDTO";
import { Ipackage } from "../models/Package";

export interface IPackageService {
  getTotalPackagesCount(): Promise<number>;
  deletePackageService(packageId: string): Promise<Ipackage | null>;
  createPackageService(
    operatorId: string,
    body: PackageInput,
  ): Promise<IPackageResponseDTO>;
  updatePackageService(
    packageId: string,
    body: PackageInput,
  ): Promise<IPackageResponseDTO>;
  updateOperatorPackageService(
    packageId: string,
    operatorId: string,
    body: PackageInput,
  ): Promise<IPackageResponseDTO>;

  deleteOperatorPackageService(
    packageId: string,
    operatorId: string,
  ): Promise<Ipackage | null>;
  getFilteredPaginatedPackagesService(
    filter: QueryFilter<Ipackage>,
    skip: number,
    limit: number,
  ): Promise<IPackageResponseDTO[]>;
  getOperatorPackagesCountService(operatorId: string): Promise<number>;
  getPackageByIdAndOperatorService(
    packageId: string,
    operatorId: string,
  ): Promise<IPackageResponseDTO>;
  getPaginatedPackagesService(skip: number, limit: number): Promise<IPackageResponseDTO[]>;
  getAllPackagesService(): Promise<IPackageResponseDTO[]>;
  getFilteredPackagesService(query: any): Promise<{
    packages: IPackageResponseDTO[];
    totalCount: number;
    uniqueCategoryCount: number;
  }>;
  getPackageByIdService(id: string): Promise<IPackageResponseDTO>;
  getPackagesByCategoryService(categoryName: string): Promise<IPackageResponseDTO[]>;
}
