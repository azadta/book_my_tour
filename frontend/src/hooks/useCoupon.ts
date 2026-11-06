import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import type { ICouponItem } from "@/interfaces/interfaces";
import { handleApiError } from "@/utils/axiosErrorHandler";
import { useCallback, useState } from "react";

export const useCoupon = () => {
  const [bankOffers, setBankOffers] = useState<ICouponItem[]>([]);
  const [generalCoupons, setGeneralCoupons] = useState<ICouponItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance(APP_ROUTES.COUPONS.USER.LIST);
      setBankOffers(data.result.bankOffers || []);
      setGeneralCoupons(data.result.generalCoupons || []);
    } catch (error: unknown) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  },[])

  return { fetchCoupons, bankOffers, generalCoupons, loading };
};
