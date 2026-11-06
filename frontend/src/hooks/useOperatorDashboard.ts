import { APP_ROUTES } from "@/constants/AppRoutes";
import { handleApiError } from "@/utils/axiosErrorHandler";
import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

export interface IMonthlyRevenue {
  year: number;
  month: number;
  totalRevenue: number;
  totalBookings: number;
}
export interface BookingStatusItem {
  status: "PENDING" | "CONFIRMED" | "CANCEL_REQUESTED" | "FAILED" | "CANCELLED";
  count: number;
}

export interface IOperatorDashboardData {
  packagesCount: number;
  totalBookings: number;
  confirmedBookings: number;
  cancelRequestedBookings: number;
  totalRevenue: number;
  monthlyRevenue:IMonthlyRevenue[];
  bookingStatusBreakDown:BookingStatusItem[]
}

export const useOperatorDashboard = () => {
  const [dashBoardData, setDashboardData] =
    useState<IOperatorDashboardData | null>(null);

  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        APP_ROUTES.DASHBOARD.OPERATOR.STATS,
      );

      setDashboardData(data.result);
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    dashBoardData,
    loading,
  };
};
