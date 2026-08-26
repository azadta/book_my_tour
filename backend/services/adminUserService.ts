import { inject, injectable } from "inversify";
import { IAdminUserService } from "../interfaces/IAdminUserService";
import { Types } from "../types/types";
import { IUser } from "../interfaces/IUser";
import type { IUserRepository } from "../interfaces/IUserRepository";
import type { IHashService } from "../interfaces/IHashService";

@injectable()
export class AdminUserService implements IAdminUserService {
  constructor(
    @inject(Types.UserRepository) private userRepository: IUserRepository,

    @inject(Types.BcryptHashService) private hashService: IHashService,
  ) {}

  async getPaginatedUsersService(skip: number, limit: number) {
    return this.userRepository.getPaginatedUsers(skip, limit);
  }


  async getSingleUserService(id: string) {
    return this.userRepository.findById(id);
  }
  async blockUserService(id: string, isBlocked: boolean) {
    return this.userRepository.updateUserBlockStatus(id, isBlocked);
  }
  async deleteUserService(id: string) {
    return await this.userRepository.deleteById(id);
  }
  async updateUserService(id: string, data: Partial<IUser>) {
    if (data.password) {
      data.password = this.hashService.hash(data.password);
    }

    return await this.userRepository.updateById(id, data);
  }
}
