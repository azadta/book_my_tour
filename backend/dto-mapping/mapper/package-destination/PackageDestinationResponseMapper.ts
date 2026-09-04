import { IDestinationResponseDTO } from "../../dto/package-destination/packageDestinationResponseDTO";
import { IDestinationSummaryDTO } from "../../dto/package/packageRequestDTO";

export class PackageDestinationResponseMapper {
  static toDestinationResponseDTO(doc: any): IDestinationResponseDTO {
    if (!doc) return {} as IDestinationResponseDTO;
    const raw = doc.toObject ? doc.toObject() : doc;
    return {
      _id: raw?._id?.toString() ?? "",
      name: raw?.name ?? "",
      location: {
        latitude: raw?.location?.latitude,
        longitude: raw?.location?.longitude,
      },
      images: Array.isArray(raw?.images) ? raw.images : [],
      createdAt: raw?.createdAt,
    };
  }

  static toDestinationListResponseDTO(docs: any[]): IDestinationResponseDTO[] {
    if (!Array.isArray(docs)) return [];
    return docs.map((doc) => this.toDestinationResponseDTO(doc));
  }

  static toSummaryDTOList(
    destinations: any[],
  ): IDestinationSummaryDTO[] | string[] {
    if (!Array.isArray(destinations)) return [];
    return destinations.map((dest) => {
      if (!dest) return "";
      if (typeof dest === "object" && dest.name !== undefined) {
        return {
          _id: dest?._id.toString() ?? "",
          name: dest.name || "",
        };
      }
      return dest?.toString();
    });
  }
}
