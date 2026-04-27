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
import {ProfileForm} from "../../components/forms/ProfileForm.js";
import type { RootState } from "../../redux/store.js";

interface FormDataType {
  [key: string]: any;
}

const AdminProfile = () => {
  const { currentAdmin, error, loading } = useSelector(
    (state: RootState) => state.admin
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
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { post, del } = useApi();
  const fileRef = useRef<HTMLInputElement>(null);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const imgData = await res.json();
      await post("/admin/update-profile-image", { image: imgData.secure_url });
      dispatch(
        updateAdminSuccess({ ...currentAdmin!, image: imgData.secure_url })
      );
    } catch (error: any) {
      console.error("Cloudinary upload Error", error);
      dispatch(
        updateAdminFailure(error.response?.data?.message || error.message)
      );
    } finally {
      setImageUploading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      dispatch(updateAdminStart());
      const updatedAdmin = await post(
        `/admin/update/${currentAdmin?._id}`,
        formData
      );

      dispatch(updateAdminSuccess(updatedAdmin));

      setUpdateSuccess(true);
    } catch (error: any) {
      dispatch(
        updateAdminFailure(error.response?.data?.message || error.message)
      );
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
        adminLogoutFailure(error.response?.data?.message || error.message)
      );
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
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7  text-green-500">
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
      />
      <div className="flex justify-between mt-5">
        <span onClick={handleLogOut} className="text-red-700 cursor-pointer">
          Log Out
        </span>
        <span
          onClick={() => navigate("/admin/reset-password")}
          className="text-blue-700 cursor-pointer"
        >
          Reset Password
        </span>
      </div>
      <p className="text-red-700 mt-5">{error}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "Admin updated successfully" : ""}
      </p>
    </div>
  );
};

export default AdminProfile;
