import { Document } from "mongoose";
export interface IBusinessAddress {
  buildingNo?: string;
  landmark?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface IVerificationDetails {
  companyName?: string;
  licenseNo?: string;
  businessAddress?: IBusinessAddress;
  submittedAt?: Date;
}

export interface IOperator extends Document {
  name: string;
  email: string;
  password: string;
  image?: string;
  mobile: number;
  isEmailVerified: boolean;
  isVerified: boolean;
  isBlocked: boolean;
  isPremium: boolean;
  otp: string | undefined;
  otpExpire: number | undefined;
  resetPasswordToken: string | undefined;
  resetPasswordExpire: number | undefined;
  createdAt: Date;
  updatedAt: Date;
  verificationDetails: IVerificationDetails;
  referralCode: string;
  referredBy: string;
  role: string;
}

export type IOperatorResponse=Omit<IOperator,'password'>