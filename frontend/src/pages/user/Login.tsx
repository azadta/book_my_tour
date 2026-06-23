import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import ReUsableForm from "../../components/forms/ReUsableForm";
import { useLogin } from "../../hooks/useLogin";
import { useGoogleLogin } from "../../hooks/useGoogleLogin";
import { userLoginfields } from "../../formConfig/fields";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
    const [formData, setFormData] = useState<Record<string, any>>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.user);
  const handleGoogleLogin = useGoogleLogin(dispatch, navigate);
  const { login, fieldError, setFieldError } = useLogin(dispatch, navigate);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="p-3 max-w-lg mx-auto ">
   

      <ReUsableForm
      heading="Login"
         formData={formData}
          setFormData={setFormData}
        fields={userLoginfields}
        onSubmit={login}
        loading={loading}
        buttonText="Log In"
        fieldError={fieldError}
        setFieldError={setFieldError}
      />

      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:items-center mt-4">
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

      <button
        onClick={handleGoogleLogin}
        type="button"
        className="mx-auto flex gap-1 items-center mt-5 hover:cursor-pointer px-5 py-3 border border-sky-400  rounded-full "
      >
        <FcGoogle className="bg-sky-50 text-xl" />
        <span className="text-sm font-medium ">Sign in with Google</span>
      </button>
    </div>
  );
};

export default Login;
