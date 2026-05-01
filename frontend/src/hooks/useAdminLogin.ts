import type { NavigateFunction } from "react-router-dom";
import type { AppDispatch } from "../redux/store";
import {
  adminLoginFailure,
  adminLoginStart,
  adminLoginSuccess,
} from "../redux/admin/adminSlice";
import { axiosInstance } from "../api/axiosInstance";
import { useState } from "react";

export const useAdminLogin = (dispatch: AppDispatch, navigate: NavigateFunction) => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const adminLogin = async (formData: { email: string; password: string }) => {
    try {
      dispatch(adminLoginStart());
      const res = await axiosInstance.post(`/admin/login`, formData);
      dispatch(adminLoginSuccess(res.data));
      navigate(`/admin/dashboard`, { replace: true });
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Something went wrong";
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);
        return;
      }
      dispatch(adminLoginFailure(errMsg));
    }
  };

  return { adminLogin, fieldError, setFieldError };
};
