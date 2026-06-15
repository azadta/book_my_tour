import { Document } from "mongoose";
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user";
  otp?: string | undefined;
  otpExpire?: number | undefined;
  isEmailVerified?: boolean;
  image?: string;
  isBlocked?: boolean;
  isPremium: boolean;
  mobile?: number;
  coinsEarned?: number;
  referralCode?: string;
  referredBy?: string;
  address: object;
  resetPasswordToken: string | undefined;
  resetPasswordExpire: number | undefined;
}

export type IUserResponse=Omit<IUser,'password'>