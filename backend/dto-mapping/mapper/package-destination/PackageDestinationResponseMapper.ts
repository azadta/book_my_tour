import { Types } from "mongoose";
import { IDestination } from "../../../models/Destination";
import { IDestinationResponseDTO } from "../../dto/package-destination/packageDestinationResponseDTO";
import {
  IDestinationSummaryDTO,
  IDestinationSummaryInput,
} from "../../dto/package/packageRequestDTO";

export class PackageDestinationResponseMapper {
  static toDestinationResponseDTO(
    doc: IDestination | null,
  ): IDestinationResponseDTO {
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

  static toDestinationListResponseDTO(
    docs: IDestination[],
  ): IDestinationResponseDTO[] {
    if (!Array.isArray(docs)) return [];
    return docs.map((doc) => this.toDestinationResponseDTO(doc));
  }

  static toSummaryDTOList(
    destinations: IDestinationSummaryInput[] | Types.ObjectId[],
  ): IDestinationSummaryDTO[] | string[] {
    if (!destinations) return [];
    const isPopualted = destinations.some(
      (dest) =>
        !(dest instanceof Types.ObjectId) &&
        typeof dest === "object" &&
        dest !== null,
    );
    if (isPopualted) {
      return destinations.map((dest) => {
        const doc = dest as IDestinationSummaryInput;
        return { _id: doc?._id.toString(), name: doc?.name || "" };
      });
    } else {
      return destinations.map((dest) => dest.toString());
    }
  }
}
