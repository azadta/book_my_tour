import { IUserRepository } from "../interfaces/IUserRepository.js";
import Package, { Ipackage } from "../models/Package.js";
import PackageCategory, {
  IPackageCategory,
} from "../models/PackageCategory.js";
import User, { IUser } from "../models/User.js";
import { flatten } from "../utils/flattenObject.js";

export class UserRepository implements IUserRepository {
  async create(data: Partial<IUser>): Promise<IUser> {
    const user = new User(data);
    return user.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async save(user: IUser): Promise<IUser> {
    return user.save();
  }

  async findByResetToken(token: string): Promise<IUser | null> {
    return User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });
  }
  async updateById(id: string, data: Partial<IUser>) {
    const flattenedData = flatten(data);

    return User.findByIdAndUpdate(id, { $set: flattenedData }, { new: true });
  }

  async deleteById(id: string) {
    return User.findByIdAndDelete(id);
  }
  updateProfileImage(id: string, image: string) {
    return User.findByIdAndUpdate(id, { image }, { new: true });
  }

  findAllPackageCategory(): Promise<IPackageCategory[]> {
    return PackageCategory.find();
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
}
