import { useState } from "react";
import { useAuthenticatedPasswordReset } from "../../hooks/useAuthenticatedPasswordReset";
import { useNavigate } from "react-router-dom";
import ReusableForm from "../../components/forms/ReUsableForm";
import { resetAuthenticatedPasswordFields } from "../../formConfig/fields";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { handleApiError } from "@/utils/axiosErrorHandler";

const AdminResetPasswordAuthenticated: React.FC = () => {
  const [formData, setFormData] = useState<{
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { currentAdmin } = useSelector((state: RootState) => state.admin);
  const adminId = currentAdmin?._id ?? "";
  const endPoint: string = APP_ROUTES.ADMINS.RESET_PASSWORD_AUTH(adminId);
  const { resetPassword, loading } = useAuthenticatedPasswordReset(endPoint);
  const navigate = useNavigate();

  const handleSubmit = async (formData: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setError(null);
    setMessage(null);

    try {
      await resetPassword(formData);
      setMessage(FEEDBACK_MESSAGES.AUTH.SUCCESS.PASSWORD_UPDATE);
      setTimeout(() => navigate(FRONTEND_ROUTES.ADMIN.PROFILE), 2000);
    } catch (error) {
      const errorMessage = handleApiError(error, { setFieldError });
      if (errorMessage) setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 ">
      <div className="w-full max-w-xl">
        <ReusableForm
          heading="Change Password"
          formData={formData}
          setFormData={setFormData}
          fields={resetAuthenticatedPasswordFields}
          buttonText="Update Password"
          loading={loading}
          onSubmit={handleSubmit}
          fieldError={fieldError}
          setFieldError={setFieldError}
        />
        {message && (
          <p className="bg-green-100 text-green-700 border border-green-400 rounded px-4 py-2 mt-4 text-center">
            {message}
          </p>
        )}
        {error && (
          <p className="bg-red-100 text-red-700 border border-red-400 rounded px-4 py-2 mt-4 text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminResetPasswordAuthenticated;
