import { useNavigate } from "react-router-dom";
import { useOperatorRegister } from "../../hooks/useOperatorRegister.ts";
import ReusableForm from "../../components/forms/ReUsableForm.tsx";
import { operatorRegisterFields } from "../../formConfig/fields.ts";
import { toast } from "react-toastify";
import { useState } from "react";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages.ts";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes.ts";

const OperatorRegister = () => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const navigate = useNavigate();
  const { registerOperator, loading, error, fieldError, setFieldError } =
    useOperatorRegister();
  if (error) {
    toast.error(error);
  }
  const handleSubmit = (formData: any) => {
    if (formData.password !== formData.confirmPassword) {
      toast.error(FEEDBACK_MESSAGES.AUTH.ERROR.PASSWORD_DONT_MATCH);
      return;
    }
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...operatorData } = formData;

    registerOperator(operatorData, (operatorId, otpExpire) => {
      toast.info(FEEDBACK_MESSAGES.AUTH.SUCCESS.OTP_SENT);
      navigate(
        `${FRONTEND_ROUTES.OPERATOR.OTP_VERIFICATION(operatorId)}?otpExpire=${otpExpire}`,
      );
    });
  };

  return (
    <div className="p-3 max-w-2xl mx-auto mb-10">
      <ReusableForm
        heading="Operator Register"
        formData={formData}
        setFormData={setFormData}
        buttonText="Register Operator"
        fields={operatorRegisterFields}
        loading={loading}
        onSubmit={handleSubmit}
        fieldError={fieldError}
        setFieldError={setFieldError}
      />
      <p className="text-end pt-5">
        Already have an account?
        <a href={FRONTEND_ROUTES.OPERATOR.LOGIN} className="text-sky-700 ml-3 ">
          Login
        </a>
      </p>
    </div>
  );
};

export default OperatorRegister;
