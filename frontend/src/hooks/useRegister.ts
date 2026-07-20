import { useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-toastify";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { APP_ROUTES } from "@/constants/AppRoutes";

export const useRegister = () => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const registerUser = async (
    formData: any,
    onSuccess: (userId: string, otpExpire: string) => void,
  ) => {
    setLoading(true);
    //eslint-disable-next-line  @typescript-eslint/no-unused-vars
    const { confirmPassword, ...userData } = formData;
    try {
      const res = await axiosInstance.post( APP_ROUTES.USER.REGISER, userData);
      const data = res.data;

      onSuccess(data.userId, data.otpExpire);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);
        setLoading(false);
        return;
      }
      toast.error(
        error.response?.data?.message ||
          FEEDBACK_MESSAGES.AUTH.ERROR.REGISTRATION_FAILED,
      );
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, fieldError, setFieldError };
};
