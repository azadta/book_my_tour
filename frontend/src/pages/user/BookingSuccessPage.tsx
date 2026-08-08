import Loading from "@/components/Loading";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";
import { useBookingSuccessPage } from "@/hooks/useBookingSuccessPage";
import {
  ArrowLeft,
  CheckCircle2,
  Printer,
  Receipt,
  ShieldCheck,
  Tag,
  Wallet,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

const BookingSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  const { booking, fetchBookingDetails, isLoading } = useBookingSuccessPage();
  const packageName = booking?.packageId.name;
  const pricing = booking?.pricing;
  const totalPaid=(pricing?.walletApplied||0)+(pricing?.finalAmount||0)


  useEffect(() => {
    if (orderId) {
      fetchBookingDetails(orderId);
    }
  }, [orderId]);
  if (isLoading) return <Loading />;

  return (
    <div className="mt-20 min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-100/50 text-center ">
          <div className="w-16 h-16 bg-emerald-100/70 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Payment Verified
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Booking Confirmed!
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            We have sent a confirmation email with your travel itinerary and
            reciept.{" "}
          </p>

          <div className="bg-gray-50 rounded-2xl p-5 mt-6 border border-gray-100 text-left space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200/60">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Transaction Reference
              </span>
              <span className="text-xs font-mono font-medium text-gray-600">
                {booking?.razorpayOrderId || "N/A"}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Package Name</span>
              <span className="font-semibold text-gray-900">{packageName}</span>
            </div>

            {booking?.razorpayPaymentId && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 ">Razorpay Payment ID</span>
                <span className="font-mono text-xs text-gray-700">
                  {booking.razorpayPaymentId}
                </span>
              </div>
            )}


            {pricing && (
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
                      {pricing.bankCoupon.discountAmount?.toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </div>
                )}

                <div  className="flex justify-between text-gray-900 font-semibold pt-2 border-t border-gray-200/40 ">
                <span >Total Payable</span>
                <span>Rs {totalPaid.toLocaleString('en-IN')}</span>
                </div>

                {pricing.walletApplied>0&&(<div className="flex justify-between text-indigo-600 font-semibold pt-1">
                  <span className="flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5"/>
                    Paid via Wallet
                  </span>
                  <span>
                    -Rs {pricing.walletApplied.toLocaleString('en-IN')}
                  </span>
                </div>)}

                {pricing.finalAmount>0&&pricing.walletApplied>0&&(<div className="flex justify-between text-gray-600 font-medium ">
                  <span>Paid via Online Gateway</span>
                  <span>{pricing.finalAmount.toLocaleString('en-IN')}</span>
                </div>)}
              </div>
            )}

            <div className="flex justify-between text-sm pt-3 border-t border-gray-200">
              <span className="text-gray-900 font-bold">Total Amount Paid</span>
              <span className="font-extrabold text-blue-600 text-base">
                Rs {totalPaid?.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              onClick={() => window.print()}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors "
            >
              <Printer className="w-4 h-4" /> Print Receipt
            </button>
            <Link
              to={FRONTEND_ROUTES.USER.MY_BOOKINGS}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-200 transition-colors "
            >
              <Receipt className="w-4 h-4 " />
              View My Bookings
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link
            to={FRONTEND_ROUTES.USER.PACKAGES_LIST}
            className="inline-flex items-center gap-2 tex-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Packages
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
