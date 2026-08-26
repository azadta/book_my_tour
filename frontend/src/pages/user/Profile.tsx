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
import ConfirmationModel from "../../components/ConfirmationModal";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";
import { disconnectSocket } from "@/socket/socket";
import { setActiveChat, setChats, setMessages } from "@/redux/chatSlice";

interface FormDataType {
  [key: string]: any;
}

const Profile = () => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const { currentUser, loading } = useSelector(
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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState<() => void>(() => () => {});
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
        APP_ROUTES.EXTERNAL.CLOUDINARY(
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        ),
        {
          method: "POST",
          body: formData,
        },
      );
      const imgData = await res.json();
      await post(APP_ROUTES.USER.UPDATE_IMAGE, { image: imgData.secure_url });
      dispatch(
        updateUserSuccess({ ...currentUser!, image: imgData.secure_url }),
      );
      toast.success(FEEDBACK_MESSAGES.MEDIA.SUCCESSS.UPLOAD);
    } catch (error: any) {
      console.error(FEEDBACK_MESSAGES.MEDIA.ERROR.CLOUDINARY, error);
      dispatch(
        updateUserFailure(error.response?.data?.message || error.message),
      );
      toast.error(
        error.response?.data?.message || FEEDBACK_MESSAGES.MEDIA.ERROR.UPLOAD,
      );
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      dispatch(updateUserStart());
      const updatedUser = await post(
        APP_ROUTES.USER.UPDATE(currentUser?._id as string),
        formData,
      );

      dispatch(updateUserSuccess(updatedUser));

      toast.success(FEEDBACK_MESSAGES.USER.SUCCESS.UPDATE);
    } catch (error: any) {
      dispatch(
        updateUserFailure(error.response?.data?.message || error.message),
      );
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);

        return;
      }
      toast.error(
        error.response?.data?.message || FEEDBACK_MESSAGES.USER.ERROR.UPDATE,
      );
    }
  };
  const deleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      await del(APP_ROUTES.USER.DELETE(currentUser?._id as string));
      dispatch(deleteUserSuccess());
      toast.success(FEEDBACK_MESSAGES.USER.SUCCESS.DELETE);
      navigate(FRONTEND_ROUTES.USER.HOME, { replace: true });
    } catch (error: any) {
      dispatch(
        deleteUserFailure(error.response?.data?.message || error.message),
      );
      toast.error(
        error.response?.data?.message || FEEDBACK_MESSAGES.USER.ERROR.DELETE,
      );
    }
  };
  const handleDeleteUser = async () => {
    setModalMessage("Are you sure to delete your account");
    setModalAction(() => async () => {
      await deleteUser();
      setModalOpen(false);
    });
    setModalOpen(true);
  };
  const handleLogOut = async () => {
    try {
      dispatch(logoutUserStart());
      await del(APP_ROUTES.USER.LOGOUT);
      disconnectSocket();
      dispatch(setActiveChat(null));
      dispatch(setMessages([]));
      dispatch(setChats([]));
      dispatch(logoutUserSuccess());
      navigate(FRONTEND_ROUTES.USER.LOGIN, { replace: true });
    } catch (error: any) {
      dispatch(
        logoutUserFailure(error.response?.data?.message || error.message),
      );
      toast.error(
        error.response?.data?.message || FEEDBACK_MESSAGES.USER.ERROR.LOGOUT,
      );
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
    <div className="flex flex-col sm:flex-row  justify-center gap-5  ">
      <div className="sm:max-w-[220px] bg-sky-100 shadow-2xl shadow-white w-full  max-sm:order-2 max-sm:hidden  ">
        <div className="sm:mt-15 flex flex-col gap-5  justify-center max-w-[150px] mx-auto max-sm:py-10">
          <button
            onClick={() => navigate(FRONTEND_ROUTES.USER.MY_BOOKINGS)}
            className="profile-sidebar-button"
          >
            My Bookings
          </button>

          <button
            onClick={() => navigate(FRONTEND_ROUTES.USER.WISHLIST)}
            className="profile-sidebar-button"
          >
            Wishlist
          </button>
          <button
            onClick={() => navigate(FRONTEND_ROUTES.USER.RESET_PASSWORD_AUTH)}
            className="profile-sidebar-button"
          >
            Reset Password
          </button>

          <button
            onClick={() => navigate(FRONTEND_ROUTES.USER.WALLET)}
            className="profile-sidebar-button"
          >
            My Wallet
          </button>
          <button onClick={handleDeleteUser} className="profile-sidebar-button">
            Delete Account
          </button>

          <button onClick={handleLogOut} className="profile-sidebar-button">
            Log Out
          </button>
        </div>
      </div>
      <div className="p-3 max-w-lg sm:max-w-2xl mx-auto mt-15   w-full max-sm:order-1  ">
        <ProfileForm
          currentUser={currentUser}
          formData={formData}
          setFormData={setFormData}
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
        <div className="sm:hidden pt-10 flex items-center justify-between">
          <button
            onClick={() => navigate(FRONTEND_ROUTES.USER.RESET_PASSWORD_AUTH)}
            className=" cursor-pointer bg-yellow-200 px-0.5 sm:px-1 py-1 rounded hover:bg-yellow-300"
          >
            Reset Password
          </button>
          <button
            onClick={handleDeleteUser}
            className=" cursor-pointer bg-red-300 px-0.5 sm:px-1 py-1 rounded hover:bg-red-400"
          >
            Delete Account
          </button>

          <button
            onClick={handleLogOut}
            className=" cursor-pointer bg-yellow-200 px-0.5 sm:px-1 py-1 rounded hover:bg-yellow-300"
          >
            Log Out
          </button>
        </div>
        <div className="flex justify-between mt-5"></div>
        <ConfirmationModel
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={() => {
            modalAction();
          }}
          message={modalMessage}
        />
      </div>
    </div>
  );
};

export default Profile;
