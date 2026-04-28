import { useCallback, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

export const useAdminUserActions = () => {
  const [loading, setLoading] = useState(false);
  const fetchUser = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/admin/users/single-user/${id}`);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: string, data: any) => {
    setLoading(true);
    try {
      await axiosInstance.put(`/admin/users/update/${id}`, data);
    } finally {
      setLoading(false);
    }
  }, []);
  const blockUser = useCallback(async (id: string, isBlocked: boolean) => {
    setLoading(true);
    try {
      await axiosInstance.put(`/admin/users/block/${id}`, { isBlocked });
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/admin/users/delete/${id}`);
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
