export interface IOperatorBusinessAddressDTO {
  buildingNo?: string;
  landmark?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface IOperatorVerificationDetailsDTO {
  companyName?: string;
  licenseNo?: string;
  businessAddress?: IOperatorBusinessAddressDTO;
  submittedAt?: string;
}

export interface IOperatorRegisterRequestDTO {
  name: string;
  email: string;
  password: string;
  mobile?: number;

  verificationDetails: IOperatorVerificationDetailsDTO;
}

export interface IVerifyOperatorOtpRequestDTO {
  operatorId: string;
  otp: string;
}

export interface IOperatorLoginRequestDTO {
  email: string;
  password: string;
}
export interface IOperatorResetPasswordRequestDTO {
  newPassword: string;
}

export interface IUpdateOperatorProfileRequestDTO {
  name?: string;
  mobile?: string;
  verificationDetails?: IOperatorVerificationDetailsDTO;
}

export interface IResetOperatorPasswordAuthenticatedRequestDTO {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
