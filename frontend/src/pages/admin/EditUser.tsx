import { useNavigate, useParams } from "react-router-dom";
import { useAdminUserActions } from "../../hooks/useAdminUserActions";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { unFlattenObject } from "../../../../backend/utils/unFlattenObject";
import ReUsableForm from "../../components/forms/ReUsableForm";
import { adminUpdateUserFields } from "../../formConfig/fields";
import ConfirmationModel from "../../components/ConfirmationModal";

const EditUser = () => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchUser, blockUser, deleteUser, loading, updateUser } =
    useAdminUserActions();
  const [formData, setFormData] = useState<any>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState<() => void>(() => () => {});
  useEffect(() => {
    const getUser = async () => {
      if (!id) return;
      try {
        const data = await fetchUser(id);
        setFormData(data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || error.message);
      }
    };
    getUser();
  }, [id, fetchUser]);

  const handleFormSubmit = async (data: any) => {
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
      alert("User updated successfully");
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);
        return;
      }
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleBlockToggle = () => {
    if (!id) return;
    try {
      setModalMessage(
        formData.isBlocked ? "Unblock this user?" : "Block this user?",
      );
      setModalAction(() => async () => {
        await blockUser(id, !formData.isBlocked);

        navigate("/admin/users");
      });
      setModalOpen(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleDelete = () => {
    if (!id) return;
    try {
      setModalMessage("Are you sure want to delete this user?");
      setModalAction(() => async () => {
        await deleteUser(id);

        navigate("/admin/users");
      });
      setModalOpen(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Edit User</h2>
      <ReUsableForm
        fields={adminUpdateUserFields}
        onSubmit={handleFormSubmit}
        loading={loading}
        buttonText="Update User"
        initialData={formData}
        fieldError={fieldError}
        setFieldError={setFieldError}
      />
      <div className="flex gap-4 mt-4 justify-end">
        <button
          onClick={handleBlockToggle}
          className={`px-4 py-2 text-white rounded ${formData.isBlocked ? "bg-green-500" : "bg-yellow-500"}`}
        >
          {formData.isBlocked ? "unblock" : "block"}
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
