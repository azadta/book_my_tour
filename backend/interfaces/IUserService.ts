import { Ipackage } from "../models/Package";
import { IPackageCategory } from "../models/PackageCategory";
import { IUser } from "../models/User";

export interface IUserService {
  registerUser(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ userId: string; otpExpire: number | undefined }>;
  verifyUserOtp(data: { userId: string; otp: string }): Promise<void>;
  resendUserOtp(userId: string): Promise<{ otpExpire: number }>;
  loginUser(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string; userData: any }>;
  googleLogin(
    name: string,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string; user: any }>;
  forgotPasswordService(email: string): Promise<{ message: string }>;
  resetPasswordService(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }>;
  updateUserService(id: string, data: any): Promise<IUser | null>;
  deleteUserService(id: string): Promise<IUser | null>;
  updateProfileImageService(id: string, image: string): Promise<IUser | null>;
  userLogoutService(): { message: string };
  resetPasswordAuthenticatedService(
    userId: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<{ message: string }>;
  getAllCategories(): Promise<IPackageCategory[]>;
  getPaginatedPackagesService(skip: number, limit: number): Promise<Ipackage[]>;
  getTotalPackagesCount(): Promise<number>;
}
