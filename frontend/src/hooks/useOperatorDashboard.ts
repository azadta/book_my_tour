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
      console.log(error.response?.data?.message || error.message);
      toast.error("failed to fetch dashboard data");
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
