import { Model } from "mongoose";
import { IBaseRepository } from "../interfaces/IBaseRepository";
import { flattenObjects } from "../utils/flattenObject";
import { HydratedDocument,QueryFilter } from "mongoose";

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  protected model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    const instance = new this.model(data);
    return instance.save() as Promise<T>;
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async updateById(id: string, data: Partial<T>): Promise<HydratedDocument<T> | null> {
    const flattenedData = flattenObjects(data);

    return this.model.findByIdAndUpdate(
      id,
      { $set: flattenedData },
      { new: true },
    );
  }

  async deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id);
  }

  countDocuments(): Promise<number> {
    return this.model.countDocuments();
  }

  findAll(): Promise<T[]> {
    return this.model.find();
  }

  async findOne(filter:QueryFilter<T>):Promise<T|null>{
    return this.model.findOne(filter)
  }
}
