import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminProfileFields } from "../../formConfig/fields";

import {
  adminLogoutFailure,
  adminLogoutStart,
  adminLogoutSuccess,
  updateAdminFailure,
  updateAdminStart,
  updateAdminSuccess,
} from "../../redux/admin/adminSlice.js";

import { APP_ROUTES } from "@/constants/AppRoutes.js";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages.js";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes.js";
import { toast } from "react-toastify";
import { ProfileForm } from "../../components/forms/ProfileForm.js";
import { useApi } from "../../hooks/useApi.js";
import type { RootState } from "../../redux/store.js";
import { handleApiError } from "@/utils/axiosErrorHandler.js";

interface FormDataType {
  [key: string]: unknown;
}

const AdminProfile = () => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const { currentAdmin, loading } = useSelector(
    (state: RootState) => state.admin,
  );
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    mobile: "",

    address: {
      houseNo: "",
      landmark: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  });

  const [imageUploading, setImageUploading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { post, del } = useApi();
  const fileRef = useRef<HTMLInputElement>(null);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    if (id.includes(".")) {
      const [parent, child] = id.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent] || {}),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setImageUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    );
    try {
      const res = await fetch(
        APP_ROUTES.EXTERNAL.CLOUDINARY(
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        ),
        {
          method: "POST",
          body: formData,
        },
      );
      const imgData = await res.json();
      await post(APP_ROUTES.ADMINS.UPDATE_IMAGE, { image: imgData.secure_url });
      dispatch(
        updateAdminSuccess({ ...currentAdmin!, image: imgData.secure_url }),
      );
      toast.success(FEEDBACK_MESSAGES.MEDIA.SUCCESSS.UPLOAD);
    } catch (error) {
      const errorMessage = handleApiError(error, { setFieldError });
      if (errorMessage) dispatch(updateAdminFailure(errorMessage));
    } finally {
      setImageUploading(false);
    }
  };
  const handleSubmit = async () => {
    try {
      dispatch(updateAdminStart());
      const data = await post(
        APP_ROUTES.ADMINS.UPDATE(currentAdmin?._id as string),
        formData,
      );
      dispatch(updateAdminSuccess(data));
      toast.success(FEEDBACK_MESSAGES.ADMIN.SUCCESS.UPDATE);
    } catch (error) {
      const errorMessage = handleApiError(error, { setFieldError });
      if (errorMessage) dispatch(updateAdminFailure(errorMessage));
    }
  };

  const handleLogOut = async () => {
    try {
      dispatch(adminLogoutStart());
      await del(APP_ROUTES.ADMINS.LOGOUT);
      dispatch(adminLogoutSuccess());
      navigate(FRONTEND_ROUTES.ADMIN.LOGIN, { replace: true });
    } catch (error) {
      const errorMessage = handleApiError(error, { setFieldError });
      if (errorMessage) dispatch(adminLogoutFailure(errorMessage));
    }
  };

  useEffect(() => {
    if (currentAdmin) {
      setFormData({
        name: currentAdmin?.name || "",

        email: currentAdmin?.email || "",
        mobile: currentAdmin?.mobile || "",
        image: currentAdmin?.image || "",

        address: {
          houseNo: currentAdmin?.address?.houseNo || "",
          landmark: currentAdmin?.address?.landmark || "",
          city: currentAdmin?.address?.city || "",
          state: currentAdmin?.address?.state || "",
          country: currentAdmin?.address?.country || "",
          postalCode: currentAdmin?.address?.postalCode || "",
        },
      });
    }
  }, [currentAdmin]);
  if (!currentAdmin) return;

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2  items-end py-10 ">
      <div className=" flex flex-col gap-5  w-38 justify-self-end">
        <button
          onClick={() => navigate(FRONTEND_ROUTES.ADMIN.RESET_PASSWORD_AUTH)}
          className="profile-sidebar-button"
        >
          Reset Password
        </button>

        <button onClick={handleLogOut} className="profile-sidebar-button">
          Log Out
        </button>
      </div>

      <div className="max-w-lg sm:max-w-2xl ">
        <ProfileForm
          currentUser={currentAdmin}
          formData={formData}
          setFormData={setFormData}
          fields={adminProfileFields}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          loading={loading}
          fileRef={fileRef}
          imageUploading={imageUploading}
          fieldError={fieldError}
          setFieldError={setFieldError}
        />
        <div className="sm:hidden pt-10">
          <div className="flex items-center justify-between">
            <button
              onClick={() =>
                navigate(FRONTEND_ROUTES.ADMIN.RESET_PASSWORD_AUTH)
              }
              className=" cursor-pointer bg-yellow-200 px-1 py-1 rounded hover:bg-yellow-300"
            >
              Reset Password
            </button>

            <button
              onClick={handleLogOut}
              className=" cursor-pointer bg-yellow-200 px-1 py-1 rounded hover:bg-yellow-300"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
