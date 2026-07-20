import { useEffect, useState } from "react";

import { axiosInstance } from "../api/axiosInstance";
import type { IPackageItem } from "@/interfaces/interfaces";
import { toast } from "react-toastify";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { APP_ROUTES } from "@/constants/AppRoutes";

export const useAdminPackageManagement = (page: number, limit: number) => {
  const [packages, setPackages] = useState<IPackageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(
          APP_ROUTES.ADMIN.PACKAGES_LIST,
          {
            params: {
              page,
              limit,
            },
          },
        );

        setPackages(data.packages || []);
        setTotalCount(data.totalCount || 0);
      } catch (error) {
        console.error(FEEDBACK_MESSAGES.PACKAGE.ERROR.FETCH, error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [page, limit]);

  const deletePackage = async (id: string) => {
    try {
      setLoading(true);
      await axiosInstance.delete(APP_ROUTES.ADMIN.DELETE_PACKAGE(id));
      setPackages((prev) => prev.filter((pkg) => pkg._id !== id));
      setTotalCount((prev) => prev - 1);
    } catch (error) {
      console.error(error);
      toast.error(FEEDBACK_MESSAGES.PACKAGE.ERROR.DELETE);
    } finally {
      setLoading(false);
    }
  };

  return { packages, loading, totalCount, deletePackage };
};
