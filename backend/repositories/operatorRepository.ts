import { IOperatorRepository } from "../interfaces/IOperatorRepository.js";
import Destination, { IDestination } from "../models/Destination.js";
import Operator, { IOperator } from "../models/Operator.js";
import Package, { Ipackage } from "../models/Package.js";
import PackageCategory, {
  IPackageCategory,
} from "../models/PackageCategory.js";

export class OperatorRepository implements IOperatorRepository {
  async create(data: Partial<IOperator>): Promise<IOperator> {
    const operator = new Operator(data);
    return await operator.save();
  }
  async findByEmail(email: string): Promise<IOperator | null> {
    return Operator.findOne({ email });
  }
  async findById(id: string): Promise<IOperator | null> {
    return Operator.findById(id);
  }
  async save(operator: IOperator): Promise<IOperator> {
    return operator.save();
  }
  async updateById(
    id: string,
    operatorData: Partial<IOperator>,
  ): Promise<IOperator | null> {
    return Operator.findByIdAndUpdate(
      id,
      { $set: operatorData },
      { new: true },
    );
  }
  async deleteById(id: string): Promise<IOperator | null> {
    return Operator.findByIdAndDelete(id);
  }
  async findByResetToken(token: string): Promise<IOperator | null> {
    return Operator.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });
  }
  updateOperatorProfileImage(
    id: string,
    image: string,
  ): Promise<IOperator | null> {
    return Operator.findByIdAndUpdate(id, { image }, { new: true });
  }

  async createPackage(data: Partial<Ipackage>): Promise<Ipackage> {
    return await Package.create(data);
  }
  async findAllPackages(skip: number, limit: number): Promise<Ipackage[]> {
    return Package.find()
      .skip(skip)
      .limit(limit)
      .populate("destinations category operatorId");
  }
  countAllPackages(): Promise<number> {
    return Package.countDocuments();
  }
  async getPackageById(id: string): Promise<Ipackage | null> {
    return await Package.findById(id).populate("destinations category");
  }
  async getPackageByName(name: string): Promise<Ipackage | null> {
    return await Package.findOne({ name: { $regex: name, $options: "i" } });
  }
  async updatePackage(
    id: string,
    data: Partial<Ipackage>,
  ): Promise<Ipackage | null> {
    return await Package.findByIdAndUpdate(id, data, { new: true });
  }

  async deletePackage(id: string): Promise<Ipackage | null> {
    return await Package.findByIdAndDelete(id);
  }

  findAllPackageCategory(): Promise<IPackageCategory[]> {
    return PackageCategory.find();
  }
  findAllDestinations(): Promise<IDestination[]> {
    return Destination.find();
  }
  async countPackagesByOperatorId(operatorId:string):Promise<number>{
    return Package.countDocuments({operatorId})
  }
}
