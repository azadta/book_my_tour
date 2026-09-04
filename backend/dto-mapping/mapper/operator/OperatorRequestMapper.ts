import {
  IOperatorBusinessAddressDTO,
  IOperatorLoginRequestDTO,
  IOperatorRegisterRequestDTO,
  IOperatorResetPasswordRequestDTO,
  IOperatorVerificationDetailsDTO,
  IResetOperatorPasswordAuthenticatedRequestDTO,
  IUpdateOperatorProfileRequestDTO,
  IVerifyOperatorOtpRequestDTO,
} from "../../dto/operator/operatorRequestDTO";

export class OperatorRequestMapper {
  static toOperatorRegisterRequestDTO(data: any): IOperatorRegisterRequestDTO {
    return {
      name: data?.name,
      email: data?.email,
      password: data?.password,
      mobile: data?.mobile,

      verificationDetails: this.verificationDetailsRequestMapper(
        data.verificationDetails,
      ),
    };
  }
  static mapAdddress(address: any): IOperatorBusinessAddressDTO {
    return {
      buildingNo: address?.buildingNo,
      landmark: address?.landmark,
      city: address?.city,
      state: address?.state,
      country: address?.country,
      postalCode: address?.postalCode,
    };
  }

  static verificationDetailsRequestMapper(
    data: any,
  ): IOperatorVerificationDetailsDTO {
    return {
      companyName: data?.companyName,
      licenseNo: data?.licenseNo,
      businessAddress: this.mapAdddress(data?.businessAddress),
      submittedAt: data?.submittedAt ?? new Date(),
    };
  }

  static toUpdateOperatorProfileDTO(
    data: any,
  ): IUpdateOperatorProfileRequestDTO {
    return {
      name: data?.name,
      mobile: data?.mobile,
      ...(data?.verificationDetails && {
        verificationDetails: this.verificationDetailsRequestMapper(
          data.verificationDetails,
        ),
      }),
    };
  }

  static toVerityOperatorOtpDTO(data: any): IVerifyOperatorOtpRequestDTO {
    return {
      operatorId: data?.operatorId,
      otp: data?.otp,
    };
  }

  static toOperatorLoginRequestDTO(data: any): IOperatorLoginRequestDTO {
    return {
      email: data?.email,
      password: data?.password,
    };
  }

  static toOperatorResetPasswordAuthenticatedRequestDTO(
    data: any,
  ): IResetOperatorPasswordAuthenticatedRequestDTO {
    return {
      oldPassword: data?.oldPassword,
      newPassword: data?.newPassword,
      confirmPassword: data?.confirmPassword,
    };
  }
}
