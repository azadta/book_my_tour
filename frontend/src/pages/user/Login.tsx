import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import ReUsableForm from "../../components/forms/ReUsableForm";
import { useLogin } from "../../hooks/useLogin";
import { useGoogleLogin } from "../../hooks/useGoogleLogin";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.user);
  const handleGoogleLogin = useGoogleLogin(dispatch, navigate);
  const loginHandler = useLogin(dispatch, navigate);
  const fields = [
    { id: "email", type: "email", placeholder: "Email", label: "Email" },
    {
      id: "password",
      type: "password",
      placeholder: "Password",
      label: "Password",
    },
  ];
  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className="text-3xl text-center font-semibold my-3">Log In</h1>
      <ReUsableForm
        fields={fields}
        onSubmit={loginHandler}
        loading={loading}
        buttonText="Log In"
      />
      <button
        onClick={handleGoogleLogin}
        type="button"
        className="w-full bg-white border border-gray-300 text-gray-700 flex items-center justify-center gap-3 py-2 px-4 mt-2 rounded-lg shadow-sm hover:bg-gray-50 transition-all hover:cursor-pointer  "
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          className="w-6 h-6"
        />
        <span className="text-sm font-medium">Continue with Google</span>
      </button>

      <div className="flex justify-between items-center mt-4">
        <a
          href="/user/forgot-password"
          className="text-blue-500 hover:underline"
        >
          Forgot Password?
        </a>
        <p>
          Don't have an account?{" "}
          <a href="/user/register" className="text-blue-700 ml-3">
            Register
          </a>
        </p>
      </div>
      {error && <p className="text-red-500 mt-6 text-center">{error}</p>}
    </div>
  );
};

export default Login;
