import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useOtp } from "../../hooks/useOtp";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { OtpForm } from "../../components/forms/OtpForm";
import { MdOutlineEmojiNature } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import { TbLayoutCardsFilled } from "react-icons/tb";
import { LuSearchCheck } from "react-icons/lu";
import { BsFillChatQuoteFill } from "react-icons/bs";

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
    <div className="flex max-md:flex-col justify-center items-center gap-5 ">
      <div className="relative py-10 px-12 ml-5 max-sm:hidden ">
        <div className="absolute inset-0 opacity-30 bg-[url('/review2.jpg')] bg-cover bg-center flex-1 rounded-2xl"></div>
        <ul className="space-y-4">
          <li className="text-cyan-800 font-semibold">
            Why Choose Our Tour booking App?
          </li>
          <li className="flex ">
            <MdOutlineEmojiNature className="text-green-500 text-xl" />
            Explore top destinations
          </li>
          <li className="flex items-center gap-1">
            {" "}
            <IoCalendarOutline className="text-green-500 " /> Easy Tour Booking
          </li>
          <li className="flex items-center gap-1">
            <TbLayoutCardsFilled className="text-green-500 " />
            Visual Tour Cards
          </li>
          <li className="flex items-center gap-1">
            {" "}
            <LuSearchCheck className="text-green-500" />
            Smart Filters & Search
          </li>
          <li className="flex items-center gap-1">
            <BsFillChatQuoteFill className="text-green-500" />
            Live chat with destination managements
          </li>
        </ul>
      </div>
      <div className="flex-1 w-full">
        <OtpForm
          otp={otp}
          error={error}
          onResend={resendOtp}
          onSubmit={verifyOtp}
          resendLoading={resendLoading}
          setOtp={setOtp}
          timeLeft={timeLeft}
        />
      </div>
    </div>
  );
};

export default VerifyOtp;
