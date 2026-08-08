import Loading from "@/components/Loading";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";
import { useMyBookings, type IBooking } from "@/hooks/useMyBookings";
import type { IPricing } from "@/interfaces/interfaces";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  PackageX,
  Receipt,
  Wallet,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const MyBookingsPage = () => {
  const { bookings, isLoading } = useMyBookings();
  const getStatusBadge = (status: IBooking["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200/60">
            <CheckCircle2 className="w-3.5 h-3.5 " />
            Confirmed
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200/60">
            <Clock className="w-3.5 h-3.5 " />
            Payment Pending
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-red-200/60">
            <AlertCircle className="w-3.5 h-3.5 " />
            Payment Failed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-gray-200/60">
            <XCircle className="w-3.5 h-3.5 " />
            Cancelled
          </span>
        );
    }
  };

  const getPaymentMethodBadge = (pricing?: IPricing) => {
    if (!pricing) return null;
    const { walletApplied, finalAmount } = pricing;
    if (walletApplied > 0 && finalAmount === 0) {
      return (
        <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-[11px] font-medium px-2 py-0.5 rounded border border-indigo-100">
          <Wallet className="w-3 h-3" />
          Wallet Paid
        </span>
      );
    }
    if (walletApplied > 0 && finalAmount > 0) {
      return (
        <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-[11px] font-medium px-2 py-0.5 rounded border border-purple-100">
          <Wallet className="w-3 h-3" />
          Wallet + Online
        </span>
      );
    }
    return (<span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[11px] font-medium px-2 py-0.5 rounded border border-blue-100">
          <Wallet className="w-3 h-3" />
          Online Gateway
        </span>)
  };

  if (isLoading) return <Loading />;
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 mt-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          My Booked Tours
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your upcoming travel itineraries and download payment reciepts.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PackageX className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-gray-900">No Bookings Found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
            You haven't booked any tour packages yet.Explore our destinations
            and start planning your next getaway!
          </p>
          <Link
            to={FRONTEND_ROUTES.USER.PACKAGES_LIST}
            className="inline-flex items-center gap-2 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-lg shadow-blue-200 transition-all"
          >
            Explore Tour Packages
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const pkg = booking.packageId;
            const pricing=booking.pricing
            const totalPaid=(pricing?.walletApplied||0)+(pricing?.finalAmount||0)
            const bookingDate = new Date(booking.createdAt).toLocaleDateString(
              "en-IN",
              { day: "numeric", month: "short", year: "numeric" },
            );
            return (
              <div
                key={booking._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100 ">
                    {pkg?.images?.length ? (
                      <img
                        src={pkg.images[0]}
                        alt={pkg.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getStatusBadge(booking.status)}
                      {getPaymentMethodBadge(pricing)}
                    </div>
                    <h2 className="text-base font-bold text-gray-900 line-clamp-1 ">
                      {pkg?.name || "Tour Package"}
                    </h2>
                    {pkg.destinations?.length > 0 && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {pkg.destinations.map((dest) => dest.name).join(", ")}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Booked on {bookingDate}
                    </p>
                  </div>
                </div>

                <div className="w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 flex sm:flex-col items-center sm:items-end justify-between gap-2">
                  <div className="text-left sm:text-right ">
                    <span className="text-[11px] text-gray-400 block">
                      Total Paid
                    </span>
                    <span className="text-lg font-black text-blue-600">
                      Rs {totalPaid.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {booking.status === "CONFIRMED" && (
                    <Link
                      to={FRONTEND_ROUTES.USER.BOOKING_SUCCESS(
                        booking.razorpayOrderId,
                      )}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      View Reciept
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
