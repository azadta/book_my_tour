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
    private _userRepository: IUserRepository,
    @inject(Types.OperatorRepository)
    private _operatorRepository: IOperatorRepository,
    @inject(Types.BookingRepository)
    private _bookingRepository: IBookingRepository,
    @inject(Types.PackageRepository)
    private _packageRepository: IPackageRepository,
    @inject(Types.UserService)
    private _userService: IUserService,
    @inject(Types.OperatorService)
    private _operatorService: IOperatorService,
  ) {}
  async getAdminSummaryCountsService() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const [
      usersSignups,
      operatorsSignups,
      pendingVerificationsCount,
      usersCount,
      operatorsCount,
    ] = await Promise.all([
      this._userRepository.countUsersByDateRange(startOfDay, endOfDay),
      this._operatorRepository.countOperatorsByDateRange(startOfDay, endOfDay),
      this._operatorRepository.getPendingOperatorsCount(),
      this._userService.getTotalUsersCount(),
      this._operatorService.getTotalOperatorsCount(),
    ]);
    const todaySignups = usersSignups + operatorsSignups;
    return {
      usersCount,
      operatorsCount,
      todaySignups,
      pendingVerificationsCount,
    };
  }

  async getOperatorDashboardStatsService(operatorId: string) {
    const [stats, packagesCount, monthlyRevenue, bookingStatusBreakDown] =
      await Promise.all([
        this._bookingRepository.getOperatorStats(operatorId),
        this._packageRepository.countPackagesByOperatorId(operatorId),
        this._bookingRepository.getMonthlyRevenue(operatorId),
        this._bookingRepository.getBookingStatusBreakDown(operatorId),
      ]);

    return { ...stats, packagesCount, monthlyRevenue, bookingStatusBreakDown };
  }

  async getAdminDashboardStatsService() {
    const [stats, packagesCount, monthlyRevenue, bookingStatusBreakDown] =
      await Promise.all([
        this._bookingRepository.getAdminStats(),
        this._packageRepository.countDocuments(),
        this._bookingRepository.getAdminMonthlyRevenue(),
        this._bookingRepository.getAdminBookingStatusBreakDown(),
      ]);

    return { ...stats, packagesCount, monthlyRevenue, bookingStatusBreakDown };
  }
}
