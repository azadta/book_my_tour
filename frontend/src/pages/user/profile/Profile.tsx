import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";
import type { IUser } from "@/interfaces/IUser";
import { setActiveChat, setChats, setMessages } from "@/redux/chatSlice";
import { disconnectSocket } from "@/socket/socket";
import { handleApiError } from "@/utils/axiosErrorHandler";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmationModel from "../../../components/ConfirmationModal";
import { ProfileForm } from "../../../components/forms/ProfileForm";
import { userFields } from "../../../formConfig/fields";
import { useApi } from "../../../hooks/useApi";
import type { RootState } from "../../../redux/store";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  logoutUserFailure,
  logoutUserStart,
  logoutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../../../redux/user/userSlice";
import { uploadImagesToS3 } from "@/utils/uploadImagesToS3";


interface FormDataType {
  [key: string]: unknown;
}

const getInitialFormData = (user: IUser | null): FormDataType => ({
  name: user?.name || "",

  email: user?.email || "",
  mobile: user?.mobile || "",
  image: user?.image || "",
  isPremium: user?.isPremium || false,
  isBlocked: user?.isBlocked || false,
  coinsEarned: user?.coinsEarned || 0,
  referralCode: user?.referralCode || "",
  referredBy: user?.referredBy || "",
  address: {
    houseNo: user?.address?.houseNo || "",
    landmark: user?.address?.landmark || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    country: user?.address?.country || "",
    postalCode: user?.address?.postalCode || "",
  },
});

const Profile = () => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const { currentUser, loading } = useSelector(
    (state: RootState) => state.user,
  );
  const [formData, setFormData] = useState<FormDataType>(() =>
    getInitialFormData(currentUser),
  );

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

    try {
      const [imageUrl] = await uploadImagesToS3([selectedFile], "avatars");
      if (!imageUrl) return;

      await post(APP_ROUTES.USERS.USER.UPDATE_IMAGE, {
        image: imageUrl,
      });
      dispatch(updateUserSuccess({ ...currentUser!, image: imageUrl }));
      toast.success(FEEDBACK_MESSAGES.MEDIA.SUCCESSS.UPLOAD);
    } catch (error) {
      const errorMessage = handleApiError(error, { setFieldError });
      if (errorMessage) dispatch(updateUserFailure(errorMessage));
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      dispatch(updateUserStart());
      const updatedUser = await post(
        APP_ROUTES.USERS.USER.UPDATE(currentUser?._id as string),
        formData,
      );

      dispatch(updateUserSuccess(updatedUser));

      toast.success(FEEDBACK_MESSAGES.USER.SUCCESS.UPDATE);
    } catch (error) {
      const errorMessage = handleApiError(error, { setFieldError });
      if (errorMessage) dispatch(updateUserFailure(errorMessage));
    }
  };
  const deleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      await del(APP_ROUTES.USERS.USER.DELETE(currentUser?._id as string));
      dispatch(deleteUserSuccess());
      toast.success(FEEDBACK_MESSAGES.USER.SUCCESS.DELETE);
      navigate(FRONTEND_ROUTES.USER.HOME, { replace: true });
    } catch (error) {
      const errorMessage = handleApiError(error, { setFieldError });
      if (errorMessage) dispatch(deleteUserFailure(errorMessage));
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
      await del(APP_ROUTES.USERS.USER.LOGOUT);
      disconnectSocket();
      dispatch(setActiveChat(null));
      dispatch(setMessages([]));
      dispatch(setChats([]));
      dispatch(logoutUserSuccess());
      navigate(FRONTEND_ROUTES.USER.LOGIN, { replace: true });
    } catch (error) {
      const errorMessage = handleApiError(error, { setFieldError });
      if (errorMessage) dispatch(logoutUserFailure(errorMessage));
    }
  };

  if (!currentUser) return;

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
      <div className="p-3 max-w-lg sm:max-w-2xl mx-auto mt-5   w-full max-sm:order-1  ">
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
