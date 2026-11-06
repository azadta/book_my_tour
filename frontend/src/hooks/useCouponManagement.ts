import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import type { CouponFormData } from "@/interfaces/ICoupon";
import { formatCouponPayload } from "@/utils/formatCouponPayload";
import { useCallback, useState } from "react";

export const useCouponManagement = () => {
    const [loading,setLoading]=useState(false)
 
  const createCoupon = useCallback(async (data:CouponFormData) => {
    setLoading(true);
    try {
      const payload = formatCouponPayload(data);
      const res = await axiosInstance.post(
        APP_ROUTES.COUPONS.OPERATOR.CREATE,
        payload,
      );
      return res.data.result;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCouponById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        APP_ROUTES.COUPONS.OPERATOR.DETAIL(id),
      );
      return res.data.result;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCoupon = useCallback(async (id: string, data: CouponFormData) => {
    setLoading(true);
    try {
      const payload = formatCouponPayload(data);
      const res = await axiosInstance.put(
        APP_ROUTES.COUPONS.OPERATOR.UPDATE(id),
        payload,
      );
      return res.data.result;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
     loading,
    createCoupon,
    fetchCouponById,
    updateCoupon,
  };
};
