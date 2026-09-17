import { useCallback, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";

export const useAdminUserActions = () => {
  const [loading, setLoading] = useState(false);
  const fetchUser = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(APP_ROUTES.USERS.ADMIN.DETAIL(id));
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: string, data: any) => {
    setLoading(true);
    try {
      await axiosInstance.put(APP_ROUTES.USERS.ADMIN.UPDATE(id), data);
    } finally {
      setLoading(false);
    }
  }, []);
  const blockUser = useCallback(async (id: string, isBlocked: boolean) => {
    setLoading(true);
    try {
      await axiosInstance.put(APP_ROUTES.USERS.ADMIN.BLOCK(id), { isBlocked });
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await axiosInstance.delete(APP_ROUTES.USERS.ADMIN.DELETE(id));
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    fetchUser,
    updateUser,
    blockUser,
    deleteUser,
  };
};
