import { useState } from "react";
import { RiCloseLargeFill } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import AdminDashboardSideBar from "../../components/AdminDashboardSideBar";
import Pagination from "../../components/Pagination";
import ReUsableTable from "../../components/ReUsableTable";
import {
  useAdminPackageManagement,
  type IPackageItem,
} from "../../hooks/useAdminPackageManagement";

const AdminPackageDetails = () => {
    const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultPerPage = 6;
  const navigate = useNavigate();
  const { loading, packages, totalCount } = useAdminPackageManagement(
    currentPage,
    resultPerPage,
  );
  const totalPages = Math.ceil(totalCount / resultPerPage);
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
      label: "Customizable",
      render: (pkg: IPackageItem) => (pkg.isCustomizable ? "Yes" : "No"),
    },
    {
      label: "Expiry Date",
      render: (pkg: IPackageItem) =>
        pkg.expiryDate ? new Date(pkg.expiryDate).toLocaleDateString() : "N/A",
    },
    {
      label: "Operator",
      render: (pkg: IPackageItem) => pkg.operatorId?.name || "Operator",
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
        Package Management
      </h1>
      <ReUsableTable data={packages} columns={columns} loading={loading} />
      <Pagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
      />
      <div className="mt-6 flex gap-1.5 sm:gap-5">
        <button
          onClick={() => navigate(`/admin/create-package-category`)}
          className="bg-blue-600 text-white  py-2 px-1 sm:px-4 rounded hover:bg-blue-700"
        >
          Create Package Category
        </button>
        <button
          onClick={() => navigate(`/admin/create-destination`)}
          className="bg-blue-600 text-white py-2 px-1 sm:px-4 rounded hover:bg-blue-700"
        >
          Create Destination
        </button>
      </div>
    </div>
    </div>
      {!open && (
        <RxHamburgerMenu
          className="fixed top-0 right-0 md:hidden text-3xl text-orange-600"
          onClick={() => setOpen(true)}
        />
      )}
      </div>
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

export default AdminPackageDetails;
