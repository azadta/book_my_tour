import { useParams, useNavigate } from "react-router-dom";
import { useAdminOperatorActions } from "../../hooks/useAdminOperatorActions";
import { useEffect, useState } from "react";
import { adminUpdateOperatorFields } from "../../formConfig/fields";
import ReusableForm from "../../components/forms/ReUsableForm";
import ConfirmationModal from "../../components/ConfirmationModal";
import { unFlattenObject } from "../../../../backend/utils/unFlattenObject";
import { toast } from "react-toastify";
import BackToDashboard from "../../components/BackToDashboard";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";

const EditOperator = () => {
  const [formData, setFormData] = useState<Record<string, any>>({});
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
  const [data, setData] = useState<any>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState<() => void>(() => () => {});
  useEffect(() => {
    const getOperator = async () => {
      if (!id) return;
      try {
        const data = await fetchOperator(id);
        setData(data);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || FEEDBACK_MESSAGES.OPERATOR.ERROR.FETCH,
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

      await updateOperator(id, nestedData);

      toast.success(FEEDBACK_MESSAGES.OPERATOR.SUCCESS.UPDATE);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);
        return;
      }
      toast.error(error.response?.data?.message || FEEDBACK_MESSAGES.OPERATOR.ERROR.UPDATE);
    }
  };

  const handleBlockToggle = () => {
    if (!id) return;
    try {
      setModalMessage(
        data.isBlocked ? "Unblock this operator?" : "Block this operator?",
      );
      setModalAction(() => async () => {
        await blockOperator(id, !data.isBlocked);
        navigate("/admin/operators");
      });
      setModalOpen(true);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          FEEDBACK_MESSAGES.OPERATOR.ERROR.UPDATE_BLOCK_STATUS,
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
      toast.error(error.response?.data?.message ||FEEDBACK_MESSAGES.OPERATOR.ERROR.DELETE);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-5">
        {" "}
        <BackToDashboard path="/admin/dashboard" />
      </div>

      <ReusableForm
        heading="Edit Operator"
        formData={formData}
        setFormData={setFormData}
        fields={adminUpdateOperatorFields}
        onSubmit={handleFormSubmit}
        loading={loading}
        buttonText="Update Operator"
        initialData={data}
        fieldError={fieldError}
        setFieldError={setFieldError}
      />
      <div className="flex gap-4 mt-4 justify-end">
        <button
          onClick={handleBlockToggle}
          className={`px-4 py-2 text-white rounded ${
            data.isBlocked ? "bg-green-500" : "bg-yellow-500"
          }`}
        >
          {data.isBlocked ? "unblock" : "block"}
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
