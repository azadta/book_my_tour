import CreateButton from "@/components/createButton/CreateButton";
import OperatorDashboardSideBar from "@/components/OperatorDashboardSidebar";
import Pagination from "@/components/Pagination";
import type { ActionButton } from "@/components/ReUsableTable";
import ReUsableTable from "@/components/ReUsableTable";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";
import { useCouponList } from "@/hooks/useCouponList";
import type { ICouponItem } from "@/interfaces/interfaces";
import { useState } from "react";
import { RiCloseLargeFill } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

const CouponList = () => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultPerPage = 5;
  const navigate = useNavigate();

  const { coupons, totalCount, loading, toggleCouponStatus } = useCouponList(
    currentPage,
    resultPerPage,
  );

  const totalPages = Math.ceil(totalCount / resultPerPage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      label: "Code/Title",
      render: (c: ICouponItem) => (
        <div>
          <span className="font-bold font-mono text-blue-700 uppercase block ">
            {c.code}
          </span>
          <span className="text-xs text-gray-600 block">{c.title}</span>
        </div>
      ),
    },
    {
      label: "Type",
      render: (c: ICouponItem) => (
        <span
          className={`px-2 py-0.5 rounded text-xs font-semibold ${c.type === "BANK" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`}
        >
          {c.type === "BANK" ? `${c.bankName || "Bank Offer"}` : "General"}
        </span>
      ),
    },
    {
      label: "Discount",
      render: (c: ICouponItem) => (
        <span className={"font-semibold text-emerald-600"}>
          {c.discountType === "PERCENTAGE"
            ? `${c.discountValue}% OFF`
            : `Rs ${c.discountValue} OFF`}
        </span>
      ),
    },
    {
      label: "Min Spend",
      render: (c: ICouponItem) => `Rs ${c.minBookingAmount ?? 0}`,
    },
    {
      label: "Valid Till",
      render: (c: ICouponItem) =>
        c.validTill ? new Date(c.validTill).toLocaleDateString() : "N/A",
    },
    {
      label: "Status",
      render: (c: ICouponItem) => (
        <span
          className={`px-2 py-1  rounded text-xs text-white ${c.isActive ? "bg-green-500" : "bg-gray-500"}`}
        >
          {c.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const actions: ActionButton<ICouponItem>[] = [
    {
      label: () => "Edit",
      onClick: (c: ICouponItem) =>
        navigate(FRONTEND_ROUTES.OPERATOR.UPDATE_COUPON(c._id)),
      className: "bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600",
      disabled: () => false,
      loadingText: "Updating...",
      isLoading: () => loading,
    },
    {
      label: (c: ICouponItem) => (c.isActive ? "Deactivate" : "Activate"),
      onClick: (c: ICouponItem) => toggleCouponStatus(c._id, c.isActive),
      className: "bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600",
      disabled: () => false,
      loadingText: "Updating...",
      isLoading: () => loading,
    },
  ];

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <header className="bg-white shadow p-4 border-b border-gray-200 fixed top-0 w-full z-10  ">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Operator Dashboard
          </h2>
        </header>

        <div className="flex-1 flex bg-gray-100">
          <div className="w-64 max-md:hidden"></div>
          <div className="max-md:hidden fixed top-16.5 bottom-0">
            <OperatorDashboardSideBar />
          </div>

          <div className="flex-1 p-5 min-w-0">
            <h1 className="text-md bg-sky-200 font-bold mb-1 text-center py-2 mt-16.5">
              Coupon Management
            </h1>
            <ReUsableTable
              data={coupons}
              columns={columns}
              actions={actions}
              loading={loading}
            />
            <div className="mt-5">
              <CreateButton
                onClick={() => navigate(FRONTEND_ROUTES.OPERATOR.CREATE_COUPON)}
              >
                Create Coupon
              </CreateButton>
            </div>

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
          className="fixed top-0 right-0 md:hidden text-3xl text-orange-600 cursor-pointer "
          onClick={() => setOpen(true)}
        />
      )}
      {open && (
        <RiCloseLargeFill
          onClick={() => setOpen(false)}
          className="fixed top-0 right-0 text-2xl z-60 cursor-pointer"
        />
      )}

      {open && (
        <>
          <div className="fixed top-0 right-0 bottom-0 z-50 md:hidden overflow-x-auto ">
            <OperatorDashboardSideBar />
          </div>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setOpen(false)}
          ></div>
        </>
      )}
    </>
  );
};

export default CouponList;
