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
    <div className="flex items-center justify-center  min-h-screen">
      <div className="w-full ">
        <ReusableForm
          heading="Admin Login"
          formData={formData}
          setFormData={setFormData}
          fields={adminLoginFields}
          loading={loading}
          buttonText="Log In"
          onSubmit={adminLogin}
          fieldError={fieldError}
          setFieldError={setFieldError}
        />
      </div>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
};

export default AdminLogin;
