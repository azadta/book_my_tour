import { useParams, useNavigate } from "react-router-dom";
import { useAdminOperatorActions } from "../../hooks/useAdminOperatorActions";
import { useEffect, useState } from "react";
import { adminUpdateOperatorFields } from "../../formConfig/fields";
import ReusableForm from "../../components/forms/ReUsableForm";
import ConfirmationModal from "../../components/ConfirmationModal";
import { unFlattenObject } from "../../../../backend/utils/unFlattenObject";
import { toast } from "react-toastify";
import BackToDashboard from "../../components/BackToDashboard";

const EditOperator = () => {
  const { id } = useParams<{ id: string }>();
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const {
    fetchOperator,
    blockOperator,
    deleteOperator,
    loading,
    updateOperator,
  } = useAdminOperatorActions();
  const [formData, setFormData] = useState<any>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState<() => void>(() => () => {});
  useEffect(() => {
    const getOperator = async () => {
      if (!id) return;
      try {
        const data = await fetchOperator(id);
        setFormData(data);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to fetching operators",
        );
      }
    };
    getOperator();
  }, [id, fetchOperator]);

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

     const result= await updateOperator(id, nestedData);
      navigate('/admin/operators')
      toast.success("Operator updated successfully");
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);
        return;
      }
      toast.error(error.response?.data?.message || "Failed to update operator");
    }
  };

  const handleBlockToggle = () => {
    if (!id) return;
    try {
      setModalMessage(
        formData.isBlocked ? "Unblock this operator?" : "Block this operator?",
      );
      setModalAction(() => async () => {
        await blockOperator(id, !formData.isBlocked);
        navigate("/admin/operators");
      });
      setModalOpen(true);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to uddate operator block status",
      );
    }
  };

  const handleDelete = () => {
    if (!id) return;
    try {
      setModalMessage("Are you sure want to delete this operator?");
      setModalAction(() => async () => {
        await deleteOperator(id);
        navigate("/admin/operators");
      });
      setModalOpen(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error deleting operator");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
        <BackToDashboard path='/admin/dashboard'/>
      <h2 className="text-2xl font-bold text-center mb-6">Edit Operator</h2>
      <ReusableForm
        fields={adminUpdateOperatorFields}
        onSubmit={handleFormSubmit}
        loading={loading}
        buttonText="Update Operator"
        initialData={formData}
        fieldError={fieldError}
        setFieldError={setFieldError}
      />
      <div className="flex gap-4 mt-4 justify-end">
        <button
          onClick={handleBlockToggle}
          className={`px-4 py-2 text-white rounded ${
            formData.isBlocked ? "bg-green-500" : "bg-yellow-500"
          }`}
        >
          {formData.isBlocked ? "unblock" : "block"}
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Delete
        </button>
      </div>
      <ConfirmationModal
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

export default EditOperator;
