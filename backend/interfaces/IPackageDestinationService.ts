import { IDestination } from "../models/Destination";

export interface IPackageDestinationService {
  createDestinationService(
    data: Partial<IDestination> & {
      latitude?: number;
      longitude?: number;
    },
  ): Promise<IDestination>;
  getAllDestinationsService(): Promise<IDestination[]>;
  getDestinationByIdService(id: string): Promise<IDestination>;
  deleteDestinationByIdService(id: string): Promise<void>;
  getDestinationsByPackageCategoryService(categoryName: string): Promise<any[]>;
}
