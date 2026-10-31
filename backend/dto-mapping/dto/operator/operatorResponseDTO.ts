import { ISubscriptionDetails } from "../../../interfaces/IOperator";
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
  subscriptionDetails?:ISubscriptionDetails;
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
export interface IOperatorRegisterResponseInput {
  operatorId: string;
  otpExpire: string;
}
