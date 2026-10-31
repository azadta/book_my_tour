import { IOperator, IVerificationDetails } from "../../../interfaces/IOperator";
import { IOperatorVerificationDetailsDTO } from "../../dto/operator/operatorRequestDTO";
import {
  IOperatorRegisterResponseDTO,
  IOperatorRegisterResponseInput,
  IOperatorResponseDTO,
} from "../../dto/operator/operatorResponseDTO";
import { OperatorRequestMapper } from "./OperatorRequestMapper";

export class OperatorResponseMapper {
  static verificationDetailsResponseMapper(
    data: IVerificationDetails,
  ): IOperatorVerificationDetailsDTO {
    return {
      companyName: data.companyName,
      licenseNo: data.licenseNo,
      businessAddress: OperatorRequestMapper.mapAdddress(data.businessAddress),
      ...(data?.submittedAt && { submittedAt: data.submittedAt }),
    };
  }

  static toOperatorResponseDTO(entity: IOperator): IOperatorResponseDTO {
    return {
      _id: entity._id?.toString(),
      name: entity.name,
      email: entity?.email,
      ...(entity.image && { image: entity?.image }),
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
      ...(entity?.subscriptionDetails && {
        subscriptionDetails: entity.subscriptionDetails,
      }),
      role: entity.role,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
    };
  }

  static toOperatorRegisterRespsonseDTO(
    data: IOperatorRegisterResponseInput,
  ): IOperatorRegisterResponseDTO {
    return {
      operatorId: data?.operatorId?.toString(),
      otpExpire: data?.otpExpire?.toString(),
    };
  }
}
