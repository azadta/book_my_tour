import { IOperatorVerificationDetailsDTO } from "../operator/operatorRequestDTO";
import { AddressDTO } from "./adminRequestDTO";
export interface AdminResponseDTO {
  _id: string;
  name: string;
  email: string;
  image: string;
  mobile?: number;
  role: string;
  address?: AddressDTO;
  createdAt: string;
  updatedAt: string;
}

export interface LoginAdminResponseDTO {
  accessToken: string;
  refreshToken: string;
  adminData: AdminResponseDTO;
}

export interface IAdminOperatorResponseDTO {
  _id: string;
  name: string;
  email: string;
  image?: string;
  mobile?: number;
  isBlocked: boolean;
  isPremium: boolean;
  isVerified: boolean;
  isEmailVerified: boolean;
  referralCode?: string;
  referredBy?: string;
  verificationDetails: IOperatorVerificationDetailsDTO;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBlockOperatorResponseDTO {
  message: string;
  operator: IAdminOperatorResponseDTO;
}
