import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResetPassword } from "../../hooks/useResetPassword";
import ReUsableForm from "../../components/forms/ReUsableForm";
import { userResetPasswordfields } from "../../formConfig/fields";

export const ResetPassword = () => {
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
      setError("Passwords do not match");
      return;
    }

    try {
      await resetUserPassword(token as string, newPassword);
      setMessage("Password updated! Redirecting...");
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
    <div className="w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 ">
        Reset Password
      </h2>
      <ReUsableForm
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
