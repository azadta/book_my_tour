import { IOperatorVerificationDetailsDTO } from "../../dto/operator/operatorRequestDTO";
import {
  IOperatorRegisterResponseDTO,
  IOperatorResponseDTO
} from "../../dto/operator/operatorResponseDTO";
import { OperatorRequestMapper } from "./OperatorRequestMapper";

export class OperatorResponseMapper {
  static verificationDetailsResponseMapper(
    data: any,
  ): IOperatorVerificationDetailsDTO {
    return {
      companyName: data.companyName,
      licenseNo: data.licenseNo,
      businessAddress: OperatorRequestMapper.mapAdddress(data.businessAddress),
      submittedAt: data.submittedAt,
    };
  }

  static toOperatorResponseDTO(entity: any): IOperatorResponseDTO {
    return {
      _id: entity._id?.toString(),
      name: entity.name,
      email: entity?.email,
      image: entity?.image,
      mobile: entity.mobile,
      isBlocked: entity.isBlocked,
      isPremium: entity.isPremium,
      isVerified: entity.isVerified,
      isEmailVerified: entity.isEmailVerified,
      referralCode: entity.referralCode,
      referredBy: entity.referredBy,
      ...(entity?.verificationDetails && {
        verificationDetails: this.verificationDetailsResponseMapper(
          entity.verificationDetails,
        ),
      }),
      role: entity.role,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
    };
  }

  static toOperatorRegisterRespsonseDTO(
    data: any,
  ): IOperatorRegisterResponseDTO {
    return {
      operatorId: data?.operatorId?.toString(),
      otpExpire: data?.otpExpire?.toString(),
    };
  }
}
