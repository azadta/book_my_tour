import { inject, injectable } from "inversify";
import { IDashboardService } from "../interfaces/IDashboardService";
import type { IOperatorRepository } from "../interfaces/IOperatorRepository";
import type { IUserRepository } from "../interfaces/IUserRepository";
import { Types } from "../types/types";
import type { IBookingRepository } from "../interfaces/IBookingRepository";
import type { IPackageRepository } from "../interfaces/IPackageRepository";
import type { IUserService } from "../interfaces/IUserService";
import type { IOperatorService } from "../interfaces/IOperatorService";

@injectable()
export class DashboardService implements IDashboardService {
  constructor(
    @inject(Types.UserRepository)
    private userRepository: IUserRepository,
    @inject(Types.OperatorRepository)
    private operatorRepository: IOperatorRepository,
    @inject(Types.BookingRepository)
    private bookingRepository: IBookingRepository,
    @inject(Types.PackageRepository)
    private packageRepository: IPackageRepository,
    @inject(Types.UserService)
    private userService: IUserService,
    @inject(Types.OperatorService)
    private operatorService: IOperatorService,
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

  async getOperatorDashboardStatsService(operatorId: string) {
    const [stats, packagesCount] = await Promise.all([
      this.bookingRepository.getOperatorStats(operatorId),
      this.packageRepository.countPackagesByOperatorId(operatorId),
    ]);
    return { ...stats, packagesCount };
  }

  async getTotalUsersCountService() {
    return await this.userService.getTotalUsersCount();
  }
  async getTotalOperatorsCountService() {
    return await this.operatorService.getTotalOperatorsCount();
  }
}
