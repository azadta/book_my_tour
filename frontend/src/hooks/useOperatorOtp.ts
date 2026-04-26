import { useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

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
  const [otpExpire, setOtpExpire] = useState<number>(
    initialOtpExpire || Date.now()
  );

  const verifyOtp = async () => {
    try {
      await axiosInstance.post("/operator/verify-otp", {
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
      const { data } = await axiosInstance.post("/operator/resend-otp", {
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
