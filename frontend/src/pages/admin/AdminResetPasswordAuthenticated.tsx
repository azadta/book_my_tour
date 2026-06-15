import { useState } from "react";
import { useAuthenticatedPasswordReset } from "../../hooks/useAuthenticatedPasswordReset";
import { useNavigate } from "react-router-dom";
import ReusableForm from "../../components/forms/ReUsableForm";
import { resetAuthenticatedPasswordFields } from "../../formConfig/fields";

const AdminResetPasswordAuthenticated: React.FC = () => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const endPoint: string = "/admin/reset-password-authenticated";
  const { resetPassword, loading } = useAuthenticatedPasswordReset(endPoint);
  const navigate = useNavigate();

  const handleSubmit = async (formData: any) => {
    setError(null);
    setMessage(null);
    const { oldPassword, newPassword, confirmPassword } = formData;
    try {
      await resetPassword(oldPassword, newPassword, confirmPassword);
      setMessage("Password updated successfully");
      setTimeout(() => navigate("/admin/profile"), 2000);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);
        return;
      }
      setError(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 ">
      <div className="w-full max-w-xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Change Password
        </h2>
        <ReusableForm
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
