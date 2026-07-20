import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-toastify";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { APP_ROUTES } from "@/constants/AppRoutes";

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
        axiosInstance.get(APP_ROUTES.ADMIN.USER_COUNT),
        axiosInstance.get(APP_ROUTES.ADMIN.OPS_COUNT),
        axiosInstance.get( APP_ROUTES.ADMIN.SIGNUP_TODAY),
        axiosInstance.get(`APP_ROUTES.ADMIN.OPS_PENDING_COUNT`),
      ]);
      setUsersCount(usersCount.data.usersCount);
      setOperatorsCount(operatorsCount.data.operatorsCount);
      setTodaySignups(todaySignups.data.todaySignupCount);
      setPendingVerificationsCount(pendingVerificationsCount.data.count);
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
    usersCount,
    operatorsCount,
    pendingVerificationsCount,
    todaySignups,
    loading,
  };
};
