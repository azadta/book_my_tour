import { useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const sendResetEmail = async (email: string) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/user/forgot-password", { email });
      return res.data;
    } finally {
      setLoading(false);
    }
  };
  return { sendResetEmail, loading };
};
