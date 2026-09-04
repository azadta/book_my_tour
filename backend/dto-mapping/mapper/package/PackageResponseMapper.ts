import {
  ICategorySummaryDTO,
  IDestinationSummaryDTO,
  IOperatorSummaryDTO,
} from "../../dto/package/packageRequestDTO";
import { IPackageResponseDTO } from "../../dto/package/packageResponseDTO";

export class PackageResponseMapper {
  private static mapDestinations(
    destinations: any,
  ): IDestinationSummaryDTO[] | string[] {
    if (!Array.isArray(destinations)) return [];
    return destinations.map((dest) => {
      if (!dest) return "";
      if (typeof dest === "object" && dest?.name !== undefined) {
        return { _id: dest?._id.toString(), name: dest?.name || "" };
      }
      return dest.toString();
    });
  }

  private static mapCategory(category: any): ICategorySummaryDTO | string {
    if (!category) return "";
    if (typeof category === "object" && category?.name !== undefined) {
      return {
        _id: category?._id.toString(),
        name: category?.name || "",
      };
    }
    return category.toString();
  }

  private static mapOperator(operator: any): IOperatorSummaryDTO | string {
    if (!operator) return "";
    if (typeof operator === "object" && operator !== null) {
      return {
        _id: operator?._id.toString() ?? "",
        name: operator?.name ?? "",
        email: operator?.email ?? "",
        phone: operator?.phone,
      };
    }
    return operator.toString();
  }

  static toPackageResponseDTO(doc: any): IPackageResponseDTO {
    const raw = doc.toObject ? doc.toObject() : doc;
    return {
      _id: raw?._id.toString(),
      name: raw?.name,
      amount: raw?.amount,
      destinations: PackageResponseMapper.mapDestinations(raw.destinations),
      duration: raw?.duration,
      specifications: raw.specifications,
      startDate: raw.startDate,
      remark: raw.remark,
      discount: raw.discount,
      availableSlots: raw.availableSlots,
      images: raw.images || [],
      category: PackageResponseMapper.mapCategory(raw.category),
      operatorId: PackageResponseMapper.mapOperator(raw.operatorId),
      itinerary: raw.itinerary || [],
      reviewCount: raw.reviewCount ?? 0,
      averageRating: raw.averageRating ?? 0,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  static toPackageListResponseDTO(docs: any[]): IPackageResponseDTO[] {
    return docs.map((doc) => PackageResponseMapper.toPackageResponseDTO(doc));
  }
}
