import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useOperatorLogin } from "../../hooks/useOperatorLogin";
import { operatorLoginFields } from "../../formConfig/fields";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import ReusableForm from "../../components/forms/ReUsableForm";

const OperatorLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {login,fieldError,setFieldError} = useOperatorLogin(dispatch, navigate);
  const { error, loading } = useSelector((state: RootState) => state.operator);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-3 mb-10 ">
        Operator Log In
      </h1>
      <ReusableForm
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
          className="text-sm text-blue-500 hover:underline"
        >
          Forgot Password?
        </a>
        <p>
          New Operator?
          <a href="/operator/register" className="text-blue-700 ml-3">
            Register
          </a>
        </p>
      </div>
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
};
export default OperatorLogin;
