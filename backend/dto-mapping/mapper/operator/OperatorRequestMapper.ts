import {
  IOperatorBusinessAddressDTO,
  IOperatorBusinessAddressInput,
  IOperatorLoginInput,
  IOperatorLoginRequestDTO,
  IOperatorRegisterInput,
  IOperatorRegisterRequestDTO,
  IOperatorResetPasswordRequestDTO,
  IOperatorVerificationDetailsDTO,
  IOperatorVerificationDetailsInput,
  IResetOperatorPasswordAuthenticatedInput,
  IResetOperatorPasswordAuthenticatedRequestDTO,
  IUpdateOperatorProfileInput,
  IUpdateOperatorProfileRequestDTO,
  IVerifyOperatorOtpInput,
  IVerifyOperatorOtpRequestDTO,
} from "../../dto/operator/operatorRequestDTO";

export class OperatorRequestMapper {
  static toOperatorRegisterRequestDTO(
    data: IOperatorRegisterInput,
  ): IOperatorRegisterRequestDTO {
    return {
      name: data.name,
      email: data.email,
      password: data.password,
      mobile: Number(data.mobile),

      verificationDetails: this.verificationDetailsRequestMapper(
        data.verificationDetails,
      ),
    };
  }
  static mapAdddress(
    address: IOperatorBusinessAddressInput,
  ): IOperatorBusinessAddressDTO {
    return {
      buildingNo: address.buildingNo,
      ...(address.landmark && { landmark: address.landmark }),
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
    };
  }

  static verificationDetailsRequestMapper(
    data: IOperatorVerificationDetailsInput,
  ): IOperatorVerificationDetailsDTO {
    return {
      companyName: data.companyName,
      licenseNo: data.licenseNo,
      businessAddress: this.mapAdddress(data.businessAddress),
      submittedAt: new Date(),
    };
  }

  static toUpdateOperatorProfileDTO(
    data: IUpdateOperatorProfileInput,
  ): IUpdateOperatorProfileRequestDTO {
    return {
      name: data.name,
      mobile: Number(data.mobile),
      verificationDetails: this.verificationDetailsRequestMapper(
        data.verificationDetails,
      ),
    };
  }

  static toVerityOperatorOtpDTO(
    data: IVerifyOperatorOtpInput,
  ): IVerifyOperatorOtpRequestDTO {
    return {
      operatorId: data?.operatorId,
      otp: data?.otp,
    };
  }

  static toOperatorLoginRequestDTO(
    data: IOperatorLoginInput,
  ): IOperatorLoginRequestDTO {
    return {
      email: data?.email,
      password: data?.password,
    };
  }

  static toOperatorResetPasswordAuthenticatedRequestDTO(
    data: IResetOperatorPasswordAuthenticatedInput,
  ): IResetOperatorPasswordAuthenticatedRequestDTO {
    return {
      oldPassword: data?.oldPassword,
      newPassword: data?.newPassword,
      confirmPassword: data?.confirmPassword,
    };
  }
}
