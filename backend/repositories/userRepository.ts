import { injectable } from "inversify";
import { IUserRepository } from "../interfaces/IUserRepository";
import User from "../models/User";
import { BaseRepository } from "./baseRepository";
import { IUser } from "../interfaces/IUser";

@injectable()
export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(User);
  }
  async findByResetToken(token: string): Promise<IUser | null> {
    return User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });
  }
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  updateProfileImage(id: string, image: string) {
    return User.findByIdAndUpdate(id, { image }, { new: true });
  }
  async save(user: IUser): Promise<IUser> {
    return user.save();
  }

  updateUserBlockStatus(id: string, isBlocked: boolean): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, { isBlocked }, { new: true });
  }

  async getPaginatedUsers(skip: number, limit: number): Promise<IUser[]> {
    return User.find().skip(skip).limit(limit).select("-password");
  }

  async countUsersByDateRange(start: Date, end: Date): Promise<number> {
    return User.countDocuments({ createdAt: { $gte: start, $lte: end } });
  }


}
