export interface IAdminDashboardService {
  getSignupCountTodayService(): Promise<number>;
  getPendingOperatorsCountService(): Promise<number>;
   
   
}
