import { toast } from "react-toastify";
import { useOperatorForgotPassword } from "../../hooks/useOperatorForgotPassword";
import { useState } from "react";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { useNavigate } from "react-router-dom";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";
import { X } from "lucide-react";

const OperatorForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const { sendResetEmail, loading } = useOperatorForgotPassword();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await sendResetEmail(email);
      toast.success(FEEDBACK_MESSAGES.AUTH.SUCCESS.FORGOT_PASSWORD_SENT);
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          FEEDBACK_MESSAGES.AUTH.ERROR.FORGOT_PASSWORD,
      );
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full relative mx-auto">
      <button
        onClick={() => navigate(FRONTEND_ROUTES.OPERATOR.LOGIN)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition cursor-pointer "
        title="Back to login"
      >
        <X size={18} />
      </button>
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:opcity-60"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default OperatorForgotPassword;
