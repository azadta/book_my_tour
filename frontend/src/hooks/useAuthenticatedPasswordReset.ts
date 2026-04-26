import { useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

export const useAuthenticatedPasswordReset = (endPoint: string) => {
  const [loading, setLoading] = useState(false);
  const resetPassword = async (
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(endPoint, {
        oldPassword,
        newPassword,
        confirmPassword,
      });
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading };
};
