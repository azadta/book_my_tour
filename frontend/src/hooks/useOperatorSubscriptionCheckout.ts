import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { updateOperatorSuccess } from "@/redux/operator/operatorSlice";
import type { RootState } from "@/redux/store";
import { loadRazorpayScript } from "@/utils/loadRazorpay";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export const useOperatorSubscriptionCheckOut = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentOperator } = useSelector((state: RootState) => state.operator);
  const dispatch = useDispatch();
  const handleSubscribe = async (planId: string) => {
    setIsSubmitting(true);
    try {
      const { data: response } = await axiosInstance.post(
        APP_ROUTES.SUBSCRIPTION.CREATE_ORDER,
        { planId },
      );
      const { orderId, amount, currency, keyId, planName, planDescription } =
        response.data;

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
        name: planName,
        description: planDescription,
        order_id: orderId,

        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const { data } = await axiosInstance.post(
              APP_ROUTES.SUBSCRIPTION.PAYMENT_VERIFY,
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                planId,
              },
            );
            dispatch(updateOperatorSuccess(data.operator));
            toast.success(FEEDBACK_MESSAGES.SUBSCRIPTION.SUCCESS.ACTIVATE);
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
          name: currentOperator?.name || "",
          email: currentOperator?.email || "",
          contact: currentOperator?.mobile || "",
        },
        theme: {
          color: "#4f46e5",
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
      toast.error(
        error.response?.data?.message ||
          FEEDBACK_MESSAGES.SUBSCRIPTION.ERROR.INITIATE_PAYMENT,
      );
      setIsSubmitting(false);
    }
  };

  return { handleSubscribe, isSubmitting };
};
