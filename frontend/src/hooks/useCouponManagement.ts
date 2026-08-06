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
        APP_ROUTES.OPERATOR.CREATE_COUPON,
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
        APP_ROUTES.OPERATOR.FETCH_COUPON_BY_ID(id),
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
        APP_ROUTES.OPERATOR.UPDATE_COUPON(id),
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
