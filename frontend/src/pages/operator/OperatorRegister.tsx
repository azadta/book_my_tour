import { useNavigate } from "react-router-dom";
import { useOperatorRegister } from "../../hooks/useOperatorRegister.ts";
import ReusableForm from "../../components/forms/ReUsableForm.tsx";
import { operatorRegisterFields } from "../../formConfig/fields.ts";
import { toast } from "react-toastify";

const OperatorRegister = () => {
  const navigate = useNavigate();
  const { registerOperator, loading, error } = useOperatorRegister();
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
    <div className="p-3 max-w-xl mx-auto">
      <h1 className="text-3xl font-semibold my-7 text-center">
        Operator Register
      </h1>
      <ReusableForm
        buttonText="Register Operator"
        fields={operatorRegisterFields}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default OperatorRegister;
