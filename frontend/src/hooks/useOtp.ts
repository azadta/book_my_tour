import { useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../api/axiosInstance";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";

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
      await axiosInstance.post("/user/verify-otp", {
        userId,
        otp,
      });
      onSuccess();
    } catch (error: any) {
      setError(error.response?.data?.message || error.message);
    }
  };

  const resendOtp = async () => {
    setResendLoading(true);
    try {
      const { data } = await axiosInstance.post("/user/resend-otp", {
        userId,
      });
      setOtp("");
      setOtpExpire(Number(data.otpExpire));
      setError(null);
      toast.info(FEEDBACK_MESSAGES.AUTH.SUCCESS.OTP_RESENT);
    } catch (error: any) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setResendLoading(false);
    }
  };
  return { otp, setOtp, error, resendLoading, verifyOtp, resendOtp, otpExpire };
};
