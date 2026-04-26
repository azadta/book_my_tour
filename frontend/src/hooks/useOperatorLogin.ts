import type { NavigateFunction } from "react-router-dom";
import {
  operatorLoginFailure,
  operatorLoginStart,
  operatorLoginSuccess,
} from "../redux/operator/operatorSlice";
import type { AppDispatch } from "../redux/store";

import { toast } from "react-toastify";
import { axiosInstance } from "../api/axiosInstance";

export const useOperatorLogin = (
  dispatch: AppDispatch,
  navigate: NavigateFunction
) => {
  return async (formData: { email: string; password: string }) => {
    try {
      dispatch(operatorLoginStart());
      const res = await axiosInstance.post("/operator/login", formData, {
        withCredentials: true,
      });

      if (!res.data.isVerified) {
        toast.warning("Your account is not verified by the admin yet");
        dispatch(operatorLoginFailure("Not verified"));
        return;
      }
      dispatch(operatorLoginSuccess(res.data));

      navigate("/operator/dashboard", { replace: true });
    } catch (error: any) {
      const errmsg =
        error.response?.data?.message || "Login failed, please try again";
      toast.error(errmsg);
      dispatch(operatorLoginFailure(errmsg));
    }
  };
};
