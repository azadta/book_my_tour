import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useOperatorOtp } from "../../hooks/useOperatorOtp";
import { OtpForm } from "../../components/forms/OtpForm";
import { toast } from "react-toastify";

const OperatorOtpVerification = () => {
  const { operatorId } = useParams<{ operatorId: string }>();
  const [searchParams] = useSearchParams();
  const otpExpireParam = searchParams.get("otpExpire");

  const expire =
    otpExpireParam && !isNaN(Number(otpExpireParam))
      ? Number(otpExpireParam)
      : Date.now();

  const navigate = useNavigate();
  const { otp, setOtp, verifyOtp, resendOtp, resendLoading, error, otpExpire } =
    useOperatorOtp({
      operatorId: operatorId || "",
      onSuccess: () => {
        toast.success("Registration Submitted, awaiting admin verification.");
        navigate("/");
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
    if (otp.length === 5 && timeLeft > 0) verifyOtp();
  }, [otp]);

  return (
    <OtpForm
      otp={otp}
      error={error}
      onResend={resendOtp}
      onSubmit={verifyOtp}
      setOtp={setOtp}
      timeLeft={timeLeft}
      resendLoading={resendLoading}
    />
  );
};

export default OperatorOtpVerification;
