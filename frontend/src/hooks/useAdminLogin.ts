import type { NavigateFunction } from "react-router-dom";
import type { AppDispatch } from "../redux/store";
import {
  adminLoginFailure,
  adminLoginStart,
  adminLoginSuccess,
} from "../redux/admin/adminSlice";
import { axiosInstance } from "../api/axiosInstance";
import { useState } from "react";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { APP_ROUTES } from "@/constants/AppRoutes";

export const useAdminLogin = (
  dispatch: AppDispatch,
  navigate: NavigateFunction,
) => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const adminLogin = async (formData: { email: string; password: string }) => {
    try {
      dispatch(adminLoginStart());
      const res = await axiosInstance.post(APP_ROUTES.ADMIN.LOGIN, formData);
      dispatch(adminLoginSuccess(res.data));
      navigate(`/admin/dashboard`, { replace: true });
    } catch (error: any) {
      const errMsg =
        error.response?.data?.message ||
        FEEDBACK_MESSAGES.GLOBAL.ERROR.SOMETHINK_WENT_WRONG;
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);
        return;
      }
      dispatch(adminLoginFailure(errMsg));
    }
  };

  return { adminLogin, fieldError, setFieldError };
};
