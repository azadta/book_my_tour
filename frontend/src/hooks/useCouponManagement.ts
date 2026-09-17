import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { formatCouponPayload } from "@/utils/formatCouponPayload";
import { useCallback, useState } from "react";

export const useCouponManagement = () => {
    const [loading,setLoading]=useState(false)
 
  const createCoupon = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const payload = formatCouponPayload(data);
      const res = await axiosInstance.post(
        APP_ROUTES.COUPONS.OPERATOR.CREATE,
        payload,
      );
      return res.data;
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
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCoupon = useCallback(async (id: string, data: any) => {
    setLoading(true);
    try {
      const payload = formatCouponPayload(data);
      const res = await axiosInstance.put(
        APP_ROUTES.COUPONS.OPERATOR.UPDATE(id),
        payload,
      );
      return res.data;
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
