import AttendanceSelector from "@/components/AttendanceSelector";
import BackToDashboard from "@/components/BackToDashboard";
import Loading from "@/components/Loading";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";
import { useOperatorBookingDetails } from "@/hooks/useOperatorBookingDetails";
import { Tag, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const OperatorBookingDetails = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);

  const {
    loading,
    booking,
    cancelModalOpen,
    fetchDetails,
    handleOperatorCancel,
    handleReschedule,
    reScheduleModalOpen,
    setCancelReason,
    cancelReason,
    newDate,
    setNewDate,
    setRescheduleModalOpen,
    setCancelModalOpen,
    verifyCancelRequest,
  } = useOperatorBookingDetails();

  const pricing = booking?.pricing;
  const totalPaid = (pricing?.walletApplied || 0) + (pricing?.finalAmount || 0);

  useEffect(() => {
    fetchDetails(bookingId as string);
  }, [bookingId]);

  if (loading) return <Loading />;
  if (!booking)
    return <p className="text-center mt-20">Booking record not found.</p>;

  return (
    <div className="p-6 max-w-4xl mt-12 mb-10 mx-auto">
      <BackToDashboard path={FRONTEND_ROUTES.OPERATOR.BOOKING_LIST} />
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 mt-4">
        <div className="flex flex-col sm:flex-row items-start justify-between sm:items-center border-b mb-4 pb-4 gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              booking #{booking.razorpayOrderId}
            </h2>
            <p className="text-xs text-gray-500">
              Booked On: {new Date(booking.createdAt).toLocaleString("en-IN")}
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 ">
            {booking.status}
          </span>
        </div>

        {booking.status === "CONFIRMED" && (
          <div className="flex flext-wrap gap-3 bg-slate-50 mb-6 p-3 rounded border">
            <button
              onClick={() => setRescheduleModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white  px-3 py-1.5 rounded text-xs font-semibold transition"
            >
              Reschedule Tour Date
            </button>
            <button
              onClick={() => setCancelModalOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded text-xs font-semibold transition"
            >
              Cancel Tour (With 100% Refund)
            </button>
            <button
              onClick={() => setAttendanceModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-xs font-semibold transition"
            >
              Mark Guest Attendance
            </button>
          </div>
        )}

        <div className="mb-6 flex justify-between items-start">
          <div className="space-y-2">
            <h3 className="font-bold text-gray-700 mb-2">Guest Profile</h3>
            <div>
              <p className="text-xs text-gray-500 ">Name</p>
              <p className="text-sm font-medium ">{booking.userId.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium">{booking.userId.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-sm font-medium">
                {booking.userId.phone || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">
                Tour Start Date Attendance
              </p>
              <p className="text-sm font-medium">
                {booking.attendance || "N/A"}
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-700 mb-2">Package Details</h3>
            <div>
              <p className="text-xs text-gray-500 ">Package Name</p>
              <p className="text-sm font-medium ">{booking.packageId.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 ">Tour Start Date</p>
              <p className="text-sm font-medium ">
                {new Date(booking.packageId.startDate).toLocaleDateString(
                  "en-IN",
                )}
              </p>
            </div>
          </div>
        </div>

        {pricing && (
          <>
            <h2 className="font-bold  text-sm mb-1 text-blue-400">
              Payment Summary
            </h2>
            <div className="pt-3 border-t border-gray-200/60 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Base Amount</span>
                <span>Rs {pricing.baseAmount?.toLocaleString("en-IN")}</span>
              </div>

              {pricing.addedActivitiesAmount > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Added Activities</span>
                  <span>
                    + Rs{" "}
                    {pricing.addedActivitiesAmount?.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              {pricing.removedActivitiesAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Customization Discount</span>
                  <span>
                    - Rs{" "}
                    {pricing.removedActivitiesAmount?.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              {pricing.generalCoupon && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Promo Code ({pricing.generalCoupon.code})
                  </span>
                  <span>
                    - Rs{" "}
                    {pricing.generalCoupon.discountAmount?.toLocaleString(
                      "en-IN",
                    )}
                  </span>
                </div>
              )}

              {pricing.bankCoupon && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Bank Offer ({pricing.bankCoupon.code})
                  </span>
                  <span>
                    - Rs{" "}
                    {pricing.bankCoupon.discountAmount?.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-gray-900 font-semibold pt-2 border-t border-gray-200/40 ">
                <span>Total Payable</span>
                <span>Rs {totalPaid.toLocaleString("en-IN")}</span>
              </div>

              {pricing.walletApplied > 0 && (
                <div className="flex justify-between text-indigo-600 font-semibold pt-1">
                  <span className="flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5" />
                    Paid via Wallet
                  </span>
                  <span>
                    -Rs {pricing.walletApplied.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              {pricing.finalAmount > 0 && pricing.walletApplied > 0 && (
                <div className="flex justify-between text-gray-600 font-medium ">
                  <span>Paid via Online Gateway</span>
                  <span>{pricing.finalAmount.toLocaleString("en-IN")}</span>
                </div>
              )}
            </div>
          </>
        )}

        <div className="flex justify-between text-sm pt-3 border-t border-gray-200">
          <span className="text-blue-600 font-bold">Total Amount Paid</span>
          <span className="font-extrabold text-blue-600 text-base">
            Rs {totalPaid?.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {booking.status === "CANCEL_REQUESTED" && (
        <div className="bg-orange-50 border border-orange-200 p-4 rounded mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ">
          <div>
            <h4 className="text-sm font-semibold text-orange-900">
              Pending Operator Cancellation Approval
            </h4>
            <p className="text-xs text-orange-800 mt-1">
              Reason:{" "}
              {booking.cancellation.reason || "Guest requested cancellation"}
            </p>
            <p className="text-xs text-orange-800 ">
              Estimated 50% Refund: Rs {booking.cancellation.refundAmount}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => verifyCancelRequest(bookingId as string, "REJECT")}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold transition shadow-sm"
            >
              Reject Request
            </button>
            <button
              type="button"
              onClick={() =>
                verifyCancelRequest(bookingId as string, "APPROVE")
              }
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition shadow-sm"
            >
              Approve (50% Refund)
            </button>
          </div>
        </div>
      )}

      {reScheduleModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white r rounded-lg p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-800 text-lg mb-2">
              Reschedule Tour Date
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Select a new start date for this package tour.
            </p>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full border rounded p-2 text-sm mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRescheduleModalOpen(false)}
                className="px-3 py-1.5 border rounded text-xs font-semibold text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReschedule(bookingId as string)}
                className="px-3 py-1.5 bg-amber-500 text-white rounded text-xs font-semibold hover:bg-amber-600"
              >
                Update Date
              </button>
            </div>
          </div>
        </div>
      )}
      {cancelModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white r rounded-lg p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-800 text-lg mb-2">
              Cancel Booking
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Enter reason for cancelling Booking.
            </p>
            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Cancellation Reason<span className="text-rose-500">*</span>
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition resize-none shadow-sm "
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-3 py-1.5 border rounded text-xs font-semibold text-gray-600"
              >
                Close
              </button>
              <button
                onClick={() => handleOperatorCancel(bookingId as string)}
                disabled={!cancelReason.trim()}
                className="px-3 py-1.5 bg-rose-500 text-white rounded text-xs font-semibold hover:bg-rose-600 disabled:cursor-not-allowed"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
      {attendanceModalOpen && (
        <AttendanceSelector
          bookingId={bookingId as string}
          currentAttendance={booking.attendance || "PENDING"}
          onUpdate={() => fetchDetails(bookingId as string)}
          onClose={() => setAttendanceModalOpen(false)}
        />
      )}
    </div>
  );
};

export default OperatorBookingDetails;
