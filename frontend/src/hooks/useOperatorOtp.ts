import { useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";

interface UseOtpProps {
  operatorId: string;
  onSuccess: () => void;
  initialOtpExpire?: number;
}

export const useOperatorOtp = ({
  operatorId,
  initialOtpExpire,
  onSuccess,
}: UseOtpProps) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpExpire, setOtpExpire] = useState<number>(()=>
    initialOtpExpire || Date.now()
  );

  const verifyOtp = async () => {
    try {
      await axiosInstance.post( APP_ROUTES.OPERATOR.VERIFY_OTP, {
        operatorId,
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
      const { data } = await axiosInstance.post( APP_ROUTES.OPERATOR.RESEND_OTP, {
        operatorId,
      });
      setOtp("");
      setOtpExpire(Number(data.otpExpire));
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setResendLoading(false);
    }
  };
  return {
    otp,
    setOtp,
    error,
    resendLoading,
    verifyOtp,
    resendOtp,
    otpExpire,
  };
};
