import { useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

export const useRegister = () => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerUser = async (
    formData: any,
    onSuccess: (userId: string, otpExpire: string) => void,
  ) => {
    setLoading(true);
    setError(null);
    const { confirmPassword, ...userData } = formData;
    try {
      const res = await axiosInstance.post("/user/register", userData);
      const data = res.data;

      onSuccess(data.userId, data.otpExpire);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);
        setLoading(false);
        return;
      }
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, error,fieldError,setFieldError };
};
