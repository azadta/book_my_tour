import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-toastify";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { APP_ROUTES } from "@/constants/AppRoutes";

export interface IOperatorDashboardData {
  packagesCount: number;
  totalBookings: number;
  confirmedBookings: number;
  cancelRequestedBookings: number;
  totalRevenue: number;
}

export const useOperatorDashboard = () => {
  const [dashBoardData, setDashboardData] =
    useState<IOperatorDashboardData | null>(null);

  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        APP_ROUTES.OPERATOR.DASHBOARD_DATA,
      );

      setDashboardData(data);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        FEEDBACK_MESSAGES.GLOBAL.ERROR.DASHBOARD_FETCH;
      toast.error(message);
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
