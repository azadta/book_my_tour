import type { IPackageItem } from "@/interfaces/interfaces";
import type { RootState } from "@/redux/store";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { axiosInstance } from "../api/axiosInstance";

export const useOperatorPackageManagement = (page: number, limit: number) => {
  const { currentOperator } = useSelector((state: RootState) => state.operator);
  const [packages, setPackages] = useState<IPackageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/operator/packages/${currentOperator?._id}?page=${page}&limit=${limit}`,
      );
      setPackages(res.data.packages || []);
      setTotalCount(res.data.totalCount || 0);
    } catch (error) {
      console.error("failed to fetch packages", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  const deletePackage = async (id: string) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/operator/package/delete/${id}`);
      setPackages((prev) => prev.filter((pkg) => pkg._id !== id));
      setTotalCount((prev) => prev - 1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete package");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [page, limit, fetchPackages]);

  return {
    packages,
    loading,
    fetchPackages,

    deletePackage,
    totalCount,
  };
};
