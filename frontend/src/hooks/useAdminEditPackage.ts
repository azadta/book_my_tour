import { APP_ROUTES } from "@/constants/AppRoutes";
import { useCallback, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

export const useAdminEditPackage = () => {
  const [loading, setLoading] = useState(false);
  const fetchPackage = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(APP_ROUTES.PACKAGES.ADMIN.DETAIL(id));
      return res.data.result;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePackage = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await axiosInstance.delete(APP_ROUTES.PACKAGES.ADMIN.DELETE(id));
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    fetchPackage,

    deletePackage,
  };
};
