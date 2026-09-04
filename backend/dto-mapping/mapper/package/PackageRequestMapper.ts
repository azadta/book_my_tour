import { Types } from "mongoose";
import {
  ICreatePackageRequestDTO,
  IUpdatePackageRequestDTO,
} from "../../dto/package/packageRequestDTO";

export class PackageRequestMapper {
  static toCreatePackageEntity(
    body: any,
    operatorId: string,
  ): ICreatePackageRequestDTO {
    return {
      name: body?.name,
      amount: body?.amount,
      destinations: (body?.destinations || []).map(
        (id: any) => new Types.ObjectId(id),
      ),
      duration: body?.duration,
      specifications: body?.specifications,
      startDate: body?.startDate,
      ...(body?.remark && { remark: body.remark }),
      discount: body?.discount ?? 0,
      availableSlots: body?.availableSlots,
      images: body?.images || [],
      category: new Types.ObjectId(body.category),
      itinerary: body?.itinerary || [],
      operatorId: new Types.ObjectId(operatorId),
    };
  }

  static toUpdatePackageEntity(body: any): IUpdatePackageRequestDTO {
    return {
      name: body?.name,
      amount: body?.amount,
      destinations: (body?.destinations || []).map(
        (id: any) => new Types.ObjectId(id),
      ),
      duration: body?.duration,
      specifications: body?.specifications,
      startDate: body?.startDate,
      ...(body?.remark && { remark: body.remark }),
      discount: body?.discount ?? 0,
      availableSlots: body?.availableSlots,
      images: body?.images || [],
      category: new Types.ObjectId(body.category),
      itinerary: body?.itinerary || [],
    };
  }
}
