import { Ipackage } from "../models/Package.js";
import { IPackageCategory } from "../models/PackageCategory.js";
import { IUser } from "../models/User.js";

export interface IUserRepository {
  create(data: Partial<IUser>): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  findByResetToken(token: string): Promise<IUser | null>;
  updateById(id: string, data: Partial<IUser>): Promise<IUser | null>;
  deleteById(id: string): Promise<IUser | null>;
  save(user: IUser): Promise<IUser>;
  updateProfileImage(id: string, image: string): Promise<IUser | null>;
  findAllPackageCategory(): Promise<IPackageCategory[]>;
  findAllPackages(skip: number, limit: number): Promise<Ipackage[]>;
  countAllPackages(): Promise<number> 
}
