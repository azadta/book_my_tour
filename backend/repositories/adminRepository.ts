import { IAdminRepository } from "../interfaces/IAdminRepository";
import Admin, { IAdmin } from "../models/Admin";
import Destination, { IDestination } from "../models/Destination";
import Operator, { IOperator } from "../models/Operator";
import Package, { Ipackage } from "../models/Package";
import PackageCategory, {
  IPackageCategory,
} from "../models/PackageCategory";
import User, { IUser } from "../models/User";
import { flattenObjects } from "../utils/flattenObject";

export class AdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<IAdmin | null> {
    return Admin.findOne({ email });
  }

  async findById(id: string): Promise<IAdmin | null> {
    return Admin.findById(id);
  }

  async save(admin: IAdmin): Promise<IAdmin> {
    return admin.save();
  }

  async updateById(id: string, data: Partial<IAdmin>): Promise<IAdmin | null> {
    return Admin.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  async updateProfieImage(id: string, image: string): Promise<IAdmin | null> {
    return Admin.findByIdAndUpdate(id, { image }, { new: true });
  }

  getPendingOperator(): Promise<IOperator[]> {
    return Operator.find({ isVerified: false });
  }

  updateOperatorStatus(
    id: string,
    isVerified: boolean,
  ): Promise<IOperator | null> {
    return Operator.findByIdAndUpdate(id, { isVerified }, { new: true });
  }

  async deleteOperatorById(id: string) {
    return Operator.findByIdAndDelete(id);
  }

  getPaginatedOperators(skip: number, limit: number) {
    return Operator.find().skip(skip).limit(limit).select("-password");
  }
  countAllOperators(): Promise<number> {
    return Operator.countDocuments();
  }
  updateOperatorBlockStatus(id: string, isBlocked: boolean) {
    return Operator.findByIdAndUpdate(id, { isBlocked }, { new: true });
  }

  async deleteUserById(id: string): Promise<IUser | null> {
    return User.findByIdAndDelete(id);
  }

  getPaginatedUsers(skip: number, limit: number) {
    return User.find().skip(skip).limit(limit).select("-password");
  }
  countAllUsers(): Promise<number> {
    return User.countDocuments();
  }
  updateUserBlockStatus(id: string, isBlocked: boolean) {
    return User.findByIdAndUpdate(id, { isBlocked }, { new: true });
  }

  async createPackgeCategory(
    data: Partial<IPackageCategory>,
  ): Promise<IPackageCategory> {
    const category = new PackageCategory(data);
    return await category.save();
  }
  findPackageCategoryByName(name: string): Promise<IPackageCategory | null> {
    return PackageCategory.findOne({ name });
  }
  findAllPackageCategory(): Promise<IPackageCategory[]> {
    return PackageCategory.find();
  }
  deletePackageCategoryById(id: string): Promise<IPackageCategory | null> {
    return PackageCategory.findByIdAndDelete(id);
  }
  async createDestination(data: Partial<IDestination>): Promise<IDestination> {
    const destination = new Destination(data);
    return destination.save();
  }
  findDestinationByName(name: string) {
    return Destination.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
  }
  findAllDestinations(): Promise<IDestination[]> {
    return Destination.find();
  }
  deleteDestinationById(id: string): Promise<IDestination | null> {
    return Destination.findByIdAndDelete(id);
  }
  findDestinationById(id: string): Promise<IDestination | null> {
    return Destination.findById(id);
  }

  async findUserById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async findOperatorById(id: string): Promise<IOperator | null> {
    return Operator.findById(id).select('-password')
  }
  async updateUserById(id: string, data: Partial<IUser>) {
    const flattenedData = flattenObjects(data);

    return User.findByIdAndUpdate(id, { $set: flattenedData }, { new: true });
  }

  findAllPackages(skip: number, limit: number): Promise<Ipackage[]> {
    return Package.find()
      .skip(skip)
      .limit(limit)
      .populate("destinations category operatorId");
  }

  countAllPackages(): Promise<number> {
    return Package.countDocuments();
  }

  async updateOperatorById(
    id: string,
    operatorData: Partial<IOperator>,
  ): Promise<IOperator | null> {
    return Operator.findByIdAndUpdate(
      id,
      { $set: operatorData },
      { new: true },
    );
  }

  async getSignupCountToday(start: Date, end: Date): Promise<number> {
    const [operators, users] = await Promise.all([
      User.countDocuments({
        createdAt: {
          $gte: start,
          $lte: end,
        },
      }),
      Operator.countDocuments({
        createdAt: {
          $gte: start,
          $lte: end,
        },
      }),
    ]);

    return operators + users;
  }

  getPendingOperatorsCount(): Promise<number> {
    return Operator.countDocuments({ isVerified: false });
  }
}
