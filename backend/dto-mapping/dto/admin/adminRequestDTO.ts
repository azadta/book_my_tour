import { IOperatorVerificationDetailsDTO } from "../operator/operatorRequestDTO";

export interface AddressDTO {
  houseNo?: string;
  landMark?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface LoginAdminRequestDTO {
  email: string;
  password: string;
}
export interface UpdateAdminRequestDTO {
  name?: string;
  password?: string;
  mobile?: string;
  address?: AddressDTO;
}

export interface UpdateAdminProfileImageRequestDTO {
  image: string;
}

export interface ResetAdminPasswordAuthenticatedRequestDTO {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IVerifyOperatorRequestDTO {
  isVerified: boolean;
}

export interface IBlockOperatorRequestDTO {
  isBlocked: boolean;
}

export interface IGetOperatorQueryDTO {
  page?: string;
  limit?: string;
}

export interface IAdminUpdateOperatorRequestDTO {
  name?: string;
  mobile?: string;
  isVerified?: boolean;
  isEmailVerified?:boolean
  isPremium?: boolean;
  verificationDetails?: IOperatorVerificationDetailsDTO;
}
