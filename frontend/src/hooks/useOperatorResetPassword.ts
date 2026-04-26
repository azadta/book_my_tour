import { useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

export const useOperatorResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        `/operator/reset-password/${token}`,
        { newPassword }
      );
      return res.data;
    } finally {
      setLoading(false);
    }
  };
  return { resetPassword, loading };
};
