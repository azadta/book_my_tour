import { inject, injectable } from "inversify";
import { Types as mongooseTypes, QueryFilter } from "mongoose";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import {
  IUpdatePackageRequestDTO,
  PackageInput,
} from "../dto-mapping/dto/package/packageRequestDTO";
import { IPackageResponseDTO } from "../dto-mapping/dto/package/packageResponseDTO";
import { PackageRequestMapper } from "../dto-mapping/mapper/package/PackageRequestMapper";
import { PackageResponseMapper } from "../dto-mapping/mapper/package/PackageResponseMapper";
import type { IDestinationRepository } from "../interfaces/IDestinationRepository";
import type { IPackageCategoryRepository } from "../interfaces/IPackageCategoryRepository";
import type { IPackageRepository } from "../interfaces/IPackageRepository";
import { IPackageService } from "../interfaces/IPackageService";
import { Ipackage } from "../models/Package";
import { Types } from "../types/types";
import { CustomError } from "../utils/customError";

@injectable()
export class PackageService implements IPackageService {
  constructor(
    @inject(Types.PackageCategoryRepository)
    private _packageCategoryRepository: IPackageCategoryRepository,
    @inject(Types.PackageRepository)
    private _packageRepository: IPackageRepository,
    @inject(Types.DestinationRepository)
    private _destinationRepository: IDestinationRepository,
  ) {}

  getTotalPackagesCount() {
    return this._packageRepository.countDocuments();
  }

  async deletePackageService(packageId: string): Promise<Ipackage | null> {
    return this._packageRepository.deleteById(packageId);
  }

  async createPackageService(operatorId: string, body: PackageInput) {
    const dto = PackageRequestMapper.toCreatePackageEntity(body, operatorId);
    const existingPackage = await this._packageRepository.getPackageByName(
      dto.name as string,
    );
    if (existingPackage) {
      throw new CustomError(
        RESPONSE_MESSAGES.PACKAGE.ERROR.NAME_ALREADY_EXIST,
        StatusCode.BAD_REQUEST,
      );
    }

    const pkg = await this._packageRepository.create(dto);
    return PackageResponseMapper.toPackageResponseDTO(pkg);
  }

  async updatePackageService(
    packageId: string,

    body: PackageInput,
  ): Promise<IPackageResponseDTO> {
    const dto = PackageRequestMapper.toUpdatePackageEntity(body);
    const updatedPackage = await this._packageRepository.updatePackageById(
      packageId,
      dto,
    );
    return PackageResponseMapper.toPackageResponseDTO(updatedPackage);
  }
  async updateOperatorPackageService(
    packageId: string,
    operatorId: string,
    body: PackageInput,
  ): Promise<IPackageResponseDTO> {
    const dto = PackageRequestMapper.toUpdatePackageEntity(body);
    const existingPackage = await this._packageRepository.getByIdAndOperator(
      packageId,
      operatorId,
    );
    if (!existingPackage) {
      throw new CustomError(
        RESPONSE_MESSAGES.PACKAGE.ERROR.NOTFOUND_OR_UNAUTHORIZED,
        StatusCode.NOT_FOUND,
      );
    }

    const updatedPackage = await this._packageRepository.updatePackageById(
      packageId,
      dto,
    );
    return PackageResponseMapper.toPackageResponseDTO(updatedPackage);
  }
  async deleteOperatorPackageService(
    packageId: string,
    operatorId: string,
  ): Promise<Ipackage | null> {
    return this._packageRepository.deleteByIdAndOperator(packageId, operatorId);
  }

  async getFilteredPaginatedPackagesService(
    filter: QueryFilter<Ipackage> = {},
    skip: number,
    limit: number,
  ): Promise<IPackageResponseDTO[]> {
    const packages = await this._packageRepository.getFilteredPackages(
      filter,
      skip,
      limit,
    );
    return PackageResponseMapper.toPackageListResponseDTO(packages);
  }

  getOperatorPackagesCountService(operatorId: string): Promise<number> {
    return this._packageRepository.countPackagesByOperatorId(operatorId);
  }

  async getPackageByIdAndOperatorService(
    packageId: string,
    operatorId: string,
  ) {
    const pkg = await this._packageRepository.getByIdAndOperator(
      packageId,
      operatorId,
    );
    if (!pkg) {
      throw new CustomError(
        RESPONSE_MESSAGES.PACKAGE.ERROR.NOTFOUND_OR_UNAUTHORIZED,
        StatusCode.NOT_FOUND,
      );
    }
    return PackageResponseMapper.toPackageResponseDTO(pkg);
  }
  async getPaginatedPackagesService(
    skip: number,
    limit: number,
  ): Promise<IPackageResponseDTO[]> {
    const packages = await this._packageRepository.getFilteredPackages(
      {},
      skip,
      limit,
    );
    return PackageResponseMapper.toPackageListResponseDTO(packages);
  }

  async getAllPackagesService() {
    const packages = await this._packageRepository.findAllPackages();
    return PackageResponseMapper.toPackageListResponseDTO(packages);
  }

  async getFilteredPackagesService(query: any) {
    const {
      page = 1,
      limit = 6,
      category,
      destination,

      startDate,
      maxBudget,
      search,
      maxDuration,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    const skip = page > 1 ? (Number(page) - 1) * Number(limit) : 0;
    const filter: any = {};
    if (category && mongooseTypes.ObjectId.isValid(category)) {
      filter.category = new mongooseTypes.ObjectId(category);
    }
    if (destination && mongooseTypes.ObjectId.isValid(destination)) {
      filter.destinations = new mongooseTypes.ObjectId(destination);
    }

    if (startDate) {
      filter.startDate = { $gte: new Date(startDate) };
    }

    if (maxBudget) {
      filter.amount = { $lte: Number(maxBudget) };
    }
    if (search) {
      const destinationIds =
        await this._destinationRepository.findDestinationIdsByName(search);
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { destinations: { $in: destinationIds } },
      ];
    }

    if (maxDuration) {
      filter["duration.day"] = { $lte: Number(maxDuration) };
    }

    const [packages, totalCount, uniqueCategoryCount] = await Promise.all([
      this._packageRepository.getFilteredPackages(
        filter,
        skip,
        Number(limit),
        String(sortBy),
        String(sortOrder),
      ),
      this._packageRepository.getFilteredPackagesCount(filter),
      this._packageRepository.getUniqueCategoryCount(filter),
    ]);

    return {
      packages: PackageResponseMapper.toPackageListResponseDTO(packages),
      totalCount,
      uniqueCategoryCount,
    };
  }
  async getPackageByIdService(id: string) {
    const pkg = await this._packageRepository.getPackageById(id);
    if (!pkg) {
      throw new CustomError(RESPONSE_MESSAGES.PACKAGE.ERROR.NOT_FOUND, 404);
    }
    return PackageResponseMapper.toPackageResponseDTO(pkg);
  }
  async getPackagesByCategoryService(categoryName: string) {
    const category =
      await this._packageCategoryRepository.findPackageCategoryByName(
        categoryName,
      );
    if (!category) return [];

    const packages=await this._packageRepository.findPackageByCategory(
      category._id.toString(),
    );

   return PackageResponseMapper.toPackageListResponseDTO(packages)
  }
}
