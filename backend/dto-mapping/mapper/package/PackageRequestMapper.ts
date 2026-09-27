import { Types } from "mongoose";
import {
  ICreatePackageRequestDTO,
  IUpdatePackageRequestDTO,
} from "../../dto/package/packageRequestDTO";

export class PackageRequestMapper {
  static mapChildPricing(body: any) {
    const enabled =
      body?.["childPricing.enabled"] === true ||
      body?.["childPricing.enabled"] === "true";
    if (!enabled) {
      return {
        enabled: false,
        minAge: undefined,
        maxAge: undefined,
        percentage: undefined,
      };
    }
    return {
      enabled: true,
      minAge: Number(body?.["childPricing.minAge"]),
      maxAge: Number(body?.["childPricing.maxAge"]),
      percentage: Number(body?.["childPricing.percentage"]),
    };
  }
  static toCreatePackageEntity(
    body: any,
    operatorId: string,
  ): ICreatePackageRequestDTO {
    return {
      name: body?.name,
      amount: body?.amount,
      childPricing: this.mapChildPricing(body),
      destinations: (body?.destinations || []).map(
        (id: any) => new Types.ObjectId(id),
      ),
      duration: {
        day: Number(body?.["duration.day"]),
        night: Number(body?.["duration.night"]),
      },
      specifications: body?.specifications,
      startDate: body?.startDate,
      startPoint: body?.startPoint,
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
      childPricing: this.mapChildPricing(body),
      destinations: (body?.destinations || []).map(
        (id: any) => new Types.ObjectId(id),
      ),
      duration: {
        day: Number(body?.["duration.day"]),
        night: Number(body?.["duration.night"]),
      },
      specifications: body?.specifications,
      startDate: body?.startDate,
      startPoint: body?.startPoint,
      ...(body?.remark && { remark: body.remark }),
      discount: body?.discount ?? 0,
      availableSlots: body?.availableSlots,
      images: body?.images || [],
      category: new Types.ObjectId(body.category),
      itinerary: body?.itinerary || [],
    };
  }
}
