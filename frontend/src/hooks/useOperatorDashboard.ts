import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-toastify";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { APP_ROUTES } from "@/constants/AppRoutes";

export const useOperatorDashboard = () => {
  const [PackagesCount, setPackagesCount] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const packagesCount = await axiosInstance.get(
        APP_ROUTES.OPERATOR.MY_PACKAGES_COUNT,
      );

      setPackagesCount(packagesCount.data.totalPakagesCount);
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
    PackagesCount,
    loading,
  };
};
