import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useOperatorLogin } from "../../hooks/useOperatorLogin";
import { operatorLoginFields } from "../../formConfig/fields";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import ReusableForm from "../../components/forms/ReUsableForm";
import { useState } from "react";

const OperatorLogin = () => {
    const [formData, setFormData] = useState<Record<string, any>>({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login, fieldError, setFieldError } = useOperatorLogin(
    dispatch,
    navigate,
  );
  const { loading } = useSelector((state: RootState) => state.operator);

  return (
    <div className="flex items-center justify-center min-h-screen">
    <div className="w-full max-w-lg">
       <ReusableForm
      heading="Operator Login"
          formData={formData}
       setFormData={setFormData}
        fields={operatorLoginFields}
        onSubmit={login}
        loading={loading}
        buttonText="Log In"
        fieldError={fieldError}
        setFieldError={setFieldError}
      />

      <div className="flex justify-between items-center mt-4">
        <a
          href="/operator/forgot-password"
          className="text-sm text-sky-500 hover:underline"
        >
          Forgot Password?
        </a>
        <p>
          New Operator?
          <a href="/operator/register" className="text-sky-700 ml-3">
            Register
          </a>
        </p>
      </div>
    </div>
     
    </div>
  );
};
export default OperatorLogin;
