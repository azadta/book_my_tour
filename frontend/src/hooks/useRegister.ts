import { APP_ROUTES } from "@/constants/AppRoutes";
import { handleApiError } from "@/utils/axiosErrorHandler";
import { useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

export const useRegister = () => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const registerUser = async (
    formData: Record<string, unknown>,
    onSuccess: (userId: string, otpExpire: string) => void,
  ) => {
    setLoading(true);
    //eslint-disable-next-line  @typescript-eslint/no-unused-vars
    const { confirmPassword, ...userData } = formData;
    try {
      const res = await axiosInstance.post(
        APP_ROUTES.USERS.USER.REGISTER,
        userData,
      );
      const data = res.data;

      onSuccess(data.result.userId, data.result.otpExpire);
    } catch (error) {
      handleApiError(error, { setFieldError });
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, fieldError, setFieldError };
};
