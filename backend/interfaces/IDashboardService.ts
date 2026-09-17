export interface IDashboardService {
  getSignupCountTodayService(): Promise<number>;
  getPendingOperatorsCountService(): Promise<number>;
  getOperatorDashboardStatsService(operatorId: string): Promise<{
    packagesCount: number;
    totalBookings: number;
    confirmedBookings: number;
    cancelRequestedBookings: number;
    totalRevenue: number;
  }>;
  getTotalUsersCountService(): Promise<number>;
  getTotalOperatorsCountService(): Promise<number>;
}
