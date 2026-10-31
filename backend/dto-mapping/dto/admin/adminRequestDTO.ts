import { IOperatorVerificationDetailsDTO, IOperatorVerificationDetailsInput } from "../operator/operatorRequestDTO";

export interface AddressDTO {
  houseNo?: string;
  landmark?: string;
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
  name: string;
  mobile: number;
  isVerified: boolean;
  isEmailVerified:boolean
  isPremium: boolean;
  verificationDetails: IOperatorVerificationDetailsDTO;
}
export interface IAdminUpdateOperatorinput {
  name: string;
  mobile: number|string;
  isVerified: boolean|string;
  isEmailVerified:boolean|string
  isPremium: boolean|string;
  verificationDetails: IOperatorVerificationDetailsInput;
}

export interface LoginAdminBody {
  email: string;
  password: string;
}

export interface ResetAdminPasswordAuthenticatedBody {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateAdminBody {
  name?: string;
  password?: string;
  mobile?: string;
  address?: AddressDTO;
}

export interface UpdateAdminProfileImageBody {
  image: string;
}
