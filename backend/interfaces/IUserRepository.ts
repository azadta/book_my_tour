import { IUser } from "../models/User";
import { IBaseRepository } from "./IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;

  findByResetToken(token: string): Promise<IUser | null>;

  updateProfileImage(id: string, image: string): Promise<IUser | null>;

  updateUserBlockStatus(id: string, isBlocked: boolean): Promise<IUser | null>;

  getPaginatedUsers(skip: number, limit: number): Promise<IUser[]>;

  countUsersByDateRange(start: Date, end: Date): Promise<number>;
  save(user: IUser): Promise<IUser>;
}
