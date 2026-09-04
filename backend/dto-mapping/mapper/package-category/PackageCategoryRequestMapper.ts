import { ICreateCategoryRequestDTO } from "../../dto/package-category/packageCategoryRequestDTO";

export class PackageCategoryRequestMapper {
  static toCreatePackageCategory(data: any): ICreateCategoryRequestDTO {
    return {
      name: data?.name?.trim() ?? "",
      description: data?.description?.trim(),
    };
  }
}
