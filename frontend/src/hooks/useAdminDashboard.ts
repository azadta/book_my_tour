import { APP_ROUTES } from "@/constants/AppRoutes";
import { handleApiError } from "@/utils/axiosErrorHandler";
import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

export const useAdminDashboard = () => {
  const [usersCount, setUsersCount] = useState<number | null>(null);
  const [operatorsCount, setOperatorsCount] = useState<number | null>(null);
  const [todaySignups, setTodaySignups] = useState<number | null>(null);
  const [pendingVerificationsCount, setPendingVerificationsCount] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [
        usersCount,
        operatorsCount,
        todaySignups,
        pendingVerificationsCount,
      ] = await Promise.all([
        axiosInstance.get(APP_ROUTES.DASHBOARD.ADMIN.USERS_COUNT),
        axiosInstance.get(APP_ROUTES.DASHBOARD.ADMIN.OPERATORS_COUNT),
        axiosInstance.get(APP_ROUTES.DASHBOARD.ADMIN.SIGNUP_TODAY),
        axiosInstance.get(APP_ROUTES.DASHBOARD.ADMIN.OPERATORS_PENDING_COUNT),
      ]);
      setUsersCount(usersCount.data.result.usersCount);
      setOperatorsCount(operatorsCount.data.result.operatorsCount);
      setTodaySignups(todaySignups.data.result.todaySignupCount);
      setPendingVerificationsCount(pendingVerificationsCount.data.result.count);
    } catch (error: unknown) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    usersCount,
    operatorsCount,
    pendingVerificationsCount,
    todaySignups,
    loading,
  };
};
