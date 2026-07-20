import OperatorDashboardSideBar from "@/components/OperatorDashboardSidebar";
import { useOperatorPackageManagement } from "@/hooks/useOperatorPackageMangement";
import type { IPackageItem } from "@/interfaces/interfaces";
import { useState } from "react";
import { RiCloseLargeFill } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../components/ConfirmationModal";
import Pagination from "../../components/Pagination";
import type { ActionButton } from "../../components/ReUsableTable";
import ReUsableTable from "../../components/ReUsableTable";
import CreateButton from "@/components/createButton/CreateButton";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";

const OperatorPackagesList = () => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultPerpage = 5;
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState<() => Promise<void>>(
    () => async () => {},
  );

  const { deletePackage, fetchPackages, loading, packages, totalCount } =
    useOperatorPackageManagement(currentPage, resultPerpage);
  const totalPages = Math.ceil(totalCount / resultPerpage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    { label: "Name", render: (pkg: IPackageItem) => pkg.name },
    { label: "Amount", render: (pkg: IPackageItem) => pkg.amount },
    {
      label: "Category",
      render: (pkg: IPackageItem) =>
        typeof pkg.category === "string"
          ? pkg.category
          : pkg.category?.name || "-",
    },

    {
      label: "Start Date",
      render: (pkg: IPackageItem) =>
        pkg.startDate ? new Date(pkg.startDate).toLocaleDateString() : "N/A",
    },
    {
      label: "Discount",
      render: (pkg: IPackageItem) =>
        pkg.discount !== undefined ? ` ${pkg.discount} %` : "N/A",
    },
    {
      label: "Destinations",
      render: (pkg: IPackageItem) =>
        pkg.destinations?.map((dest, i) => (
          <span
            key={i}
            className="inline-block bg-gray-100 px-2 py-1 m-1 rounded"
          >
            {dest.name}
          </span>
        )) || "-",
    },
  ];
  const actions: ActionButton<IPackageItem>[] = [
    {
      label: () => "Edit",
      onClick: (pkg) => navigate( FRONTEND_ROUTES.OPERATOR.EDIT_PACKAGE(pkg._id)),
      className: `bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600`,
      disabled: () => false,
      loadingText: "Editing...",
    },

    {
      label: () => "Delete",
      onClick: (pkg) => {
        setModalMessage(`Are you sure want to delete this package`);
        setModalAction(() => () => deletePackage(pkg._id));
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
            Operator Dashboard
          </h2>
        </header>

        <div className="flex-1 flex  bg-gray-100 ">
          <div className="w-64 max-md:hidden"></div>
          <div className="max-md:hidden fixed top-16.5 bottom-0">
            <OperatorDashboardSideBar />
          </div>

          <div className="flex-1 p-5 min-w-0">
            <h1 className="text-md bg-sky-200 font-bold mb-1 text-center py-2 mt-16.5  ">
              Package Management
            </h1>

            <ReUsableTable
              data={packages}
              columns={columns}
              actions={actions}
              loading={loading}
            />
            <div className="mt-5">
              <CreateButton onClick={()=>navigate(FRONTEND_ROUTES.OPERATOR.CREATE_PACKAGE)}>Create Package</CreateButton>
            </div>

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

export default OperatorPackagesList;
