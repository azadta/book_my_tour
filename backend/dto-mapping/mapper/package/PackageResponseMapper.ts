import { Types } from "mongoose";
import {
  IOperatorSummaryDTO,
  IOperatorSummaryInput,
} from "../../dto/package/packageRequestDTO";
import {
  IPackageResponseDTO,
  PackageResponseInput,
} from "../../dto/package/packageResponseDTO";
import { CategoryResponseMapper } from "../package-category/PackageCategoryResponseMapper";
import { PackageDestinationResponseMapper } from "../package-destination/PackageDestinationResponseMapper";

export class PackageResponseMapper {
  private static mapOperator(
    operator: IOperatorSummaryInput | Types.ObjectId,
  ): IOperatorSummaryDTO | string {
    if (!operator) return "";
    if (operator instanceof Types.ObjectId) return operator.toString();

    return {
      _id: operator?._id.toString() ?? "",
      name: operator?.name ?? "",
      email: operator?.email ?? "",
      ...(operator.phone && { phone: operator?.phone }),
    };
  }

  static toPackageResponseDTO(doc: PackageResponseInput): IPackageResponseDTO {
    return {
      _id: doc?._id.toString(),
      name: doc?.name,
      amount: doc?.amount,
      childPricing: doc?.childPricing,
      destinations: PackageDestinationResponseMapper.toSummaryDTOList(
        doc.destinations,
      ),
      duration: doc?.duration,
      specifications: doc.specifications,
      startDate: doc.startDate,
      startPoint: doc.startPoint,
      remark: doc.remark,
      discount: doc.discount,
      availableSlots: doc.availableSlots,
      images: doc.images || [],
      category: CategoryResponseMapper.toCategorySummaryDTO(doc.category),
      operatorId: PackageResponseMapper.mapOperator(doc.operatorId),
      itinerary: doc.itinerary || [],
      reviewCount: doc.reviewCount ?? 0,
      averageRating: doc.averageRating ?? 0,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toPackageListResponseDTO(
    docs: PackageResponseInput[],
  ): IPackageResponseDTO[] {
    return docs.map((doc) => PackageResponseMapper.toPackageResponseDTO(doc));
  }
}
