import { HydratedDocument, QueryFilter, UpdateResult } from "mongoose";

export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;

  updateById(id: string, data: Partial<T>): Promise<HydratedDocument<T> | null>;
  deleteById(id: string): Promise<T | null>;
  countDocuments(): Promise<number>;
  findAll(): Promise<T[]>;
  findOne(filter: QueryFilter<T>): Promise<T | null>;
  updateMany(filter: QueryFilter<T>, data: Partial<T>): Promise<UpdateResult>
}
