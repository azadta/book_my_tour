import { useCallback, useEffect, useState } from "react";
import type { IUser } from "../redux/user/userSlice";
import { axiosInstance } from "../api/axiosInstance";

export const useAdminUserManagement = (page: number, limit: number) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/admin/users?page=${page}&limit=${limit}`,
      );
      setUsers(res.data.users || []);
      setTotalCount(res.data.totalCount || 0);
    } catch (error) {
      console.error("failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  const blockUser = async (id: string, isBlocked: boolean) => {
    await axiosInstance.put(`/admin/users/block/${id}`, isBlocked);
    fetchUsers();
  };

  const deleteUser = async (id: string) => {
    await axiosInstance.delete(`/admin/users/delete/${id}`);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit]);

  return {
    users,
    loading,
    fetchUsers,
    blockUser,
    deleteUser,
    totalCount,
  };
};
