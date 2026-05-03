import BackToDashBoard from "../../components/BackToDashboard";
import ReUsableTable from "../../components/ReUsableTable";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useAdminOperatorManagement } from "../../hooks/useAdminOperatorManagement";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { IOperator } from "../../redux/operator/operatorSlice";
import Pagination from "../../components/Pagination";

const AdminOperatorDetails: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const resultPerPage = 5;
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState<() => void>(() => () => {});
  const [operatorId, setOperatorId] = useState("");
  const { operators, loading, blockOperator, deleteOperator, totalCount } =
    useAdminOperatorManagement(currentPage, resultPerPage);
  const totalPages = Math.ceil(totalCount / resultPerPage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleGetSingleOperator = () => {
    if (operatorId.trim()) {
      navigate(`/admin/edit-operator/${operatorId.trim()}`);
    }
  };

  const columns = [
    { label: "Operator ID", render: (op: IOperator) => op._id },
    { label: "Name", render: (op: IOperator) => op.name },
    { label: "Email", render: (op: IOperator) => op.email },
    { label: "Mobile", render: (op: IOperator) => op.mobile },
    {
      label: "Premium",
      render: (op: IOperator) => (op.isPremium ? "Yes" : "No"),
    },
    {
      label: "Blocked",
      render: (op: IOperator) => (op.isBlocked ? "Yes" : "No"),
    },
  ];

  const actions = [
    {
      label: () => "Edit",
      onClick: (op: IOperator) => navigate(`/admin/edit-operator/${op._id}`),
      className: "bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600",
      disabled: () => false,
      loadingText: "Editing...",
    },
    {
      label: (op:IOperator) => `${op.isBlocked ? "Unblock" : "Block"}`,
      onClick: (op: IOperator) => {
        setModalMessage(
          `Are you sure want to ${
            op.isBlocked ? "unblock" : "block"
          } this operator`,
        );
        setModalAction(() => () => blockOperator(op._id, !op.isBlocked));
        setModalOpen(true);
      },
      className:
        "bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600",
      disabled: () => false,
      loadingText: "Processing...",
    },
    {
      label: () => "Delete",
      onClick: (op: IOperator) => {
        setModalMessage(`Are you sure want to delete this operator`);
        setModalAction(() => () => deleteOperator(op._id));
        setModalOpen(true);
      },
      className: "bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600",
      disabled: () => false,
      loadingText: "Deleting...",
    },
  ];

  return (
    <div className="p-6">
      <BackToDashBoard path="/admin/dashboard" />
      <h1 className="text-3xl font-bold mb-6 text-center ">
        Operator Management
      </h1>
      <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded shadow w-full max-w-72 mb-6">
        <input
          value={operatorId}
          onChange={(e) => setOperatorId(e.target.value)}
          type="text"
          placeholder="Enter operator Id"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleGetSingleOperator}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Get single Operator
        </button>
      </div>
      <ReUsableTable
        data={operators}
        columns={columns}
        actions={actions}
        loading={loading}
      />

      <ConfirmationModal
        isOpen={modalOpen}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          modalAction();
          setModalOpen(false);
        }}
      />
      <button
        onClick={() => navigate("/admin/operator-verification")}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700  mt-6"
      >
        Verification Requests
      </button>
      <Pagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
      />
    </div>
  );
};

export default AdminOperatorDetails;
