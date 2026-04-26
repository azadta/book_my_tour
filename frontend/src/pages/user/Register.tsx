import { useNavigate } from "react-router-dom";
import { useRegister } from "../../hooks/useRegister";
import { toast } from "react-toastify";
import ReUsableForm from "../../components/forms/ReUsableForm";
import { userRegisterfields } from "../../formConfig/fields";

const Register = () => {
  const { registerUser, error, loading } = useRegister();
  const navigate = useNavigate();

  const handleSubmit = (formData: {
    password: string;
    confirmPassword: string;
  }) => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    registerUser(formData, (userId, otpExpire) => {
      navigate(`/user/verify-otp/${userId}/?otpExpire=${otpExpire}`);
      toast.info("OTP has been sent to your registered email");
    });
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold mb-7  pt-10 ">
        Register
      </h1>
      <ReUsableForm
        fields={userRegisterfields}
        onSubmit={handleSubmit}
        loading={loading}
        buttonText="Register"
      />
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
};

export default Register;
