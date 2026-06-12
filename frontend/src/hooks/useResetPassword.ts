import { useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const resetUserPassword = async (token: string, newPassword: string) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(`/user/reset-password/${token}`, {
        newPassword,
      });
      return res.data;
    } finally {
      setLoading(false);
    }
  };
  return { resetUserPassword, loading };
};
