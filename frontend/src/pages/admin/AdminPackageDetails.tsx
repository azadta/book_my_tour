import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAdminPackageManagement,
  type IPackageItem,
} from "../../hooks/useAdminPackageManagement";
import BackToDashboard from "../../components/BackToDashboard";
import ReUsableTable from "../../components/ReUsableTable";
import Pagination from "../../components/Pagination";

const AdminPackageDetails = () => {
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
    { label: "Package ID", render: (pkg: IPackageItem) => pkg._id },
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
    <div className="p-6 ">
      <BackToDashboard />
      <h1 className="text-3xl font-bold mb-6 text-center">
        Package Management
      </h1>
      <ReUsableTable data={packages} columns={columns} loading={loading} />
      <Pagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
      />
      <div className="mt-6 flex gap-5">
        <button
          onClick={() => navigate(`/admin/create-package-category`)}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Create Package Category
        </button>
        <button
          onClick={() => navigate(`/admin/create-destination`)}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Create Destination
        </button>
      </div>
    </div>
  );
};

export default AdminPackageDetails;
