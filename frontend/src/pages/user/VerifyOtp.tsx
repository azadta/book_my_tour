import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useOtp } from "../../hooks/useOtp";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {OtpForm} from "../../components/forms/OtpForm";

const VerifyOtp = () => {
  const { userId } = useParams<{ userId: string }>();
  const [searchParams] = useSearchParams();
  const otpExpireParam = searchParams.get("otpExpire");
  const expire =
    otpExpireParam && !isNaN(Number(otpExpireParam))
      ? Number(otpExpireParam)
      : Date.now();
  const navigate = useNavigate();
  const { otp, setOtp, error, resendLoading, verifyOtp, resendOtp, otpExpire } =
    useOtp({
      userId: userId || "",
      onSuccess: () => {
        toast.success("Your account has been registered successfully");
        navigate("/user/login");
      },
      initialOtpExpire: expire,
    });
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = Date.now();
    const remainingMs = expire - now;
    return Math.max(Math.floor(remainingMs / 1000), 0);
  });

  useEffect(() => {
    if (otpExpire) {
      const now = Date.now();
      const remaining = Math.floor((otpExpire - now) / 1000);
      setTimeLeft(Math.max(remaining, 0));
    }
  }, [otpExpire]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    if (otp.length === 5 && timeLeft > 0) {
      verifyOtp();
    }
  }, [otp]);

  return (
    <OtpForm
      otp={otp}
      error={error}
      onResend={resendOtp}
      onSubmit={verifyOtp}
      resendLoading={resendLoading}
      setOtp={setOtp}
      timeLeft={timeLeft}
    />
  );
};

export default VerifyOtp;
