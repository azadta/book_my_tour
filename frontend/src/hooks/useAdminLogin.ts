import type { NavigateFunction } from "react-router-dom";
import type { AppDispatch } from "../redux/store";
import {
  adminLoginFailure,
  adminLoginStart,
  adminLoginSuccess,
} from "../redux/admin/adminSlice";
import { axiosInstance } from "../api/axiosInstance";

export const useAdminLogin = (
  dispatch: AppDispatch,
  navigate: NavigateFunction,
) => {
  return async (formData: { email: string; password: string }) => {
    try {
      dispatch(adminLoginStart());
      const res = await axiosInstance.post(`/admin/login`, formData);
      dispatch(adminLoginSuccess(res.data));
      navigate(`/admin/dashboard`, { replace: true });
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Something went wrong";
      dispatch(adminLoginFailure(errMsg));
    }
  };
};
