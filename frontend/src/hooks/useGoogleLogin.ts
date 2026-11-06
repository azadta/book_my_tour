import { APP_ROUTES } from "@/constants/AppRoutes";
import { handleApiError } from "@/utils/axiosErrorHandler";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { type NavigateFunction } from "react-router-dom";
import { app } from "../../src/config/firebase";
import { axiosInstance } from "../api/axiosInstance";
import type { AppDispatch } from "../redux/store";
import {
  logInFailure,
  logInStart,
  logInSuccess,
} from "../redux/user/userSlice";

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
      const res = await axiosInstance.post(APP_ROUTES.USERS.USER.GOOGLE, {
        name: result.user.displayName,
        email: result.user.email,
      });
      dispatch(logInSuccess(res.data.result));
      navigate("/", { replace: true });
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      if (errorMessage) dispatch(logInFailure(errorMessage));
    }
  };
};
