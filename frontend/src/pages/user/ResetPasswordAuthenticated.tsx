import { useState } from "react";
import { useAuthenticatedPasswordReset } from "../../hooks/useAuthenticatedPasswordReset";
import { useNavigate } from "react-router-dom";
import ReUsableForm from "../../components/forms/ReUsableForm";
import { resetAuthenticatedPasswordFields } from "../../formConfig/fields";
import { toast } from "react-toastify";

const ResetPasswordAuthenticated = () => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});

  const endPoint = "/user/reset-password-authenticated";
  const { resetPassword, loading } = useAuthenticatedPasswordReset(endPoint);
  const navigate = useNavigate();

  const handleSubmit = async (formData: any) => {
    const { oldPassword, newPassword, confirmPassword } = formData;
    try {
      await resetPassword(oldPassword, newPassword, confirmPassword);
      toast.success("Password updated successfully");
      setTimeout(() => navigate(`/user/profile`), 2000);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);

        return;
      }
      toast.error(error.response?.data?.message || "Error reseting password");
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto py-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Change Password
      </h2>
      <ReUsableForm
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
