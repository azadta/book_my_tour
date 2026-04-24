import type { NavigateFunction } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance.js";
import type { AppDispatch } from "../redux/store.js";
import {
  logInFailure,
  logInStart,
  logInSuccess,
} from "../redux/user/userSlice.js";

export const useLogin = (dispatch: AppDispatch, navigate: NavigateFunction) => {
  return async (formData: { email: string; password: string }) => {
    try {
      dispatch(logInStart());
      const res = await axiosInstance.post("/user/login", formData);
      dispatch(logInSuccess(res.data));
      navigate("/", { replace: true });
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Something went wrong ";
      dispatch(logInFailure(errMsg));
    }
  };
};
