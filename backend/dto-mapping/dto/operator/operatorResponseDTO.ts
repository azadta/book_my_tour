import { IOperatorVerificationDetailsDTO } from "./operatorRequestDTO";

export interface IOperatorResponseDTO {
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

export interface IPaginatedOperatorResponseDTO<T> {
  data: T[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface IOperatorRegisterResponseDTO {
  operatorId: string;
  otpExpire: string;
}
