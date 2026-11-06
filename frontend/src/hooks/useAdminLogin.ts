import { APP_ROUTES } from "@/constants/AppRoutes";
import { handleApiError } from "@/utils/axiosErrorHandler";
import { useState } from "react";
import type { NavigateFunction } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";
import {
  adminLoginFailure,
  adminLoginStart,
  adminLoginSuccess,
} from "../redux/admin/adminSlice";
import type { AppDispatch } from "../redux/store";

export const useAdminLogin = (
  dispatch: AppDispatch,
  navigate: NavigateFunction,
) => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const adminLogin = async (formData: { email: string; password: string }) => {
    try {
      dispatch(adminLoginStart());
      const res = await axiosInstance.post(APP_ROUTES.ADMINS.LOGIN, formData);
      dispatch(adminLoginSuccess(res.data.result));
      navigate(`/admin/dashboard`, { replace: true });
    } catch (error: unknown) {
      const errMsg = handleApiError(error, { setFieldError });
      if (errMsg) {
        dispatch(adminLoginFailure(errMsg));
      }
    }
  };

  return { adminLogin, fieldError, setFieldError };
};
