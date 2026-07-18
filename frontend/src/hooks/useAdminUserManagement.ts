import { useCallback, useEffect, useState } from "react";
import type { IUser } from "../redux/user/userSlice";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-toastify";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";

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
      console.error(FEEDBACK_MESSAGES.USER.ERROR.FETCH_USERS, error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  const blockUser = async (id: string, isBlocked: boolean) => {
    try {
      await axiosInstance.put(`/admin/users/block/${id}`, { isBlocked });
      setUsers((prev) =>
        prev.map((user) => (user._id === id ? { ...user, isBlocked } : user)),
      );
    } catch (error) {
      console.error(FEEDBACK_MESSAGES.USER.ERROR.UPDATE_BLOCK_STATUS, error);
      toast.error(FEEDBACK_MESSAGES.USER.ERROR.UPDATE_BLOCK_STATUS);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/admin/users/delete/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
      setTotalCount((prev) => prev - 1);
    } catch (error) {
      console.error(error);
      toast.error(FEEDBACK_MESSAGES.USER.ERROR.DELETE);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, fetchUsers]);

  return {
    users,
    loading,
    fetchUsers,
    blockUser,
    deleteUser,
    totalCount,
  };
};
