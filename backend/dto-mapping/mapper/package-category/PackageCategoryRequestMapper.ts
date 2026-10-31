import { CreateCategoryInput, ICreateCategoryRequestDTO } from "../../dto/package-category/packageCategoryRequestDTO";

export class PackageCategoryRequestMapper {
  static toCreatePackageCategory(data: CreateCategoryInput): ICreateCategoryRequestDTO {
    return {
      name: data?.name?.trim() ?? "",
      ...(data.description&&{}),
    };
  }
}
