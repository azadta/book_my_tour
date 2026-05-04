import { useNavigate } from "react-router-dom";
import { useOperatorRegister } from "../../hooks/useOperatorRegister.ts";
import ReusableForm from "../../components/forms/ReUsableForm.tsx";
import { operatorRegisterFields } from "../../formConfig/fields.ts";
import { toast } from "react-toastify";

const OperatorRegister = () => {
  const navigate = useNavigate();
  const { registerOperator, loading, error, fieldError, setFieldError } =
    useOperatorRegister();
  if (error) {
    toast.error(error);
  }
  const handleSubmit = (formData: any) => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const { confirmPassword, ...operatorData } = formData;

    registerOperator(operatorData, (operatorId, otpExpire) => {
      toast.info("OTP has been sent to your registered email");
      navigate(
        `/operator/otp-verification/${operatorId}?otpExpire=${otpExpire}`,
      );
    });
  };

  return (
    <div className="p-3 max-w-2xl mx-auto mb-10">
      <h1 className="text-3xl font-semibold my-7 text-center">
        Operator Register
      </h1>
      <ReusableForm
        buttonText="Register Operator"
        fields={operatorRegisterFields}
        loading={loading}
        onSubmit={handleSubmit}
        fieldError={fieldError}
        setFieldError={setFieldError}
      />
             <p className="text-end">
          Already  have an account?
          <a href="/operator/login" className="text-sky-700 ml-3 ">
            Login
          </a>
        </p>
    </div>
  );
};

export default OperatorRegister;
