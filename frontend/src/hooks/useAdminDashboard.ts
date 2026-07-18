import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-toastify";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";

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
        axiosInstance.get(`/admin/users/total-count`),
        axiosInstance.get(`/admin/operators/total-count`),
        axiosInstance.get(`/admin/users/signup-today`),
        axiosInstance.get(`/admin/operators/pending-verification-count`),
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
