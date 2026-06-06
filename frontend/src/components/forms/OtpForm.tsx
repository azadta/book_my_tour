interface OtpFormProps {
  otp: string;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  resendLoading: boolean;
  error: string | null;
  timeLeft: number;
  onSubmit: () => void;
  onResend: () => void;
}

export const OtpForm = ({
  error,
  onResend,
  onSubmit,
  otp,
  resendLoading,
  setOtp,
  timeLeft,
}: OtpFormProps) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="p-3 max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Verify Otp</h1>
      <p className="text-center mb-4 text-gray-600">
        OTP expires in :
        <span className="font-semibold">{formatTime(timeLeft)}</span>
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Enter OTP"
          className="border border-gray-400 p-3 rounded-lg"
          value={otp}
          maxLength={5}
          onChange={(e) => setOtp(e.target.value)}
          disabled={timeLeft <= 0}
        />
        <button
          className=" bg-[#634C9F]  hover:bg-[#583c9f] text-white py-2 rounded-lg"
          type="submit"
          disabled={timeLeft <= 0 || otp.length !== 5}
        >
          Verify
        </button>
        {timeLeft <= 0 && (
          <button
            type="button"
            onClick={onResend}
            className="text-blue-600 font-semibold underline"
            disabled={resendLoading}
          >
            {resendLoading ? "...Resending" : "Resend OTP"}
          </button>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};
