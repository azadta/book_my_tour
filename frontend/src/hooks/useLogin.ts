import { APP_ROUTES } from "@/constants/AppRoutes.js";
import { handleApiError } from "@/utils/axiosErrorHandler.js";
import { useState } from "react";
import type { NavigateFunction } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance.js";
import type { AppDispatch } from "../redux/store.js";
import {
  logInFailure,
  logInStart,
  logInSuccess,
} from "../redux/user/userSlice.js";

export const useLogin = (dispatch: AppDispatch, navigate: NavigateFunction) => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const login = async (formData: { email: string; password: string }) => {
    try {
      dispatch(logInStart());
      const res = await axiosInstance.post(
        APP_ROUTES.USERS.USER.LOGIN,
        formData,
      );
      dispatch(logInSuccess(res.data.result));
      navigate("/", { replace: true });
    } catch (error) {
      const errMsg = handleApiError(error, { setFieldError });
      if (errMsg) dispatch(logInFailure(errMsg));
    }
  };

  return { login, fieldError, setFieldError };
};
