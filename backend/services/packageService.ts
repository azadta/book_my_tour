import { inject, injectable } from "inversify";
import { QueryFilter } from "mongoose";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import type { IDestinationRepository } from "../interfaces/IDestinationRepository";
import type { IPackageCategoryRepository } from "../interfaces/IPackageCategoryRepository";
import type { IPackageRepository } from "../interfaces/IPackageRepository";
import { IPackageService } from "../interfaces/IPackageService";
import { Ipackage } from "../models/Package";
import { Types } from "../types/types";
import { CustomError } from "../utils/customError";
import { Types as mongooseTypes } from "mongoose";
import {
  ICreatePackageRequestDTO,
  IUpdatePackageRequestDTO,
} from "../dto-mapping/dto/package/packageRequestDTO";

@injectable()
export class PackageService implements IPackageService {
  constructor(
    @inject(Types.PackageCategoryRepository)
    private packageCategoryRepository: IPackageCategoryRepository,
    @inject(Types.PackageRepository)
    private packageRepository: IPackageRepository,
    @inject(Types.DestinationRepository)
    private destinationRepository: IDestinationRepository,
  ) {}

  getTotalPackagesCount() {
    return this.packageRepository.countDocuments();
  }

  async deletePackageService(packageId: string): Promise<Ipackage | null> {
    return this.packageRepository.deleteById(packageId);
  }

  async createPackageService(dto: ICreatePackageRequestDTO): Promise<Ipackage> {
    const existingPackage = await this.packageRepository.getPackageByName(
      dto.name as string,
    );
    if (existingPackage) {
      throw new CustomError(
        RESPONSE_MESSAGES.PACKAGE.ERROR.NAME_ALREADY_EXIST,
        StatusCode.BAD_REQUEST,
      );
    }

    return await this.packageRepository.create(dto);
  }
  async getSinglePackageService(id: string): Promise<Ipackage | null> {
    return await this.packageRepository.getPackageById(id);
  }
  async updatePackageService(
    packageId: string,

    dto: IUpdatePackageRequestDTO,
  ): Promise<Ipackage | null> {
    return await this.packageRepository.updatePackageById(packageId, dto);
  }
  async updateOperatorPackageService(
    packageId: string,
    operatorId: string,
    dto: IUpdatePackageRequestDTO,
  ): Promise<Ipackage | null> {
    const existingPackage = await this.packageRepository.getByIdAndOperator(
      packageId,
      operatorId,
    );
    if (!existingPackage) {
      throw new CustomError(
        RESPONSE_MESSAGES.PACKAGE.ERROR.NOTFOUND_OR_UNAUTHORIZED,
        StatusCode.NOT_FOUND,
      );
    }
    return await this.packageRepository.updatePackageById(packageId, dto);
  }
  async deleteOperatorPackageService(
    packageId: string,
    operatorId: string,
  ): Promise<Ipackage | null> {
    return this.packageRepository.deleteByIdAndOperator(packageId, operatorId);
  }

  async getFilteredPaginatedPackagesService(
    filter: QueryFilter<Ipackage> = {},
    skip: number,
    limit: number,
  ): Promise<Ipackage[]> {
    return this.packageRepository.getFilteredPackages(filter, skip, limit);
  }

  getOperatorPackagesCountService(operatorId: string): Promise<number> {
    return this.packageRepository.countPackagesByOperatorId(operatorId);
  }

  async getPackageByIdAndOperatorService(
    packageId: string,
    operatorId: string,
  ) {
    const pkg = await this.packageRepository.getByIdAndOperator(
      packageId,
      operatorId,
    );
    if (!pkg) {
      throw new CustomError(
        RESPONSE_MESSAGES.PACKAGE.ERROR.NOTFOUND_OR_UNAUTHORIZED,
        StatusCode.NOT_FOUND,
      );
    }
    return pkg;
  }
  async getPaginatedPackagesService(
    skip: number,
    limit: number,
  ): Promise<Ipackage[]> {
    return this.packageRepository.getFilteredPackages({}, skip, limit);
  }

  getAllPackagesService() {
    return this.packageRepository.findAllPackages();
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
        await this.destinationRepository.findDestinationIdsByName(search);
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { destinations: { $in: destinationIds } },
      ];
    }

    if (maxDuration) {
      filter["duration.day"] = { $lte: Number(maxDuration) };
    }

    const [packages, totalCount, uniqueCategoryCount] = await Promise.all([
      this.packageRepository.getFilteredPackages(
        filter,
        skip,
        Number(limit),
        String(sortBy),
        String(sortOrder),
      ),
      this.packageRepository.getFilteredPackagesCount(filter),
      this.packageRepository.getUniqueCategoryCount(filter),
    ]);

    return { packages, totalCount, uniqueCategoryCount };
  }
  async getPackageByIdService(id: string) {
    const pkg = await this.packageRepository.getPackageById(id);
    if (pkg) {
      new CustomError(RESPONSE_MESSAGES.PACKAGE.ERROR.NOT_FOUND, 404);
    }
    return pkg;
  }
  async getPackagesByCategoryService(categoryName: string) {
    const category =
      await this.packageCategoryRepository.findPackageCategoryByName(
        categoryName,
      );
    if (!category) return [];

    return this.packageRepository.findPackageByCategory(
      category._id.toString(),
    );
  }
}
