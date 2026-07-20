import { useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const sendResetEmail = async (email: string) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(APP_ROUTES.USER.FORGOT_PASSWORD, {
        email,
      });
      return res.data;
    } finally {
      setLoading(false);
    }
  };
  return { sendResetEmail, loading };
};
