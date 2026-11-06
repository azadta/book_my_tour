import { useState } from "react";
import { useAuthenticatedPasswordReset } from "../../hooks/useAuthenticatedPasswordReset";
import { useNavigate } from "react-router-dom";
import ReUsableForm from "../../components/forms/ReUsableForm";
import { resetAuthenticatedPasswordFields } from "../../formConfig/fields";
import { toast } from "react-toastify";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";
import type { IResetPasswordAuthenticatedForm } from "@/interfaces/interfaces";
import { handleApiError } from "@/utils/axiosErrorHandler";

const ResetPasswordAuthenticated = () => {
  const [formData, setFormData] = useState<IResetPasswordAuthenticatedForm>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [fieldError, setFieldError] = useState<Record<string, string>>({});

  const endPoint = APP_ROUTES.USERS.USER.RESET_PASSWORD_AUTH;
  const { resetPassword, loading } = useAuthenticatedPasswordReset(endPoint);
  const navigate = useNavigate();

  const handleSubmit = async (formData: IResetPasswordAuthenticatedForm) => {
    try {
      await resetPassword(formData);
      toast.success(FEEDBACK_MESSAGES.AUTH.SUCCESS.PASSWORD_UPDATE);
      navigate(FRONTEND_ROUTES.USER.PROFILE);
    } catch (error) {
      handleApiError(error, { setFieldError });
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto py-10">
      <ReUsableForm
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
    </div>
  );
};

export default ResetPasswordAuthenticated;
