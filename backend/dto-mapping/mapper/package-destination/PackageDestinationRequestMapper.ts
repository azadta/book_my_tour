import { ICreateDestinationRequestDTO } from "../../dto/package-destination/packageDestinationRequestDTO";

export class PackageDestinationRequestMapper {
  static toDestinationEntity(data: any): ICreateDestinationRequestDTO {
    return {
      name: data?.name?.trim() ?? "",
      location: {
        latitude: Number(data?.latitude),
        longitude: Number(data?.longitude),
      },
      images: Array.isArray(data?.images) ? data.images : [],
    };
  }
}
