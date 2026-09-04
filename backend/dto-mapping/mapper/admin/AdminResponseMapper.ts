import { HydratedDocument } from "mongoose";
import { IAdmin } from "../../../interfaces/IAdmin";
import {
  AdminResponseDTO,
  IAdminOperatorResponseDTO,
} from "../../dto/admin/adminResponseDTO";
import { IOperator } from "../../../interfaces/IOperator";

export class AdminResponseMapper {
  static toAdminResponseDTO(admin: any): AdminResponseDTO | null {
    if (!admin) return null;
    const rawAdmin = admin.toObject ? admin.toObject() : admin;
    return {
      _id: rawAdmin._id?.toString(),
      name: rawAdmin.name,
      email: rawAdmin.email,
      image: rawAdmin?.image,
      mobile: rawAdmin?.mobile,
      role: rawAdmin.role,
      ...(rawAdmin?.address !== undefined && {
        address: {
          houseNo: rawAdmin.address?.houseNo,
          landMark: rawAdmin.address?.landMark,
          city: rawAdmin.address?.landMark,
          state: rawAdmin.address?.state,
          country: rawAdmin.address?.country,
          postalCode: rawAdmin.address?.postalCode,
        },
      }),
      createdAt: rawAdmin.createdAt?.toISOString(),
      updatedAt: rawAdmin.updateAt?.toISOString(),
    };
  }

  static toAdminOperatorResponseDTO(
    entity: IOperator,
  ): IAdminOperatorResponseDTO {
    return {
      _id: entity._id.toString(),
      name: entity.name,
      email: entity?.email,
      ...(entity?.image && { image: entity.image }),

      mobile: entity.mobile,
      isBlocked: entity.isBlocked,
      isPremium: entity.isPremium,
      isVerified: entity.isVerified,
      isEmailVerified: entity.isEmailVerified,
      referralCode: entity.referralCode,
      referredBy: entity.referredBy,
      ...(entity.verificationDetails && {
        verificationDetails: {
          ...(entity.verificationDetails.companyName && {
            companyName: entity.verificationDetails.companyName,
          }),
          ...(entity.verificationDetails.licenseNo && {
            licenseNo: entity.verificationDetails.licenseNo,
          }),
          ...(entity.verificationDetails?.businessAddress && {
            businessAddress: {
              ...(entity.verificationDetails.businessAddress.buildingNo && {
                buildingNo:
                  entity.verificationDetails.businessAddress.buildingNo,
              }),
              ...(entity.verificationDetails.businessAddress.city && {
                city: entity.verificationDetails.businessAddress?.city,
              }),
              ...(entity.verificationDetails.businessAddress.country && {
                country: entity.verificationDetails.businessAddress?.country,
              }),
              ...(entity.verificationDetails.businessAddress.landmark && {
                landmark: entity.verificationDetails.businessAddress?.landmark,
              }),
              ...(entity.verificationDetails.businessAddress.postalCode && {
                postalCode:
                  entity.verificationDetails.businessAddress?.postalCode,
              }),
              ...(entity.verificationDetails.businessAddress.state && {
                state: entity.verificationDetails.businessAddress?.state,
              }),
            },
          }),
          ...(entity.verificationDetails.submittedAt && {
            submittedAt: entity.verificationDetails.submittedAt.toISOString(),
          }),
        },
      }),
      role: entity.role,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  static toAdminOperatorListResponseDTO(
    entities: IOperator[],
  ): IAdminOperatorResponseDTO[] {
    return entities.map((entity) => this.toAdminOperatorResponseDTO(entity));
  }
}
