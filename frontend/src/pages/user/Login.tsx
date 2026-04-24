import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import ReUsableForm from "../../components/forms/ReUsableForm";
import { useLogin } from "../../hooks/useLogin";
const mockFields = [
  {
    id: "username",
    type: "text",
    label: "Username",
    placeholder: "Enter your username",
  },
  {
    id: "role",
    type: "select",
    label: "Account Type",
    options: [
      { label: "Admin", value: "admin" },
      { label: "Editor", value: "editor" },
      { label: "Viewer", value: "viewer" },
    ],
  },
  {
    id: "role2",
    type: "select",
    label: "Account Type",
    multiple: true,
    options: [
      { label: "Admin", value: "admin" },
      { label: "Editor", value: "editor" },
      { label: "Viewer", value: "viewer" },
    ],
  },
  {
    id: "profile_pic",
    type: "file",
    label: "Profile Picture",
    multiple: false,
  },
  {
    id: "gallery",
    type: "file",
    label: "Project Gallery (Multiple)",
    multiple: true,
  },
  {
    id: "bio",
    type: "textarea", // Note: You'll need to ensure your JSX handles 'textarea'
    label: "Biography",
    placeholder: "Tell us about yourself...",
  },
  {
    id: "notifications",
    type: "checkbox",
    label: "Subscribe to newsletter",
  },
  {
    id: "dark_mode",
    type: "checkbox",
    label: "Enable Dark Mode",
    disabled: true, // Testing the disabled state
  },
];

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.user);
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
        fields={mockFields}
        onSubmit={loginHandler}
        loading={loading}
        buttonText="Log In"
      />
    </div>
  );
};

export default Login;
