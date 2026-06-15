import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import ReusableForm from "../../components/forms/ReUsableForm.js";

import type { RootState } from "../../redux/store";

import { adminLoginFields } from "../../formConfig/fields.js";
import { useAdminLogin } from "../../hooks/useAdminLogin.js";
import { useState } from "react";

const AdminLogin = () => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.admin);

  const { adminLogin, fieldError, setFieldError } = useAdminLogin(
    dispatch,
    navigate,
  );

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="p-6 max-w-lg w-full bg-white runded-lg shadow-md">
        <h1 className="text-3xl text-center font-semibold my-7">
          Admin Log In
        </h1>
        <ReusableForm
          formData={formData}
          setFormData={setFormData}
          fields={adminLoginFields}
          loading={loading}
          buttonText="Log In"
          onSubmit={adminLogin}
          fieldError={fieldError}
          setFieldError={setFieldError}
        />
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default AdminLogin;
