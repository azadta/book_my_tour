import { useState } from "react";
import { useAuthenticatedPasswordReset } from "../../hooks/useAuthenticatedPasswordReset";
import { useNavigate } from "react-router-dom";
import ReUsableForm from "../../components/forms/ReUsableForm";
import { resetAuthenticatedPasswordFields } from "../../formConfig/fields";
import { toast } from "react-toastify";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";

const ResetPasswordAuthenticated = () => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const [fieldError, setFieldError] = useState<Record<string, string>>({});

  const endPoint = "/user/reset-password-authenticated";
  const { resetPassword, loading } = useAuthenticatedPasswordReset(endPoint);
  const navigate = useNavigate();

  const handleSubmit = async (formData: any) => {
    const { oldPassword, newPassword, confirmPassword } = formData;
    try {
      await resetPassword(oldPassword, newPassword, confirmPassword);
      toast.success(FEEDBACK_MESSAGES.AUTH.SUCCESS.PASSWORD_UPDATE);
      navigate(`/user/profile`);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);

        return;
      }
      toast.error(error.response?.data?.message || FEEDBACK_MESSAGES.AUTH.ERROR.PASSWORD_RESET);
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
