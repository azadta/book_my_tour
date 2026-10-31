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
import {
  CreateDestinationRequestInput,
  ICreateDestinationRequestDTO,
} from "../dto-mapping/dto/package-destination/packageDestinationRequestDTO";
import { PackageDestinationRequestMapper } from "../dto-mapping/mapper/package-destination/PackageDestinationRequestMapper";
import { PackageDestinationResponseMapper } from "../dto-mapping/mapper/package-destination/PackageDestinationResponseMapper";
import { IDestinationResponseDTO } from "../dto-mapping/dto/package-destination/packageDestinationResponseDTO";

@injectable()
export class PackageDestinationService implements IPackageDestinationService {
  constructor(
    @inject(Types.PackageCategoryRepository)
    private _packageCategoryRepository: IPackageCategoryRepository,
    @inject(Types.PackageRepository)
    private _packageRepository: IPackageRepository,
    @inject(Types.DestinationRepository)
    private _destinationRepository: IDestinationRepository,
  ) {}

  async createDestinationService(
    body: CreateDestinationRequestInput,
  ): Promise<IDestinationResponseDTO> {
    const dto = PackageDestinationRequestMapper.toDestinationEntity(body);
    const existing = await this._destinationRepository.findDestinationByName(
      dto.name as string,
    );
    if (existing)
      throw new CustomError(
        RESPONSE_MESSAGES.DESTINATION.ERROR.ALREADY_EXISTS,
        StatusCode.BAD_REQUEST,
      );

    const destination = await this._destinationRepository.create({
      name: (dto.name as string).trim(),
      location: {
        latitude: dto.location.latitude,
        longitude: dto.location.longitude,
      },
      images: Array.isArray(dto.images) ? dto.images : [],
    });
    return PackageDestinationResponseMapper.toDestinationResponseDTO(
      destination,
    );
  }
  async getAllDestinationsService(): Promise<IDestinationResponseDTO[]> {
    const destinations = await this._destinationRepository.findAll();
    return PackageDestinationResponseMapper.toDestinationListResponseDTO(
      destinations,
    );
  }
  async getDestinationByIdService(
    id: string,
  ): Promise<IDestinationResponseDTO> {
    const destination = await this._destinationRepository.findById(id);
    if (!destination) {
      throw new CustomError(
        RESPONSE_MESSAGES.DESTINATION.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    return PackageDestinationResponseMapper.toDestinationResponseDTO(
      destination,
    );
  }
  async deleteDestinationByIdService(id: string): Promise<void> {
    const deleted = await this._destinationRepository.deleteById(id);
    if (!deleted)
      throw new CustomError(
        RESPONSE_MESSAGES.DESTINATION.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
  }

  async getDestinationsByPackageCategoryService(categoryName: string) {
    const category =
      await this._packageCategoryRepository.findPackageCategoryByName(
        categoryName,
      );
    if (!category) return [];

    const packages = await this._packageRepository.findPackageByCategory(
      category._id.toString(),
    );
    const destinationMap = new Map();
    packages.forEach((pkg: any) => {
      pkg.destinations.forEach((destination: any) => {
        destinationMap.set(destination._id.toString(), destination);
      });
    });
    const destinations = [...destinationMap.values()];
    return PackageDestinationResponseMapper.toDestinationListResponseDTO(
      destinations,
    );
  }
}
