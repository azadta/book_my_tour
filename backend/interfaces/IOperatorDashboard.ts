export interface IOperatorDashboardService {
  getOperatorDashboardStatsService(operatorId: string): Promise<{
    packagesCount: number;
    totalBookings: number;
    confirmedBookings: number;
    cancelRequestedBookings: number;
    totalRevenue: number;
  }>;
}
