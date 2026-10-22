import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import type { IPopulatedPayout } from "@/interfaces/interfaces";

import { loadRazorpayScript } from "@/utils/loadRazorpay";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useAdminPayout = () => {
  const [payouts, setPayouts] = useState<IPopulatedPayout[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPayouts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(APP_ROUTES.PAYOUT.LIST);
      setPayouts(data.data);
    } catch (error: any) {
      const message =
        error.response?.data?.message || FEEDBACK_MESSAGES.PAYOUT.ERROR.FETCH;
      toast.error(message);
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleProcessPayout = async (payout: IPopulatedPayout) => {
    setIsSubmitting(true);
    try {
      const { data: response } = await axiosInstance.post(
        APP_ROUTES.PAYOUT.CREATE_ORDER,
        { payoutId: payout._id },
      );
      const {
        orderId,
        amount,
        currency,
        keyId,
        operatorName,
        payoutDescription,
      } = response.data;

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
        name: `Payout to ${operatorName}`,
        description: payoutDescription,
        order_id: orderId,

        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await axiosInstance.post(APP_ROUTES.PAYOUT.VERIFY_PAYMENT, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              payoutId: payout._id,
            });

            toast.success(FEEDBACK_MESSAGES.PAYOUT.SUCCESS.COMPLETED);
            fetchPayouts();
          } catch (error: any) {
            toast.error(
              error.response?.data?.message ||
                FEEDBACK_MESSAGES.PAYMENT.ERROR.PAYMENT_VERIFICATION,
            );
            console.error(error.message);
          } finally {
            setIsSubmitting(false);
          }
        },

        prefill: {
          name: payout.operatorId?.name || "",
          email: payout.operatorId?.email || "",
          contact: payout.operatorId?.mobile || "",
        },
        theme: {
          color: "#59669",
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
          FEEDBACK_MESSAGES.PAYOUT.ERROR.INITIATE,
      );
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);
  return { payouts, loading, isSubmitting, handleProcessPayout, fetchPayouts };
};
