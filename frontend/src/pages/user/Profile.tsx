import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  logoutUserStart,
  logoutUserSuccess,
  logoutUserFailure,
} from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { ProfileForm } from "../../components/forms/ProfileForm";
import { userFields } from "../../formConfig/fields";

interface FormDataType {
  [key: string]: any;
}

const Profile = () => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const { currentUser, loading, error } = useSelector(
    (state: RootState) => state.user,
  );
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    mobile: "",
    isPremium: false,
    isBlocked: false,
    coinsEarned: 0,
    referralCode: "",
    referredBy: "",
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
  const fileRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { post, del } = useApi();

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
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
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
      await post("/user/update-profile-image", { image: imgData.secure_url });
      dispatch(
        updateUserSuccess({ ...currentUser!, image: imgData.secure_url }),
      );
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      console.error("Cloudinary upload Error", error);
      dispatch(
        updateUserFailure(error.response?.data?.message || error.message),
      );
      toast.error(error.response?.data?.message || "Error uploading image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async () => {


    try {
      dispatch(updateUserStart());
      const updatedUser = await post(
        `/user/update/${currentUser?._id}`,
        formData,
      );

      dispatch(updateUserSuccess(updatedUser));

      toast.success("User updated successfully");
    } catch (error: any) {
      dispatch(
        updateUserFailure(error.response?.data?.message || error.message),
      );
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);

        return;
      }
      toast.error(error.response?.data?.message || "Error updating user");
    }
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      await del(`/user/delete/${currentUser?._id}`);
      dispatch(deleteUserSuccess());
      toast.success("Your account has been deleted successfully");
      navigate("/", { replace: true });
    } catch (error: any) {
      dispatch(
        deleteUserFailure(error.response?.data?.message || error.message),
      );
      toast.error(error.response?.data?.message || "Error deleting user");
    }
  };
  const handleLogOut = async () => {
    try {
      dispatch(logoutUserStart());
      await del("/user/logout");
      dispatch(logoutUserSuccess());
      navigate("/user/login", { replace: true });
    } catch (error: any) {
      dispatch(
        logoutUserFailure(error.response?.data?.message || error.message),
      );
      toast.error(error.response?.data?.message || "Error logout user");
    }
  };

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser?.name || "",

        email: currentUser?.email || "",
        mobile: currentUser?.mobile || "",
        image: currentUser?.image || "",
        isPremium: currentUser?.isPremium || false,
        isBlocked: currentUser?.isBlocked || false,
        coinsEarned: currentUser?.coinsEarned || 0,
        referralCode: currentUser?.referralCode || "",
        referredBy: currentUser?.referredBy || "",
        address: {
          houseNo: currentUser?.address?.houseNo || "",
          landmark: currentUser?.address?.landmark || "",
          city: currentUser?.address?.city || "",
          state: currentUser?.address?.state || "",
          country: currentUser?.address?.country || "",
          postalCode: currentUser?.address?.postalCode || "",
        },
      });
    }
  }, [currentUser]);

  return (
    <div className="p-3 max-w-2xl mx-auto mt-2 mb-10">
      <h1 className="text-3xl font-semibold text-center my-5 text-emerald-500">
        Profile
      </h1>
      <ProfileForm
        currentUser={currentUser}
        formData={formData}
        fields={userFields}
        handleChange={handleChange}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        loading={loading}
        fileRef={fileRef}
        imageUploading={imageUploading}
        fieldError={fieldError}
        setFieldError={setFieldError}
      />
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span
          onClick={() => navigate("/user/reset-password")}
          className="text-sky-700 cursor-pointer"
        >
          Reset Password
        </span>
        <span onClick={handleLogOut} className="text-blue-700 cursor-pointer">
          Log Out
        </span>
      </div>
    </div>
  );
};

export default Profile;
