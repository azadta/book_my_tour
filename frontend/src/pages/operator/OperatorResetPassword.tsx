import { useParams, useNavigate } from "react-router-dom";
import { useOperatorResetPassword } from "../../hooks/useOperatorResetPassword";
import ReusableForm from "../../components/forms/ReUsableForm";
import { OperatorResetPasswordFields } from "../../formConfig/fields";
import { useState } from "react";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";
import { X } from "lucide-react";

const OperatorResetPassword: React.FC = () => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { resetPassword, loading } = useOperatorResetPassword();

  const handleSubmit = async (formData: any) => {
    setError(null);
    setMessage(null);
    const { newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await resetPassword(token!, newPassword);
      setMessage(FEEDBACK_MESSAGES.AUTH.SUCCESS.PASSWORD_REDIRECTING);
      setTimeout(() => navigate( FRONTEND_ROUTES.OPERATOR.LOGIN), 2000);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);

        return;
      }
      setError(error.response?.data?.message || error.message);
    }
  };

  return (

      <div className="w-full max-w-xl mx-auto relative">
          <button
        onClick={() => navigate(FRONTEND_ROUTES.OPERATOR.LOGIN)}
        className="absolute -top-2 right-5 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition cursor-pointer "
        title="Back to login"
      >
        <X size={18} />
      </button>
     
        <ReusableForm
        heading="Change Password"
          formData={formData}
          setFormData={setFormData}
          fields={OperatorResetPasswordFields}
          onSubmit={handleSubmit}
          loading={loading}
          buttonText="Reset Password"
          fieldError={fieldError}
          setFieldError={setFieldError}
        />
        {message && (
          <p className="bg-green-100 text-green-700 border border-green-400 rounded px-4 py-2 mt-4 text-center  ">
            {message}
          </p>
        )}
        {error && (
          <p className="bg-red-100 text-red-700 border border-red-400 rounded px-4 py-2 mt-4 text-center  ">
            {error}
          </p>
        )}
      </div>

  );
};

export default OperatorResetPassword;
