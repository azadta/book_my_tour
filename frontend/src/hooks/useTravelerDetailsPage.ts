import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";
import type { FinalBookingPayload } from "@/pages/user/TravelerDetailsPage";
import type { RootState } from "@/redux/store";
import { loadRazorpayScript } from "@/utils/loadRazorpay";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useTravelerDetailsPage = () => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const { currentUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleBooking = async (bookingData: FinalBookingPayload) => {
    setIsSubmitting(true);
    try {
      const packageId = bookingData.packageId;
      const { data: response } = await axiosInstance.post(
        APP_ROUTES.BOOKINGS.USER.CREATE,
        bookingData,
      );
      const {
        orderId,
        amount,
        currency,
        keyId,
        packageName,
        packageDescription,
        offerId,
        isFullyPaidByWallet,
      } = response.data;
      if (isFullyPaidByWallet) {
        toast.success(FEEDBACK_MESSAGES.BOOKING.SUCCESS.BOOKING);
        setIsSubmitting(false);
        navigate(FRONTEND_ROUTES.USER.BOOKING_SUCCESS(orderId));
        return;
      }

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error(FEEDBACK_MESSAGES.PAYMENT.ERROR.RAZORPAY_LOAD);
        setIsSubmitting(false);
        return;
      }
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Book My Tour",
        description: packageName || packageDescription,
        order_id: orderId,
        ...(offerId ? { offer_id: offerId } : {}),
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await axiosInstance.post(APP_ROUTES.BOOKINGS.USER.PAYMENT_VERIFY, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              packageId,
            });
            toast.success(FEEDBACK_MESSAGES.BOOKING.SUCCESS.BOOKING);
            navigate(
              FRONTEND_ROUTES.USER.BOOKING_SUCCESS(response.razorpay_order_id),
            );
          } catch (error: any) {
            toast.error(
              error.response?.data?.message ||
                FEEDBACK_MESSAGES.PAYMENT.ERROR.PAYMENT_VERIFICATION,
            );
          } finally {
            setIsSubmitting(false);
          }
        },

        prefill: {
          name: currentUser?.name || "",
          email: currentUser?.email || "",
          contact: currentUser?.mobile || "",
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            toast.info(FEEDBACK_MESSAGES.PAYMENT.ERROR.PAYMENT_POPUP);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);
        setIsSubmitting(false);
        return;
      }
      toast.error(
        error.response?.data?.message ||
          FEEDBACK_MESSAGES.BOOKING.ERROR.INITIATE,
      );
      setIsSubmitting(false);
    }
  };

  return { handleBooking, isSubmitting, fieldError, setFieldError };
};
