import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackToDashboard from "../../components/BackToDashboard";
import ConfirmationModel from "../../components/ConfirmationModel";
import Pagination from "../../components/Pagination";
import type { ActionButton, Column } from "../../components/ReUsableTable";
import ReUsableTable from "../../components/ReUsableTable";
import { useAdminUserManagement } from "../../hooks/useAdminUserManagement";
import type { IUser } from "../../redux/user/userSlice";

const AdminUserDetails = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const resultPerpage = 5;
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState<() => void>(() => () => {});
  const [userId, setUserId] = useState("");
  const { users, loading, blockUser, deleteUser, totalCount } =
    useAdminUserManagement(currentPage, resultPerpage);
  const totalPages = Math.ceil(totalCount / resultPerpage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleGetSingleUser = () => {
    if (userId.trim()) {
      navigate(`/admin/edit-user/${userId.trim()}`);
    }
  };

  const columns: Column<IUser>[] = [
    { label: "User ID", render: (user) => user._id },
    { label: "Name", render: (user) => user.name },
    { label: "Email", render: (user) => user.email },
    { label: "Mobile", render: (user) => user.mobile },
    { label: "Premium", render: (user) => (user.isPremium ? "Yes" : "No") },
    { label: "Blocked", render: (user) => (user.isBlocked ? "Yes" : "No") },
  ];

  const actions: ActionButton<IUser>[] = [
    {
      label: (user) => "Edit",
      onClick: (user) => navigate(`/admin/edit-user/${user._id}`),
      className: `bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600`,
      disabled: () => false,
      loadingText: "Editing...",
    },
    {
      label: (user) => `${user.isBlocked ? "Unblock" : "Block"}`,
      onClick: (user) => {
        setModalMessage(
          `Are you sure want to ${user.isBlocked ? "unblock" : "block"} this user`,
        );
        setModalAction(() => () => blockUser(user._id, !user.isBlocked));
        setModalOpen(true);
      },
      className: `bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600`,
      disabled: () => false,
      loadingText: "Processing...",
    },
    {
      label: (user) => "Delete",
      onClick: (user) => {
        setModalMessage(`Are you sure want to delete this user`);
        setModalAction(() => () => deleteUser(user._id));
        setModalOpen(true);
      },
      className: `bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600`,
      disabled: () => false,
      loadingText: "Deleting...",
    },
  ];
  return (
    <div className="p-6">
      <BackToDashboard />
      <h1 className="text-3xl font-bold mb-6 text-center ">User Management</h1>
      <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded shadow w-full max-w-72 mb-6">
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          type="text"
          placeholder="Enter User ID"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 "
        />
        <button
          onClick={handleGetSingleUser}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 "
        >
          Get Single User
        </button>
      </div>
      <ReUsableTable
        data={users}
        columns={columns}
        actions={actions}
        loading={loading}
      />
      <Pagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
      />
      <ConfirmationModel
        isOpen={modalOpen}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          modalAction();
          setModalOpen(false);
        }}
      />
    </div>
  );
};

export default AdminUserDetails;
