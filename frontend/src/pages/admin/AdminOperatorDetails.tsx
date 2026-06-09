import BackToDashBoard from "../../components/BackToDashboard";
import ReUsableTable from "../../components/ReUsableTable";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useAdminOperatorManagement } from "../../hooks/useAdminOperatorManagement";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { IOperator } from "../../redux/operator/operatorSlice";
import Pagination from "../../components/Pagination";
import AdminDashboardSideBar from "../../components/AdminDashboardSideBar";
import { RxHamburgerMenu } from "react-icons/rx";
import { RiCloseLargeFill } from "react-icons/ri";

const AdminOperatorDetails: React.FC = () => {
  const [open, setOpen] = useState(false);
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
      label: (op: IOperator) => `${op.isBlocked ? "Unblock" : "Block"}`,
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
    <>
    <div className="flex flex-col min-h-screen ">
         <header className="bg-white shadow p-4 border-b border-gray-200 fixed top-0 w-full">
          <h2 className="text-2xl font-bold text-center  text-gray-800">
            Admin Dashboard
          </h2>
        </header>
        <div className="flex-1 flex">
              <div className="w-64 max-md:hidden"></div>
          <div className="max-md:hidden fixed top-16.5 bottom-0">
          <AdminDashboardSideBar />
          </div>

      <div className="flex-1 p-5 min-w-0">
        <h2 className="text-md bg-sky-200 font-bold mb-1 text-center py-2 mt-16.5  ">
          Operator Management
        </h2>

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
      </div>
      </div>
      {!open && (
        <RxHamburgerMenu
          className="fixed top-0 right-0 md:hidden text-3xl text-orange-600"
          onClick={() => setOpen(true)}
        />
      )}
      {open && (
        <RiCloseLargeFill
          onClick={() => setOpen(false)}
          className=" fixed top-0 right-0 text-2xl z-60 "
        />
      )}
      {open && (
        <>
          <div className="fixed top-0 right-0 bottom-0 z-50   md:hidden overflow-x-auto">
            <AdminDashboardSideBar />
          </div>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden "
            onClick={() => setOpen(false)}
          ></div>
        </>
      )}
    </>
  );
};

export default AdminOperatorDetails;
