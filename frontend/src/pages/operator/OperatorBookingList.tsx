import SendNotificationModal from "@/components/notification/SendNotificationModal";
import OperatorDashboardSideBar from "@/components/OperatorDashboardSidebar";
import Pagination from "@/components/Pagination";
import ReUsableTable, {
  type ActionButton,
  type Column,
} from "@/components/ReUsableTable";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";
import { useNotifications } from "@/hooks/useNotifications";
import { useOperatorBookings } from "@/hooks/useOperatorBookings";
import type { IPopulatedBooking } from "@/interfaces/interfaces";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { RiCloseLargeFill } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

const OperatorBookingList = () => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<IPopulatedBooking | null>(null);
  const { sendNotification } = useNotifications();
  const resultPerPage = 5;
  const navigate = useNavigate();
  const { bookings, loading, totalCount, pendingCancelCount } =
    useOperatorBookings(currentPage, resultPerPage, statusFilter);

  const totalPages = Math.ceil(totalCount / resultPerPage);
  const handleCancellationFilterToggle = () => {
    if (statusFilter === "CANCEL_REQUESTED") {
      setStatusFilter("");
    } else {
      setStatusFilter("CANCEL_REQUESTED");
    }
    setCurrentPage(1);
  };
  const handleOpenNotificationModal = (booking: IPopulatedBooking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleSendNotification = async (
    title: string,
    message: string,
  ): Promise<boolean> => {
    const recipientId = selectedBooking?.userId._id;
    if (!recipientId) return false;
    const result = await sendNotification({
      recipientId,
      title,
      message,
      bookingId: selectedBooking?._id,
    });
    return !!result;
  };

  const columns: Column<IPopulatedBooking>[] = [
    {
      label: "Customer",
      render: (booking) => (
        <div className="text-left">
          <p className="font-semibold text-gray-800">
            {booking.userId?.name || "N/A"}
          </p>
          <p className="text-xs text-gray-500">{booking.userId?.email}</p>
          <p className="text-xs text-gray-500">{booking.userId?.phone}</p>
        </div>
      ),
    },
    {
      label: "Booking ID",
      render: (booking) => booking._id || "N/A",
    },
    {
      label: "Package",
      render: (booking) => booking.packageId?.name || "N/A",
    },
    {
      label: "Start Date",
      render: (booking) =>
        booking.packageId?.startDate
          ? new Date(booking.packageId?.startDate).toLocaleDateString("en-IN")
          : "N/A",
    },
    {
      label: "Amount Paid",
      render: (booking) =>
        `Rs ${(booking.pricing?.finalAmount || 0) + (booking.pricing?.walletApplied || 0)}`,
    },
    {
      label: "Status",
      render: (booking) => {
        const badgeClasses: Record<string, string> = {
          CONFIRMED: `bg-emerald-100 text-emerald-800 border-emerald-300`,
          PENDING: `bg-amber-100 text-amber-800 border-amber-300`,
          CANCEL_REQUESTED: `bg-orange-100 text-orange-800 border-orange-300`,
          CANCELLED: `bg-rose-100 text-rose-800 border-rose-300`,
          FAILED: `bg-gray-100 text-gray-800 border-gray-300`,
        };
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeClasses[booking.status] || "bg-gray-100 text-gray-700"}`}
          >
            {booking.status === "CANCEL_REQUESTED"
              ? "Cancellation Requested"
              : booking.status.replace("_", " ")}
          </span>
        );
      },
    },
  ];

  const actions: ActionButton<IPopulatedBooking>[] = [
    {
      label: () => "Manage",
      onClick: (booking) => {
        navigate(FRONTEND_ROUTES.OPERATOR.BOOKING_DETAILS(booking._id));
      },
      className: `bg-sky-600 text-white px-3 py-1 rounded hover:bg-sky-700 transition cursor-pointer`,
      disabled: () => false,
      loadingText: "Opening...",
    },
    {
      label: () => "Notify 🔔",
      onClick: (booking) => {
        handleOpenNotificationModal(booking);
      },
      className: `bg-sky-600 text-white px-3 py-1 rounded hover:bg-sky-700 transition cursor-pointer`,
      disabled: () => false,
      loadingText: "Opening...",
    },
  ];

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <header className="bg-white shadow p-4 border-b border-gray-200 fixed top-0 w-full z-10">
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
            <div className="mt-16.5 mb-4 flex flex-col sm:flex-row justify-between items-center p-4 rounded-lg bg-white shadow border border-gray-200 gap-3 ">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-full">
                  <AlertCircle size={22} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    Pending Guest Cancellations
                  </p>
                  <p className="text-xs text-gray-500">
                    You have{" "}
                    <span className="font-bold text-orange-600">
                      {pendingCancelCount}
                    </span>{" "}
                    bookings waiting for review/refund verification.
                  </p>
                </div>
              </div>

              <button
                onClick={handleCancellationFilterToggle}
                className={`rounded px-4 py-2 text-xs font-semibold ${statusFilter === "CANCEL_REQUESTED" ? "bg-gray-800 text-white hover:bg-gray-900" : "bg-orange-500 hover:bg-orange-600 text-white shadow-sm"}`}
              >
                {statusFilter === "CANCEL_REQUESTED"
                  ? "Show All Bookings"
                  : `View Cancel Requests (${pendingCancelCount})`}
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between bg-sky-200 rounded p-3 mt-16.5 mb-4">
              <h1 className="text-md font-bold text-gray-800">
                Tour Booking Management
              </h1>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="mt-2 md:mt-0 border rounded px-3 py-1 text-xs bg-white"
              >
                <option value="">All Statuses</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCEL_REQUESTED">
                  Cancellation Requested{" "}
                </option>
                <option value="CANCELLED">Cancelled</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>

            <ReUsableTable
              data={bookings}
              columns={columns}
              loading={loading}
              actions={actions}
            />
            <Pagination
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        </div>
        <SendNotificationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSend={handleSendNotification}
          selectedBooking={selectedBooking}
        />
      </div>
      {!open && (
        <RxHamburgerMenu
          className="fixed top-3 right-4 md:hidden text-3xl text-orange-600 z-50 cursor-pointer"
          onClick={() => setOpen(true)}
        />
      )}
      {open && (
        <RiCloseLargeFill
          className="fixed top-3 right-4  text-2xl text-gray-800 z-60 cursor-pointer"
          onClick={() => setOpen(false)}
        />
      )}
      {open && (
        <>
          <div className="fixed top-0 bottom-0 right-0 z-50 overflow-x-auto md:hidden">
            <OperatorDashboardSideBar />
          </div>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
        </>
      )}
    </>
  );
};

export default OperatorBookingList;
