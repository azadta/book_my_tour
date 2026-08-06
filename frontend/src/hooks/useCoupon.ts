import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import type { ICouponItem } from "@/interfaces/interfaces";
import { useState } from "react";
import { toast } from "react-toastify";

export const useCoupon = () => {
  const [bankOffers, setBankOffers] = useState<ICouponItem[]>([]);
  const [generalCoupons, setGeneralCoupons] = useState<ICouponItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance(APP_ROUTES.USER.COUPONS);
      setBankOffers(data.bankOffers || []);
      setGeneralCoupons(data.generalCoupons || []);
    } catch (error: any) {
      const message =
        error.response?.data?.message || FEEDBACK_MESSAGES.COUPON.ERROR.FETCH;
      (toast.error(message), console.error(message, error));
    } finally {
      setLoading(false);
    }
  };

  return { fetchCoupons, bankOffers, generalCoupons, loading };
};
