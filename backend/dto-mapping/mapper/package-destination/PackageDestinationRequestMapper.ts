import { CreateDestinationRequestInput, ICreateDestinationRequestDTO } from "../../dto/package-destination/packageDestinationRequestDTO";

export class PackageDestinationRequestMapper {
  static toDestinationEntity(data:CreateDestinationRequestInput): ICreateDestinationRequestDTO {
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
