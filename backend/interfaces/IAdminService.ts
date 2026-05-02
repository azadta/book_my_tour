import { IAdmin } from "../models/Admin.js";
import { IDestination } from "../models/Destination.js";
import { IOperator } from "../models/Operator.js";
import { Ipackage } from "../models/Package.js";
import { IPackageCategory } from "../models/PackageCategory.js";
import { IUser } from "../models/User.js";

export interface IAdminService {
  loginAdminService(
    email: string,
    password: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    adminData: any;
  }>;
  updateAdminService(id: string, data: any): Promise<IAdmin | null>;
  getOperatorVerificationRequestsService(): Promise<IOperator[]>;
  verifyOperatorService(
    id: string,
    isVerified: boolean,
  ): Promise<{
    message: string;
  }>;
  getPaginatedOperatorsService(
    skip: number,
    limit: number,
  ): Promise<IOperator[] | null>;
  getTotalOperatorsCount(): Promise<number>;
  getSingleOperatorService(id: string): Promise<IOperator | null>;
  blockOperatorService(
    id: string,
    isBlocked: boolean,
  ): Promise<IOperator | null>;
  deleteOperatorService(id: string): Promise<IOperator | null>;
  getPaginatedUsersService(
    skip: number,
    limit: number,
  ): Promise<IUser[] | null>;
  getTotalUsersCount(): Promise<number>;
  getSingleUserService(id: string): Promise<IUser | null>;
  blockUserService(id: string, isBlocked: boolean): Promise<IUser | null>;
  createCategoryService(
    data: Partial<IPackageCategory>,
  ): Promise<IPackageCategory>;
  getAllCategories(): Promise<IPackageCategory[]>;
  createDestinationService(
    data: Partial<IDestination> & {
      latitude?: number;
      longitude?: number;
    },
  ): Promise<IDestination>;
  getAllDestinationsServise(): Promise<IDestination[]>;
  getDestinationByIdService(id: string): Promise<IDestination>;
  deleteDestinationByIdService(id: string): Promise<void>;
  resetPasswordAuthenticatedService(
    adminId: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<{
    message: string;
  }>;
  updateUserService(id: string, data: any): Promise<IUser | null>;
  getPaginatedPackagesService(skip: number, limit: number): Promise<Ipackage[]>;
  getTotalPackagesCount(): Promise<number>;
  updateOperatorService(id: string, data: any): Promise<IOperator | null>;
  updateProfieImageService(id: string, image: string): Promise<IAdmin | null>;
  deleteUserService(id: string): Promise<IUser | null>;
  getSignupCountTodayService(): Promise<number>;
  getPendingOperatorsCountService(): Promise<number>;
}
