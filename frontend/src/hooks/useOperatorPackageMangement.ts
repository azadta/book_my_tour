import type { IPackageItem } from "@/interfaces/interfaces";
import type { RootState } from "@/redux/store";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { axiosInstance } from "../api/axiosInstance";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { APP_ROUTES } from "@/constants/AppRoutes";

export const useOperatorPackageManagement = (page: number, limit: number) => {
  const { currentOperator } = useSelector((state: RootState) => state.operator);
  const [packages, setPackages] = useState<IPackageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        APP_ROUTES.OPERATOR.PACKAGES(currentOperator?._id as string),
        { params: { page, limit } },
      );
      setPackages(res.data.packages || []);
      setTotalCount(res.data.totalCount || 0);
    } catch (error) {
      console.error(FEEDBACK_MESSAGES.PACKAGE.ERROR.FETCH, error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  const deletePackage = async (id: string) => {
    try {
      setLoading(true);
      await axiosInstance.delete(APP_ROUTES.OPERATOR.DELETE_PACKAGE(id));
      setPackages((prev) => prev.filter((pkg) => pkg._id !== id));
      setTotalCount((prev) => prev - 1);
    } catch (error) {
      console.error(error);
      toast.error(FEEDBACK_MESSAGES.PACKAGE.ERROR.DELETE);
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
