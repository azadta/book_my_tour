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
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { APP_ROUTES } from "@/constants/AppRoutes";

export const useOperatorLogin = (
  dispatch: AppDispatch,
  navigate: NavigateFunction
) => {
    const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const login= async (formData: { email: string; password: string }) => {
    try {
      dispatch(operatorLoginStart());
      const res = await axiosInstance.post(APP_ROUTES.OPERATOR.LOGIN, formData, {
        withCredentials: true,
      });

      if (!res.data.isVerified) {
        toast.warning(FEEDBACK_MESSAGES.OPERATOR.ERROR.NOT_VERIFIED);
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
        error.response?.data?.message || FEEDBACK_MESSAGES.AUTH.ERROR.LOGIN;
      toast.error(errmsg);
      dispatch(operatorLoginFailure(errmsg));
    }
  };

  return {login,fieldError,setFieldError}
};
