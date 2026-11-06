import { useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../api/axiosInstance";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { handleApiError } from "@/utils/axiosErrorHandler";

interface UseOtpProps {
  userId: string;
  onSuccess: () => void;
  initialOtpExpire?: number;
}

export const useOtp = ({
  userId,
  onSuccess,
  initialOtpExpire,
}: UseOtpProps) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpExpire, setOtpExpire] = useState<number>(
    () => initialOtpExpire || Date.now(),
  );

  const verifyOtp = async () => {
    try {
      await axiosInstance.post(APP_ROUTES.USERS.USER.VERIFY_OTP, {
        userId,
        otp,
      });
      onSuccess();
    } catch (error) {
      const errorMessage = handleApiError(error);
      if (errorMessage) setError(errorMessage);
    }
  };

  const resendOtp = async () => {
    setResendLoading(true);
    try {
      const { data } = await axiosInstance.post(
        APP_ROUTES.USERS.USER.RESEND_OTP,
        {
          userId,
        },
      );
      setOtp("");
      setOtpExpire(Number(data.result.otpExpire));
      setError(null);
      toast.info(FEEDBACK_MESSAGES.AUTH.SUCCESS.OTP_RESENT);
    } catch (error) {
      const errorMessage = handleApiError(error);
      if (errorMessage) setError(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };
  return { otp, setOtp, error, resendLoading, verifyOtp, resendOtp, otpExpire };
};
