import { IBookingStatusBreakDown, IMonthlyRevenue } from "./IBooking";

export interface IDashboardService {
  getAdminSummaryCountsService(): Promise<{
    usersCount: number;
    operatorsCount: number;
    todaySignups: number;
    pendingVerificationsCount: number;
  }>;

  getOperatorDashboardStatsService(operatorId: string): Promise<{
    packagesCount: number;
    monthlyRevenue: IMonthlyRevenue[];
    bookingStatusBreakDown: IBookingStatusBreakDown[];
    totalBookings: number;
    confirmedBookings: number;
    cancelRequestedBookings: number;
    totalRevenue: number;
  }>;

  getAdminDashboardStatsService(): Promise<{
    packagesCount: number;
    monthlyRevenue: IMonthlyRevenue[];
    bookingStatusBreakDown: IBookingStatusBreakDown[];
    totalBookings: number;
    confirmedBookings: number;
    cancelRequestedBookings: number;
    totalRevenue: number;
  }>;
}
