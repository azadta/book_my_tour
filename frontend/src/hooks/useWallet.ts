import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import type { IWalletTransaction } from "@/interfaces/interfaces";
import type { RootState } from "@/redux/store";
import { loadRazorpayScript } from "@/utils/loadRazorpay";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export const useWallet = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<IWalletTransaction[]>([]);
  const [topupAmount, setTopupAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.user);

  const fetchWallet = async () => {
    try {
      const { data } = await axiosInstance.get(APP_ROUTES.USER.WALLET);
      console.log('data from fetchWallet:',data)
      setBalance(data.balance);
      setTransactions(data.transactions.reverse());
    } catch (error: any) {
      const message =
        error.response?.data?.message || FEEDBACK_MESSAGES.WALLET.ERROR.FETCH;
      toast.error(message);
      console.error(message, error);
    }
  };

  const handleTopup = async (amountToTopup: number) => {
    if (!amountToTopup || amountToTopup <= 0) {
      toast.error(FEEDBACK_MESSAGES.WALLET.ERROR.INVALID_TOPUP_AMOUNT);
      return;
    }
    setIsLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error(FEEDBACK_MESSAGES.PAYMENT.ERROR.RAZORPAY_LOAD);
        setIsLoading(false);
        return;
      }
      const { data } = await axiosInstance.post(APP_ROUTES.USER.WALLET_TOPUP, {
        amount: amountToTopup,
      });
      const { orderId, amount, currency, keyId } = data;
      const options = {
        key: keyId,
        amount,
        currency,
        name: "Book My Tour",
        description: "wallet Top-up",
        order_id: orderId,
        handler: async (response: any) => {
          try {
            await axiosInstance.post(APP_ROUTES.USER.VERIFY_WALLET_TOPUP, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success(FEEDBACK_MESSAGES.WALLET.SUCCESS.RECHARGE);
            (setTopupAmount(""), fetchWallet());
          } catch (error: any) {
            const message =
              error.response?.data?.message ||
              FEEDBACK_MESSAGES.PAYMENT.ERROR.PAYMENT_VERIFICATION;
            toast.error(message);
            console.error(message, error);
          } finally {
            setIsLoading(false);
          }
        },

        modal: {
          ondismiss: () => setIsLoading(false),
        },
        theme: { color: "#2563eb" },
      };
      const razorpayObj = new (window as any).Razorpay(options);
      razorpayObj.open();
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        FEEDBACK_MESSAGES.WALLET.ERROR.INITIATE_TOPUP;
      toast.error(message);
      console.error(message, error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (currentUser) {
      fetchWallet();
    }
  }, [currentUser]);

  return {
    handleTopup,
    isLoading,
    balance,
    transactions,
    topupAmount,
    setTopupAmount,
  };
};
