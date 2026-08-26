import { inject, injectable } from "inversify";
import { IOperatorDashboardService } from "../interfaces/IOperatorDashboard";
import type { IPackageRepository } from "../interfaces/IPackageRepository";
import type { IBookingRepository } from "../interfaces/IBookingRepository";
import { Types } from "../types/types";

@injectable()
export class OperatorDashboardService implements IOperatorDashboardService {
  constructor(
    @inject(Types.PackageRepository)
    private packageRepository: IPackageRepository,
    @inject(Types.BookingRepository)
    private bookingRepository: IBookingRepository,
  ) {}

  async getOperatorDashboardStatsService(operatorId: string) {
    const [stats, packagesCount] = await Promise.all([
      this.bookingRepository.getOperatorStats(operatorId),
      this.packageRepository.countPackagesByOperatorId(operatorId),
    ]);
    return { ...stats, packagesCount };
  }
}
