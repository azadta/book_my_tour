import type { NavigateFunction } from "react-router-dom";
import {
  operatorLoginFailure,
  operatorLoginStart,
  operatorLoginSuccess,
} from "../redux/operator/operatorSlice";
import type { AppDispatch } from "../redux/store";

import { toast } from "react-toastify";
import { axiosInstance } from "../api/axiosInstance";
import { useState } from "react";

export const useOperatorLogin = (
  dispatch: AppDispatch,
  navigate: NavigateFunction
) => {
    const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const login= async (formData: { email: string; password: string }) => {
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
         if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);
        return;
      }
      const errmsg =
        error.response?.data?.message || "Login failed, please try again";
      toast.error(errmsg);
      dispatch(operatorLoginFailure(errmsg));
    }
  };

  return {login,fieldError,setFieldError}
};
