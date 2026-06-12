import { type NavigateFunction } from "react-router-dom";
import type { AppDispatch } from "../redux/store";
import {
  logInFailure,
  logInStart,
  logInSuccess,
} from "../redux/user/userSlice";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../../src/config/firebase";
import { axiosInstance } from "../api/axiosInstance";

export const useGoogleLogin = (
  dispatch: AppDispatch,
  navigate: NavigateFunction,
) => {
  return async () => {
    try {
      dispatch(logInStart());
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await axiosInstance.post(`/user/google`, {
        name: result.user.displayName,
        email: result.user.email,
      });
      dispatch(logInSuccess(res.data));
      navigate("/", { replace: true });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Google log-in failed";
      dispatch(logInFailure(errorMessage));
    }
  };
};
