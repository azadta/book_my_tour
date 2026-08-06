import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import type { ICouponItem } from "@/interfaces/interfaces";
import { useCallback, useEffect, useState } from "react";

export const useCouponList = (page: number, limit: number) => {
  const [coupons, setCoupons] = useState<ICouponItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `${APP_ROUTES.OPERATOR.COUPONS}?page=${page}&limit=${limit}`,
      );
      setCoupons(res.data.coupons || []);
      setTotalCount(res.data.totalCount || 0);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  const toggleCouponStatus = useCallback(
    async (id: string, currentStatus: boolean) => {
      setLoading(true);
      try {
        await axiosInstance.patch(
          APP_ROUTES.OPERATOR.TOGGLE_COUPON_STATUS(id),
          { isActive: !currentStatus },
        );
        await fetchCoupons();
      } finally {
        setLoading(false);
      }
    },
    [fetchCoupons],
  );

  useEffect(() => {
    fetchCoupons();
  }, []);

  return { coupons, totalCount, loading, toggleCouponStatus };
};
