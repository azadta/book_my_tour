import CouponForm from "@/components/forms/CouponForm";
import Loading from "@/components/Loading";
import { useCouponManagement } from "@/hooks/useCouponManagement";
import type { ICouponItem } from "@/interfaces/interfaces";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EditCoupon = () => {
  const { couponId } = useParams<{ couponId: string }>();
  const [couponData, setCouponData] = useState<ICouponItem | undefined>();
  const { fetchCouponById, loading } = useCouponManagement();

  useEffect(() => {
    const loadCoupon = async () => {
      if (couponId) {
        const data = await fetchCouponById(couponId);
        setCouponData(data);
      }
    };
    loadCoupon();
  }, [couponId, fetchCouponById]);

  if (loading || !couponData) {
    return <Loading />;
  }

  return <CouponForm mode="edit" couponData={couponData} role="operator" />;
};

export default EditCoupon;
