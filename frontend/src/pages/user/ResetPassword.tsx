import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResetPassword } from "../../hooks/useResetPassword";
import ReUsableForm from "../../components/forms/ReUsableForm";
import { userResetPasswordfields } from "../../formConfig/fields";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";

export const ResetPassword = () => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>();
  const { resetUserPassword, loading } = useResetPassword();
  const handleSubmit = async (formData: any) => {
    setMessage(null);
    setError(null);
    const { newPassword, confirmPassword } = formData;
    if (newPassword !== confirmPassword) {
      setError(FEEDBACK_MESSAGES.AUTH.ERROR.PASSWORD_DONT_MATCH);
      return;
    }

    try {
      await resetUserPassword(token as string, newPassword);
      setMessage(FEEDBACK_MESSAGES.AUTH.SUCCESS.PASSWORD_REDIRECTING);
      setTimeout(() => navigate(`/user/login`), 2000);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);

        return;
      }
      setError(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-5">
    
      <ReUsableForm
      heading="Reset Password"
        formData={formData}
        setFormData={setFormData}
        fields={userResetPasswordfields}
        onSubmit={handleSubmit}
        loading={loading}
        buttonText="Reset Password"
        fieldError={fieldError}
        setFieldError={setFieldError}
      />
      {message && (
        <p className="bg-green-100 text-green-700 border border-green-400 rounded px-4 py-2 mt-4 text-center ">
          {message}
        </p>
      )}
      {error && (
        <p className="bg-red-100 text-red-700 border border-red-400 rounded px-4 py-2 mt-4 text-center ">
          {error}
        </p>
      )}
    </div>
  );
};
