import { useState } from "react";
import { useForgotPassword } from "../../hooks/useForgotPassword";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const { sendResetEmail, loading } = useForgotPassword();
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      await sendResetEmail(email);
      toast.success("Password reset link sent,Please check your email");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to process forgot password request.",
      );
    }
  };

  return (
    <div className=" flex items-center justify-center py-10 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full ">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
