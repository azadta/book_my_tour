import { IUser } from "./IUser";

export interface IAdminUserService {
  getPaginatedUsersService(skip: number, limit: number): Promise<IUser[]>;
 
  getSingleUserService(id: string): Promise<IUser | null>;
  blockUserService(id: string, isBlocked: boolean): Promise<IUser | null>;
  deleteUserService(id: string): Promise<IUser | null>;
  updateUserService(id: string, data: Partial<IUser>): Promise<IUser | null>;
}
