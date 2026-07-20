import type { NavigateFunction } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance.js";
import type { AppDispatch } from "../redux/store.js";
import {
  logInFailure,
  logInStart,
  logInSuccess,
} from "../redux/user/userSlice.js";
import { useState } from "react";
import { toast } from "react-toastify";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages.js";
import { APP_ROUTES } from "@/constants/AppRoutes.js";

export const useLogin = (dispatch: AppDispatch, navigate: NavigateFunction) => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const login = async (formData: { email: string; password: string }) => {
    try {
      dispatch(logInStart());
      const res = await axiosInstance.post(APP_ROUTES.USER.LOGIN, formData);
      dispatch(logInSuccess(res.data));
      navigate("/", { replace: true });
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);
        return;
      }
      const errMsg =
        error.response?.data?.message ||
        FEEDBACK_MESSAGES.GLOBAL.ERROR.SOMETHINK_WENT_WRONG;
      toast.error(errMsg);
      dispatch(logInFailure(errMsg));
    }
  };

  return { login, fieldError, setFieldError };
};
