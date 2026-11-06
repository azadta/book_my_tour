import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { unFlattenObject } from "../../../../backend/utils/unFlattenObject";
import ConfirmationModal from "../../components/ConfirmationModal";
import ReusableForm from "../../components/forms/ReUsableForm";
import { adminUpdateOperatorFields } from "../../formConfig/fields";
import { useAdminOperatorActions } from "../../hooks/useAdminOperatorActions";
import { handleApiError } from "@/utils/axiosErrorHandler";
import type { IOperator } from "@/interfaces/IOperator";


const EditOperator = () => {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
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
  const [data, setData] = useState<IOperator | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState<() => void>(() => () => {});
  useEffect(() => {
    const getOperator = async () => {
      if (!id) return;
      try {
        const data = await fetchOperator(id);
        setData(data);
      } catch (error) {
        handleApiError(error, { setFieldError });
      }
    };
    getOperator();
  }, [id, fetchOperator]);

  const handleFormSubmit = async (data: Record<string, unknown>) => {
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
    } catch (error) {
      handleApiError(error, { setFieldError });
    }
  };

  const handleBlockToggle = () => {
    if (!id) return;
    try {
      setModalMessage(
        data?.isBlocked ? "Unblock this operator?" : "Block this operator?",
      );
      setModalAction(() => async () => {
        await blockOperator(id, !data?.isBlocked);
        navigate(FRONTEND_ROUTES.ADMIN.OPERATORS);
      });
      setModalOpen(true);
    } catch (error) {
      handleApiError(error, { setFieldError });
    }
  };

  const handleDelete = () => {
    if (!id) return;
    try {
      setModalMessage("Are you sure want to delete this operator?");
      setModalAction(() => async () => {
        await deleteOperator(id);
        navigate(FRONTEND_ROUTES.ADMIN.OPERATORS);
      });
      setModalOpen(true);
    } catch (error) {
      handleApiError(error, { setFieldError });
    }
  };

  return (
    <div className="py-6 max-w-2xl mx-auto">
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
            data?.isBlocked ? "bg-green-500" : "bg-yellow-500"
          }`}
        >
          {data?.isBlocked ? "unblock" : "block"}
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
