import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { unFlattenObject } from "../../../../backend/utils/unFlattenObject";
import ConfirmationModel from "../../components/ConfirmationModal";
import ReUsableForm from "../../components/forms/ReUsableForm";
import { adminUpdateUserFields } from "../../formConfig/fields";
import { useAdminUserActions } from "../../hooks/useAdminUserActions";

import { handleApiError } from "@/utils/axiosErrorHandler";
import type { IUser } from "@/interfaces/IUser";

const EditUser = () => {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchUser, blockUser, deleteUser, loading, updateUser } =
    useAdminUserActions();
  const [data, setData] = useState<IUser|null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState<() => void>(() => () => {});
  useEffect(() => {
    const getUser = async () => {
      if (!id) return;
      try {
        const data = await fetchUser(id);
        setData(data);
      } catch (error:unknown) {
        handleApiError(error,{setFieldError})
      }
    };
    getUser();
  }, [id, fetchUser]);

  const handleFormSubmit = async (data: Record<string,unknown>) => {
    if (!id) return;
    try {
      const booleanFields = [
        "isBlocked",
        "isEmailVerified",
        "isPremium",
        "isVerified",
      ];
      for (const key of booleanFields) {
        if (data[key] === "true") data[key] = true;
        else if (data[key] === "false") data[key] = false;
      }
      const nestedData = unFlattenObject(data);

      await updateUser(id, nestedData);

      toast.success(FEEDBACK_MESSAGES.USER.SUCCESS.UPDATE);
    } catch (error:unknown) {
      handleApiError(error,{setFieldError})
    }
  };

  const handleBlockToggle = () => {
    if (!id) return;
    try {
      setModalMessage(
        data?.isBlocked ? "Unblock this user?" : "Block this user?",
      );
      setModalAction(() => async () => {
        await blockUser(id, !data?.isBlocked);

        navigate(FRONTEND_ROUTES.ADMIN.USERS);
      });
      setModalOpen(true);
    } catch (error:unknown) {
     handleApiError(error,{setFieldError})
    }
  };

  const handleDelete = () => {
    if (!id) return;
    try {
      setModalMessage("Are you sure want to delete this user?");
      setModalAction(() => async () => {
        await deleteUser(id);

        navigate(FRONTEND_ROUTES.ADMIN.USERS);
      });
      setModalOpen(true);
    } catch (error:unknown) {
       handleApiError(error,{setFieldError})
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <ReUsableForm
        heading="Edit User"
        formData={formData}
        setFormData={setFormData}
        fields={adminUpdateUserFields}
        onSubmit={handleFormSubmit}
        loading={loading}
        buttonText="Update User"
        initialData={data}
        fieldError={fieldError}
        setFieldError={setFieldError}
      />
      <div className="flex gap-4 mt-4 justify-end">
        <button
          onClick={handleBlockToggle}
          className={`px-4 py-2 text-white rounded ${data?.isBlocked ? "bg-green-500" : "bg-yellow-500"}`}
        >
          {data?.isBlocked ? "unblock" : "block"}
        </button>
        <button
          onClick={handleDelete}
          className={`px-4 py-2 bg-red-600 text-white rounded`}
        >
          Delete
        </button>
      </div>
      <ConfirmationModel
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          modalAction();
          setModalOpen(false);
        }}
        message={modalMessage}
      />
    </div>
  );
};

export default EditUser;
