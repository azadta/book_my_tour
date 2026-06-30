import { Ipackage } from "../models/Package";
import { IBaseRepository } from "./IBaseRepository";

export interface IPackageRepository extends IBaseRepository<Ipackage> {
  findPaginatedPackages(skip: number, limit: number): Promise<Ipackage[]>;
  countPackagesByOperatorId(operatorId: string): Promise<number>;
  getPackageByName(name: string): Promise<Ipackage | null>;
  getPackageById(id: string): Promise<Ipackage | null>;
  save(item: Ipackage): Promise<Ipackage>;
  findAllPackages(): Promise<Ipackage[]>
}
