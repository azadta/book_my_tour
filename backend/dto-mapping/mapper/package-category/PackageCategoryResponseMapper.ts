import { Types } from "mongoose";
import { IPackageCategory } from "../../../models/PackageCategory";
import {
  ICategoryResponseDTO,
  ICategorySummaryDTO,
} from "../../dto/package-category/packageCategoryResponseDTO";
import { ICategorySummaryInput } from "../../dto/package/packageRequestDTO";

export class CategoryResponseMapper {
  static toCategoryResponseDTO(doc: IPackageCategory): ICategoryResponseDTO {
    if (!doc) return {} as ICategoryResponseDTO;
    const raw = doc.toObject ? doc.toObject() : doc;
    return {
      _id: raw?._id?.toString() ?? "",
      name: raw?.name ?? "",
      description: raw?.description,
      createdAt: raw?.createAt,
    };
  }

  static toCategoryListResponseDTO(
    docs: IPackageCategory[],
  ): ICategoryResponseDTO[] {
    if (!Array.isArray(docs)) return [];
    return docs.map((doc) => this.toCategoryResponseDTO(doc));
  }

  static toCategorySummaryDTO(
    category: ICategorySummaryInput | Types.ObjectId,
  ): ICategorySummaryDTO | string {
    if (!category) return "";
    if (category instanceof Types.ObjectId) return category.toString();

    return {
      _id: category?._id?.toString() ?? "",
      name: category.name || "",
    };
  }
}
