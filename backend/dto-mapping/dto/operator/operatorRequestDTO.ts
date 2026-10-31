export interface IOperatorBusinessAddressDTO {
  buildingNo: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}
export interface IOperatorBusinessAddressInput {
  buildingNo: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface IOperatorVerificationDetailsDTO {
  companyName: string;
  licenseNo: string;
  businessAddress: IOperatorBusinessAddressDTO;
  submittedAt?: Date;
}
export interface IOperatorVerificationDetailsInput {
  companyName: string;
  licenseNo: string;
  businessAddress: IOperatorBusinessAddressInput;
}

export interface IOperatorRegisterRequestDTO {
  name: string;
  email: string;
  password: string;
  mobile: number;

  verificationDetails: IOperatorVerificationDetailsDTO;
}
export interface IOperatorRegisterInput {
  name: string;
  email: string;
  password: string;
  mobile: string;

  verificationDetails: IOperatorVerificationDetailsInput;
}

export interface IVerifyOperatorOtpRequestDTO {
  operatorId: string;
  otp: string;
}
export interface IVerifyOperatorOtpInput {
  operatorId: string;
  otp: string;
}

export interface IOperatorLoginRequestDTO {
  email: string;
  password: string;
}
export interface IOperatorLoginInput {
  email: string;
  password: string;
}
export interface IOperatorResetPasswordRequestDTO {
  newPassword: string;
}

export interface IUpdateOperatorProfileRequestDTO {
  name?: string;
  mobile?: number;
  verificationDetails?: IOperatorVerificationDetailsDTO;
}

export interface IResetOperatorPasswordAuthenticatedRequestDTO {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export interface IResetOperatorPasswordAuthenticatedInput{
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IUpdateOperatorProfileInput {
  name: string;
  mobile: number | string;
  verificationDetails: IOperatorVerificationDetailsInput;
}
