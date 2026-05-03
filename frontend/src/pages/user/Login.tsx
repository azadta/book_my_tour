import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import ReUsableForm from "../../components/forms/ReUsableForm";
import { useLogin } from "../../hooks/useLogin";
import { useGoogleLogin } from "../../hooks/useGoogleLogin";
import { userLoginfields } from "../../formConfig/fields";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.user);
  const handleGoogleLogin = useGoogleLogin(dispatch, navigate);
  const { login, fieldError, setFieldError } = useLogin(dispatch, navigate);

  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className="text-3xl text-center font-semibold my-3">Log In</h1>

      <ReUsableForm
        fields={userLoginfields}
        onSubmit={login}
        loading={loading}
        buttonText="Log In"
        fieldError={fieldError}
        setFieldError={setFieldError}
      />

      <button
        onClick={handleGoogleLogin}
        type="button"
        className="flex gap-1 items-center mt-5 hover:cursor-pointer bg-white"
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          className="size-4"
        />
        <span className="text-sm font-medium text-sky-500">
          Continue with Google
        </span>
      </button>

      <div className="flex justify-between items-center mt-4">
        <a
          href="/user/forgot-password"
          className="text-sky-500 hover:underline"
        >
          Forgot Password?
        </a>
        <p>
          Don't have an account?{" "}
          <a href="/user/register" className="text-sky-500 ml-3">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
