import { useNavigate } from "react-router-dom";
import { useRegister } from "../../hooks/useRegister";
import { toast } from "react-toastify";
import ReUsableForm from "../../components/forms/ReUsableForm";
import { userRegisterfields } from "../../formConfig/fields";
import { useEffect, useState } from "react";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";

const Register = () => {
    const [formData, setFormData] = useState<Record<string, any>>({});
  const { registerUser, loading, fieldError, setFieldError } = useRegister();
  const navigate = useNavigate();

  const handleSubmit = (formData: {
    password: string;
    confirmPassword: string;
  }) => {
    if (formData.password !== formData.confirmPassword) {
      toast.error(FEEDBACK_MESSAGES.AUTH.ERROR.PASSWORD_DONT_MATCH);
      return;
    }

    registerUser(formData, (userId, otpExpire) => {
      navigate(`/user/verify-otp/${userId}/?otpExpire=${otpExpire}`);
      toast.info(FEEDBACK_MESSAGES.AUTH.SUCCESS.OTP_SENT);
    });
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="p-3 max-w-lg mx-auto pb-10 pt-10">

      <ReUsableForm
       heading="Register"
           formData={formData}
          setFormData={setFormData}
        fields={userRegisterfields}
        onSubmit={handleSubmit}
        loading={loading}
        buttonText="Register"
        fieldError={fieldError}
        setFieldError={setFieldError}
      />
      <p className="mt-2 font-semibold">
        Already have an account?{" "}
        <a href="/user/login" className=" text-md ml-3 font-bold">
          Login
        </a>
      </p>
    </div>
  );
};

export default Register;
