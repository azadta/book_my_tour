import { useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";

export const useOperatorResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        APP_ROUTES.OPERATOR.RESET_PASSWORD(token),
        { newPassword },
      );
      return res.data;
    } finally {
      setLoading(false);
    }
  };
  return { resetPassword, loading };
};
