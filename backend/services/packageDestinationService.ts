import { inject, injectable } from "inversify";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import type { IDestinationRepository } from "../interfaces/IDestinationRepository";
import type { IPackageCategoryRepository } from "../interfaces/IPackageCategoryRepository";
import { IPackageDestinationService } from "../interfaces/IPackageDestinationService";
import type { IPackageRepository } from "../interfaces/IPackageRepository";
import { IDestination } from "../models/Destination";
import { Types } from "../types/types";
import { CustomError } from "../utils/customError";
import { ICreateDestinationRequestDTO } from "../dto-mapping/dto/package-destination/packageDestinationRequestDTO";

@injectable()
export class PackageDestinationService implements IPackageDestinationService {
  constructor(
    @inject(Types.PackageCategoryRepository)
    private packageCategoryRepository: IPackageCategoryRepository,
    @inject(Types.PackageRepository)
    private packageRepository: IPackageRepository,
    @inject(Types.DestinationRepository)
    private destinationRepository: IDestinationRepository,
  ) {}

  async createDestinationService(
    dto: ICreateDestinationRequestDTO,
  ): Promise<IDestination> {
    const existing = await this.destinationRepository.findDestinationByName(
      dto.name as string,
    );
    if (existing)
      throw new CustomError(
        RESPONSE_MESSAGES.DESTINATION.ERROR.ALREADY_EXISTS,
        StatusCode.BAD_REQUEST,
      );

    return this.destinationRepository.create({
      name: (dto.name as string).trim(),
      location: {
        latitude: dto.location.latitude,
        longitude: dto.location.longitude,
      },
      images: Array.isArray(dto.images) ? dto.images : [],
    });
  }
  getAllDestinationsService(): Promise<IDestination[]> {
    return this.destinationRepository.findAll();
  }
  async getDestinationByIdService(id: string): Promise<IDestination> {
    const destination = await this.destinationRepository.findById(id);
    if (!destination) {
      throw new CustomError(
        RESPONSE_MESSAGES.DESTINATION.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    return destination;
  }
  async deleteDestinationByIdService(id: string): Promise<void> {
    const deleted = await this.destinationRepository.deleteById(id);
    if (!deleted)
      throw new CustomError(
        RESPONSE_MESSAGES.DESTINATION.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
  }

  async getDestinationsByPackageCategoryService(categoryName: string) {
    const category =
      await this.packageCategoryRepository.findPackageCategoryByName(
        categoryName,
      );
    if (!category) return [];

    const packages = await this.packageRepository.findPackageByCategory(
      category._id.toString(),
    );
    const destinationMap = new Map();
    packages.forEach((pkg: any) => {
      pkg.destinations.forEach((destination: any) => {
        destinationMap.set(destination._id.toString(), destination);
      });
    });
    return [...destinationMap.values()];
  }
}
