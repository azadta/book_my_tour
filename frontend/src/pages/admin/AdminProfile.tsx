import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminProfileFields } from "../../formConfig/fields.js";

import {
  updateAdminStart,
  updateAdminSuccess,
  updateAdminFailure,
  adminLogoutStart,
  adminLogoutSuccess,
  adminLogoutFailure,
} from "../../redux/admin/adminSlice.js";

import { useApi } from "../../hooks/useApi.js";
import { ProfileForm } from "../../components/forms/ProfileForm.js";
import type { RootState } from "../../redux/store.js";
import { toast } from "react-toastify";
import BackToDashboard from "../../components/BackToDashboard.js";

interface FormDataType {
  [key: string]: any;
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
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      const imgData = await res.json();
      await post("/admin/update-profile-image", { image: imgData.secure_url });
      dispatch(
        updateAdminSuccess({ ...currentAdmin!, image: imgData.secure_url }),
      );
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      console.error("Cloudinary upload Error", error);
      dispatch(
        updateAdminFailure(error.response?.data?.message || error.message),
      );
      toast.error(error.response?.data?.message || "Error uploading image");
    } finally {
      setImageUploading(false);
    }
  };
  const handleSubmit = async () => {
    try {
      dispatch(updateAdminStart());
      const updatedAdmin = await post(
        `/admin/update/${currentAdmin?._id}`,
        formData,
      );

      dispatch(updateAdminSuccess(updatedAdmin));
      toast.success("admin updated successfully");
    } catch (error: any) {
      dispatch(
        updateAdminFailure(error.response?.data?.message || error.message),
      );
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);

        return;
      }
      toast.error(error.response?.data?.message || "Error updating admin");
    }
  };

  const handleLogOut = async () => {
    try {
      dispatch(adminLogoutStart());
      await del("/admin/logout");
      dispatch(adminLogoutSuccess());
      navigate("/admin/login", { replace: true });
    } catch (error: any) {
      dispatch(
        adminLogoutFailure(error.response?.data?.message || error.message),
      );
      toast.error(error.response?.data?.message || "Error logout admin");
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

  return (
    <div className="flex   justify-center gap-5 ">
      <div className="sm:max-w-[220px] bg-white shadow-2xl w-full px-10 max-sm:order-2 max-sm:hidden  ">
        <div className="sm:mt-25 flex flex-col gap-5  justify-center max-w-[150px] mx-auto max-sm:py-10">
          <button
            onClick={() => navigate("/admin/reset-password")}
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

      <div className="p-3 max-w-lg sm:max-w-2xl mx-auto   w-full max-sm:order-1 ">
        <BackToDashboard path="/admin/dashboard" />
        <h1 className="text-2xl font-semibold text-center my-7  text-emerald-500">
          Admin Profile
        </h1>
        <ProfileForm
          currentUser={currentAdmin}
          formData={formData}
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
            onClick={() => navigate("/admin/reset-password")}
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
