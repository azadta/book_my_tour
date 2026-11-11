import Loading from "@/components/Loading";
import { useBookingDetails } from "@/hooks/useBookingDetails";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Clock3,
  Mail,
  MapPin,
  MinusCircle,
  PlusCircle,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BookingDetailsPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const { fetchUserBookingDetails, booking, isLoading } = useBookingDetails();
  useEffect(() => {
    fetchUserBookingDetails(bookingId as string);
  }, [fetchUserBookingDetails, bookingId]);
  if (isLoading) return <Loading />;
  if (!booking) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-lg font-bold text-slate-800 ">
          Booking Details not found
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }
  const {
    packageId: pkg,
    pricing,
    primaryContact,
    members = [],
    addedActivities = [],
    removedActivities = [],
    status,
    razorpayOrderId,
    razorpayPaymentId,
    createdAt,
  } = booking;
  const previewImages = pkg?.images.slice(0, 2) || [];
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-slate-50/50 min-h-screen ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex bg-white shadow-lg px-1 py-1 rounded-md items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2 transition-colors cursor-pointer "
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Bookings
          </button>
          <div className="flex flex-col  gap-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Booking Details
            </h1>
            <span className="text-xs font-mono    text-slate-700">
              Booking Id: {String(booking._id)}
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Booked On{" "}
              {new Date(createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div>
          {status === "CONFIRMED" && (
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200 ">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 " />
              Confirmed
            </span>
          )}
          {status === "PENDING" && (
            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-200 ">
              <Clock3 className="w-4 h-4 text-amber-600 " />
              Payment Pending
            </span>
          )}
          {status === "CANCEL_REQUESTED" && (
            <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-full border border-rose-200 ">
              <AlertCircle className="w-4 h-4 text-rose-600 " />
              Cancellation Requested
            </span>
          )}
          {status === "CANCELLED" && (
            <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full border border-gray-200 ">
              <XCircle className="w-4 h-4 text-gray-600" />
              Cancelled
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            {previewImages.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 rounded-2xl overflow-hidden h-48 sm:h-56">
                {previewImages.map((imgUrl, idx) => (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt={`${pkg?.name} preview ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                ))}
              </div>
            )}

            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {pkg?.name}
            </h2>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md">
                <Clock className="w-3.5 h-3.5" />
                {pkg?.duration.day} Days / {pkg?.duration.night} Nights
              </div>
              {pkg?.startDate && (
                <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200/60">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>
                    Departs:{" "}
                    {new Date(pkg.startDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>

            <div>
              <span className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                Destinations covered
              </span>
              <div className="flex flex-wrap gap-2">
                {pkg?.destinations.map((dest) => (
                  <span
                    key={String(dest._id)}
                    className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    {dest.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Activity Customizations
            </h3>
            <div>
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mb-2">
                <PlusCircle className="w-4 h-4 " />
                Added Optional Activities
              </span>
              {addedActivities.length > 0 ? (
                <div className="space-y-2">
                  {addedActivities.map((act) => (
                    <div
                      key={act.id}
                      className="flex justify-between items-center p-3 rounded-xl bg-emerald-50/40 border border-emerald-100 text-xs"
                    >
                      <span className="font-medium text-slate-800 ">
                        {act.name}
                      </span>
                      <span className="font-bold text-emerald-700 ">
                        {act.cost}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic ">
                  No optional activities added.
                </p>
              )}
            </div>

            <div>
              <span className="text-xs font-semibold text-rose-700 flex items-center gap-1 mb-2">
                <MinusCircle className="w-4 h-4 " />
                Removed Default Activities
              </span>
              {removedActivities.length > 0 ? (
                <div className="space-y-2">
                  {removedActivities.map((act) => (
                    <div
                      key={act.id}
                      className="flex justify-between items-center p-3 rounded-xl bg-rose-50/40 border border-rose-100 text-xs"
                    >
                      <span className="font-medium text-slate-800 ">
                        {act.name}
                      </span>
                      <span className="font-bold text-rose-700 ">
                        {act.cost}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic ">
                  No default activities removed.
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sky-600 " />
              Primary Lead and Travellers
            </h3>
            <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 mb-4 text-xs space-y-1">
              <span className="font-bold text-sky-800 uppercase tracking-wider text-[10px]">
                Primary Contact
              </span>
              <div className="flex flex-wrap gap-4 text-slate-700 pt-1 ">
                <span className="flex items-center gap-1 font-semibold">
                  <User className="w-3.5 h-3.5 text-sky-600" />
                  {primaryContact?.name}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-sky-600" />
                  {primaryContact?.email}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-sky-600" />
                  {primaryContact?.phone}
                </span>
              </div>
            </div>

            {members.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500">
                  Group Members ({members.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {members.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 text-xs"
                    >
                      <p className="font-bold text-slate-800">
                        {m.firstName} {m.lastName}
                      </p>
                      <p className=" text-slate-500 text-[11px] capitalize">
                        Type: {m.type} | Gender: {m.gender}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs sticky top-6">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4">
              Pricing & Payment Breakdown
            </h3>
            <div className="space-y-2 pb-4 border-b border-slate-100 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">
                  Adults ({pricing.adultCount})
                </span>
                <span className="font-semibold text-slate-800">
                  {pricing.adultAmount?.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              {pricing.childCount > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    Children ({pricing.childCount})
                  </span>
                  <span className="font-semibold text-slate-800">
                    {pricing.childAmount?.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2 py-4 border-b border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Amount</span>
                <span>
                  Rs{" "}
                  {pricing.baseAmount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              {pricing.addedActivitiesAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Added Activities</span>
                  <span>
                    +Rs{" "}
                    {pricing?.addedActivitiesAmount?.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}
              {pricing.removedActivitiesAmount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Removed Activities</span>
                  <span>
                    -Rs{" "}
                    {pricing?.removedActivitiesAmount?.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}
              {pricing.totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Savings</span>
                  <span>
                    -Rs{" "}
                    {pricing?.totalDiscount?.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}
              {pricing.walletApplied > 0 && (
                <div className="flex justify-between text-indigo-600 font-medium">
                  <span>Wallet Applied</span>
                  <span>
                    -Rs{" "}
                    {pricing?.walletApplied?.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-between items-baseline mb-6">
              <span className="text-xs font-bold text-slate-900">
                Total Paid
              </span>
              <span className="text-2xl font-black text-slate-900">
                Rs{" "}
                {(
                  (pricing.walletApplied || 0) + (pricing.finalAmount || 0)
                ).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-[11px] space-y-2">
              <div className="flex justify-between text-slate-500">
                <span>Order ID:</span>
                <span className="font-mono font-bold text-slate-700">
                  {razorpayOrderId || "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Payment ID:</span>
                <span className="font-mono font-bold text-slate-700">
                  {razorpayPaymentId || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage;
