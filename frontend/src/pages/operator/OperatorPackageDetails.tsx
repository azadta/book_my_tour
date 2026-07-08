import { useState } from "react";
import { RiCloseLargeFill } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import AdminDashboardSideBar from "../../components/AdminDashboardSideBar";
import ConfirmationModal from "../../components/ConfirmationModal";
import Pagination from "../../components/Pagination";
import type { ActionButton, Column } from "../../components/ReUsableTable";
import ReUsableTable from "../../components/ReUsableTable";
import { useAdminUserManagement } from "../../hooks/useAdminUserManagement";
import type { IUser } from "../../redux/user/userSlice";
import OperatorDashboardSideBar from "@/components/OperatorDashboardSidebar";

const OperatorPackageDetails = () => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultPerpage = 5;
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState<() => Promise<void>>(() => async() => {});

  const { users, loading, blockUser, deleteUser, totalCount } =
    useAdminUserManagement(currentPage, resultPerpage);
  const totalPages = Math.ceil(totalCount / resultPerpage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: Column<IUser>[] = [
    { label: "Name", render: (user) => user.name },
    { label: "Email", render: (user) => user.email },
    { label: "Mobile", render: (user) => user.mobile },
    { label: "Premium", render: (user) => (user.isPremium ? "Yes" : "No") },
    { label: "Blocked", render: (user) => (user.isBlocked ? "Yes" : "No") },
  ];

  const actions: ActionButton<IUser>[] = [
    {
      label: () => "Edit",
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
      label: () => "Delete",
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
    <>
      <div className="flex flex-col min-h-screen ">
        <header className="bg-white shadow p-4 border-b border-gray-200 fixed top-0 w-full">
          <h2 className="text-2xl font-bold text-center  text-gray-800">
            Admin Dashboard
          </h2>
        </header>

        <div className="flex-1 flex  bg-gray-100 ">
          <div className="w-64 max-md:hidden"></div>
          <div className="max-md:hidden fixed top-16.5 bottom-0">
            <AdminDashboardSideBar />
          </div>

          <div className="flex-1 p-5 min-w-0">
            <h1 className="text-md bg-sky-200 font-bold mb-1 text-center py-2 mt-16.5  ">
              User Management
            </h1>

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
            <ConfirmationModal
              isOpen={modalOpen}
              message={modalMessage}
              onClose={() => setModalOpen(false)}
              onConfirm={async () => {
                modalAction();
                setModalOpen(false);
              }}
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
            <OperatorDashboardSideBar />
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

export default OperatorPackageDetails;
