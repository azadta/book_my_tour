import { useNavigate } from "react-router-dom";
import { useRegister } from "../../hooks/useRegister";
import { toast } from "react-toastify";
import ReUsableForm from "../../components/forms/ReUsableForm";
import { userRegisterfields } from "../../formConfig/fields";

const Register = () => {
  const { registerUser,  loading,fieldError,setFieldError } = useRegister();
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
    <div className="p-3 max-w-2xl mx-auto">
      <h1 className="text-3xl text-center font-semibold mb-7   ">
        Register
      </h1>
      <ReUsableForm
        fields={userRegisterfields}
        onSubmit={handleSubmit}
        loading={loading}
        buttonText="Register"
        fieldError={fieldError}
        setFieldError={setFieldError}
      />
      <p className="text-end">
          Already have an account?{" "}
          <a href="/user/login" className="text-sky-500 ml-3">
            Login
          </a>
        </p>

    </div>
  );
};

export default Register;
