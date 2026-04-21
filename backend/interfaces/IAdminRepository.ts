import { IAdmin } from "../models/Admin.js";
import { IDestination } from "../models/Destination.js";
import { IOperator } from "../models/Operator.js";
import { Ipackage } from "../models/Package.js";
import { IPackageCategory } from "../models/PackageCategory.js";
import { IUser } from "../models/User.js";

export interface IAdminRepository {
  findByEmail(email: string): Promise<IAdmin | null>;
  findById(id: string): Promise<IAdmin | null>;
  save(admin: IAdmin): Promise<IAdmin>;
  updateById(id: string, data: Partial<IAdmin>): Promise<IAdmin | null>;
  updateProfieImage(id: string, image: string): Promise<IAdmin | null>;
  getPendingOperator(): Promise<IOperator[]>;
  updateOperatorStatus(
    id: string,
    isVerified: boolean,
  ): Promise<IOperator | null>;
  deleteOperatorById(id: string): Promise<IOperator | null>;
  getPaginatedOperators(
    skip: number,
    limit: number,
  ): Promise<IOperator[] | null>;
  countAllOperators(): Promise<number>;
  updateOperatorBlockStatus(
    id: string,
    isBlocked: boolean,
  ): Promise<IOperator | null>;
  deleteUserById(id: string): Promise<IUser | null>;
  getPaginatedUsers(skip: number, limit: number): Promise<IUser[] | null>;
  countAllUsers(): Promise<number>;
  updateUserBlockStatus(id: string, isBlocked: boolean): Promise<IUser | null>;
  createPackgeCategory(
    data: Partial<IPackageCategory>,
  ): Promise<IPackageCategory>;
  findPackageCategoryByName(name: string): Promise<IPackageCategory | null>;
  findAllPackageCategory(): Promise<IPackageCategory[]>;
  deletePackageCategoryById(id: string): Promise<IPackageCategory | null>;
  createDestination(data: Partial<IDestination>): Promise<IDestination>;
  findDestinationByName(name: string): Promise<IDestination | null>;
  findAllDestinations(): Promise<IDestination[]>;
  deleteDestinationById(id: string): Promise<IDestination | null>;
  findDestinationById(id: string): Promise<IDestination | null>;
  findUserById(id: string): Promise<IUser | null>;
  findOperatorById(id: string): Promise<IOperator | null>;
  updateUserById(id: string, data: Partial<IUser>): Promise<IUser | null>;
  findAllPackages(skip: number, limit: number): Promise<Ipackage[]>;
  countAllPackages(): Promise<number>;
  updateOperatorById(
    id: string,
    operatorData: Partial<IOperator>,
  ): Promise<IOperator | null>;
}
