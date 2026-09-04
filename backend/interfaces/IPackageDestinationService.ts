import { ICreateDestinationRequestDTO } from "../dto-mapping/dto/package-destination/packageDestinationRequestDTO";
import { IDestination } from "../models/Destination";

export interface IPackageDestinationService {
  createDestinationService(
    dto: ICreateDestinationRequestDTO,
  ): Promise<IDestination>;
  getAllDestinationsService(): Promise<IDestination[]>;
  getDestinationByIdService(id: string): Promise<IDestination>;
  deleteDestinationByIdService(id: string): Promise<void>;
  getDestinationsByPackageCategoryService(categoryName: string): Promise<any[]>;
}
