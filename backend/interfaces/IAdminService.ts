import { HydratedDocument } from "mongoose";
import { IDestination } from "../models/Destination";

import { Ipackage } from "../models/Package";
import { IPackageCategory } from "../models/PackageCategory";

import { IAdmin, IAdminResponse } from "./IAdmin";
import { IOperator } from "./IOperator";
import { IUser } from "./IUser";

export interface IAdminService {
  loginAdminService(
    email: string,
    password: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    adminData: IAdminResponse;
  }>;
  updateAdminService(
    id: string,
    data: Partial<IAdmin>,
  ): Promise<HydratedDocument<IAdmin> | null>;
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
  updateUserService(id: string, data: Partial<IUser>): Promise<IUser | null>;
  getPaginatedPackagesService(skip: number, limit: number): Promise<Ipackage[]>;
  getTotalPackagesCount(): Promise<number>;
  updateOperatorService(
    id: string,
    data: Partial<IOperator>,
  ): Promise<IOperator | null>;
  updateProfieImageService(
    id: string,
    image: string,
  ): Promise<HydratedDocument<IAdmin> | null>;
  deleteUserService(id: string): Promise<IUser | null>;
  getSignupCountTodayService(): Promise<number>;
  getPendingOperatorsCountService(): Promise<number>;
}
