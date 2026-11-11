import { APP_ROUTES } from "@/constants/AppRoutes";
import { handleApiError } from "@/utils/axiosErrorHandler";
import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import type {
  BookingStatusItem,
  IMonthlyRevenue,
} from "./useOperatorDashboard";
export interface IAdminDashboardData {
  packagesCount: number;
  totalBookings: number;
  confirmedBookings: number;
  cancelRequestedBookings: number;
  totalRevenue: number;
  monthlyRevenue: IMonthlyRevenue[];
  bookingStatusBreakDown: BookingStatusItem[];
}

export const useAdminDashboard = () => {
  const [usersCount, setUsersCount] = useState<number | null>(null);
  const [operatorsCount, setOperatorsCount] = useState<number | null>(null);
  const [todaySignups, setTodaySignups] = useState<number | null>(null);
  const [pendingVerificationsCount, setPendingVerificationsCount] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [dashBoardData, setDashboardData] =
    useState<IAdminDashboardData | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        APP_ROUTES.DASHBOARD.ADMIN.SUMMARY,
      );
      setUsersCount(data.result.usersCount);
      setOperatorsCount(data.result.operatorsCount);
      setTodaySignups(data.result.todaySignups);
      setPendingVerificationsCount(data.result.pendingVerificationsCount);
    } catch (error: unknown) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        APP_ROUTES.DASHBOARD.ADMIN.STATS,
      );

      setDashboardData(data.result);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchDashboardStats();
  }, []);

  return {
    usersCount,
    operatorsCount,
    pendingVerificationsCount,
    todaySignups,
    loading,
    dashBoardData,
  };
};
