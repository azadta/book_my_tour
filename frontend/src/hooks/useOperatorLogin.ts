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
import { handleApiError } from "@/utils/axiosErrorHandler";

export const useOperatorLogin = (
  dispatch: AppDispatch,
  navigate: NavigateFunction,
) => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const login = async (formData: { email: string; password: string }) => {
    try {
      dispatch(operatorLoginStart());
      const res = await axiosInstance.post(
        APP_ROUTES.OPERATORS.OPERATOR.LOGIN,
        formData,
        {
          withCredentials: true,
        },
      );

      if (!res.data.result.isVerified) {
        toast.warning(FEEDBACK_MESSAGES.OPERATOR.ERROR.NOT_VERIFIED);
        dispatch(operatorLoginFailure("Not verified"));
        return;
      }
      dispatch(operatorLoginSuccess(res.data.result));

      navigate("/operator/dashboard", { replace: true });
    } catch (error) {
      const errorMessage = handleApiError(error, { setFieldError });
      if (errorMessage) dispatch(operatorLoginFailure(errorMessage));
    }
  };

  return { login, fieldError, setFieldError };
};
