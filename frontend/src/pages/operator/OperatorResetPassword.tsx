import { useParams, useNavigate } from "react-router-dom";
import { useOperatorResetPassword } from "../../hooks/useOperatorResetPassword";
import ReusableForm from "../../components/forms/ReUsableForm";
import { OperatorResetPasswordFields } from "../../formConfig/fields";
import { useState } from "react";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";

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
      setTimeout(() => navigate("/operator/login"), 2000);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);

        return;
      }
      setError(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-xl">
     
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
    </div>
  );
};

export default OperatorResetPassword;
