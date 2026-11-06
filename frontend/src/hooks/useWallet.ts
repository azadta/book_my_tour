import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import type { IWalletTransaction } from "@/interfaces/interfaces";
import type { RootState } from "@/redux/store";
import { handleApiError } from "@/utils/axiosErrorHandler";
import { loadRazorpayScript } from "@/utils/loadRazorpay";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
export const useWallet = (limit: number = 5) => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<IWalletTransaction[]>([]);
  const [topupAmount, setTopupAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { currentUser } = useSelector((state: RootState) => state.user);

  const fetchWallet = useCallback(async (page: number = currentPage) => {
    try {
      const { data } = await axiosInstance.get(
        `${APP_ROUTES.WALLETS.USER.LIST}?page=${page}&limit=${limit}`,
      );

      setBalance(data.result.balance);
      setTransactions(data.result.transactions);
      setTotalPages(data.result.totalPages);
    } catch (error) {
      handleApiError(error);
    }
  },[currentPage,limit])

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
      const { data } = await axiosInstance.post(APP_ROUTES.WALLETS.USER.TOPUP, {
        amount: amountToTopup,
      });
      const { orderId, amount, currency, keyId } = data.result;
      const options = {
        key: keyId,
        amount,
        currency,
        name: "Book My Tour",
        description: "wallet Top-up",
        order_id: orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            await axiosInstance.post(APP_ROUTES.WALLETS.USER.VERIFY_TOPUP, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success(FEEDBACK_MESSAGES.WALLET.SUCCESS.RECHARGE);
            setTopupAmount("");
            setCurrentPage(1);
            fetchWallet(1);
          } catch (error) {
            handleApiError(error);
          } finally {
            setIsLoading(false);
          }
        },

        modal: {
          ondismiss: () => setIsLoading(false),
        },
        theme: { color: "#2563eb" },
      };
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const razorpayObj = new (window as any).Razorpay(options);
      razorpayObj.open();
    } catch (error) {
      handleApiError(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (currentUser) {
      fetchWallet(currentPage);
    }
  }, [currentUser,fetchWallet,currentPage]);

  return {
    handleTopup,
    isLoading,
    balance,
    transactions,
    topupAmount,
    setTopupAmount,
    currentPage,
    setCurrentPage,
    totalPages,
  };
};
