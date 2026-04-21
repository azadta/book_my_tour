import { IDestination } from "../models/Destination.js";
import { IOperator } from "../models/Operator.js";
import { Ipackage } from "../models/Package.js";
import { IPackageCategory } from "../models/PackageCategory.js";

export interface IOperatorRepository {
  create(data: Partial<IOperator>): Promise<IOperator>;
  findByEmail(email: string): Promise<IOperator | null>;
  findById(id: string): Promise<IOperator | null>;
  save(operator: IOperator): Promise<IOperator>;
  updateById(
    id: string,
    operatorData: Partial<IOperator>,
  ): Promise<IOperator | null>;
  deleteById(id: string): Promise<IOperator | null>;
  findByResetToken(token: string): Promise<IOperator | null>;
  updateOperatorProfileImage(
    id: string,
    image: string,
  ): Promise<IOperator | null>;
  createPackage(data: Partial<Ipackage>): Promise<Ipackage>;
  findAllPackages(skip: number, limit: number): Promise<Ipackage[]>;
  countAllPackages(): Promise<number>;
  getPackageById(id: string): Promise<Ipackage | null>;
  updatePackage(id: string, data: Partial<Ipackage>): Promise<Ipackage | null>;
  deletePackage(id: string): Promise<Ipackage | null>;
  findAllPackageCategory(): Promise<IPackageCategory[]>;
  findAllDestinations(): Promise<IDestination[]>;
  getPackageByName(name: string): Promise<Ipackage | null>;
}
