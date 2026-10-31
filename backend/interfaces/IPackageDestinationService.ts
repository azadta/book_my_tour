import {
  CreateDestinationRequestInput,
  ICreateDestinationRequestDTO,
} from "../dto-mapping/dto/package-destination/packageDestinationRequestDTO";
import { IDestinationResponseDTO } from "../dto-mapping/dto/package-destination/packageDestinationResponseDTO";
import { IDestination } from "../models/Destination";

export interface IPackageDestinationService {
  createDestinationService(
    body: CreateDestinationRequestInput,
  ): Promise<IDestinationResponseDTO>;
  getAllDestinationsService(): Promise<IDestinationResponseDTO[]>;
  getDestinationByIdService(id: string): Promise<IDestinationResponseDTO>;
  deleteDestinationByIdService(id: string): Promise<void>;
  getDestinationsByPackageCategoryService(
    categoryName: string,
  ): Promise<IDestinationResponseDTO[]>;
}
