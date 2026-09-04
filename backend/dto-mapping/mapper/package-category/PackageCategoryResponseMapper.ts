import {
  ICategoryResponseDTO,
  ICategorySummaryDTO,
} from "../../dto/package-category/packageCategoryResponseDTO";

export class CategoryResponseMapper {
  static toCategoryResponseDTO(doc: any): ICategoryResponseDTO {
    if (!doc) return {} as ICategoryResponseDTO;
    const raw = doc.toObject ? doc.toObject() : doc;
    return {
      _id: raw?._id?.toString() ?? "",
      name: raw?.name ?? "",
      description: raw?.description,
      createdAt: raw?.createAt,
    };
  }

  static toCategoryListResponseDTO(docs: any): ICategoryResponseDTO[] {
    if (!Array.isArray(docs)) return [];
    return docs.map((doc) => this.toCategoryResponseDTO(doc));
  }

  static toCategorySummaryDTO(category: any): ICategorySummaryDTO | string {
    if (!category) return "";
    if (typeof category === "object" && category.name !== undefined) {
      return {
        _id: category?._id?.toString() ?? "",
        name: category.name || "",
      };
    }
    return category?.toString();
  }
}
