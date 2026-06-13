import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-toastify";

export const useOperatorDashboard = () => {
  const [PackagesCount, setPackagesCount] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const packagesCount = await axiosInstance.get(
        `/operator/my-packages-count`,
      );

      setPackagesCount(packagesCount.data.totalPakagesCount);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "failed to fetch dashboard data";
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
