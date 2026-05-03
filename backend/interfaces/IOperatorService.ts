import { IDestination } from "../models/Destination.js";
import { IOperator } from "../models/Operator.js";
import { Ipackage } from "../models/Package.js";
import { IPackageCategory } from "../models/PackageCategory.js";

export interface IOperatorService {
  operatorRegisterService(data: any): Promise<{
    operatorId: string;
    otpExpire: number | undefined;
  }>;
  operatorVerifyOtpService(operatorId: string, otp: string): Promise<void>;
  operatorResendOtpService(operatorId: string): Promise<{
    otpExpire: number;
  }>;
  operatorLoginService(
    email: string,
    password: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    operatorData: any;
  }>;
  operatorForgotPasswordService(email: string): Promise<{
    message: string;
  }>;
  operatorResetPasswordService(
    token: string,
    newPassword: string,
  ): Promise<{
    message: string;
  }>;
  updateOperatorService(id: string, data: any): Promise<IOperator | null>;
  updateOperatorProfileImageService(
    id: string,
    image: string,
  ): Promise<IOperator | null>;
  operatorLogoutService(): {
    message: string;
  };
  createPackageService(data: Partial<Ipackage>): Promise<Ipackage>;
  getSinglePackageService(id: string): Promise<Ipackage | null>;
  updatePackageService(
    id: string,
    data: Partial<Ipackage>,
  ): Promise<Ipackage | null>;
  deletePackageService(id: string): Promise<Ipackage | null>;
  getPaginatedPackagesService(skip: number, limit: number): Promise<Ipackage[]>;
  getTotalPackagesCount(): Promise<number>;
  resetPasswordAuthenticatedService(
    operatorId: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<{
    message: string;
  }>;
  getAllCategories(): Promise<IPackageCategory[]>;
  getAllDestinationsServise(): Promise<IDestination[]>;
  getMyPackagesCountService(operatorId: string): Promise<number>;
}
