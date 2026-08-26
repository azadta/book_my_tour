import { inject, injectable } from "inversify";
import { IAdminDashboardService } from "../interfaces/IAdminDashboardService";
import { Types } from "../types/types";
import type { IOperatorRepository } from "../interfaces/IOperatorRepository";
import type { IUserRepository } from "../interfaces/IUserRepository";

@injectable()
export class AdminDashboardService implements IAdminDashboardService {
  constructor(
    @inject(Types.OperatorRepository)
    private operatorRepository: IOperatorRepository,
    @inject(Types.UserRepository) private userRepository: IUserRepository,
  ) {}

  async getSignupCountTodayService() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const [users, operators] = await Promise.all([
      this.userRepository.countUsersByDateRange(startOfDay, endOfDay),
      this.operatorRepository.countOperatorsByDateRange(startOfDay, endOfDay),
    ]);
    return users + operators;
  }
  async getPendingOperatorsCountService() {
    return await this.operatorRepository.getPendingOperatorsCount();
  }

 
}
