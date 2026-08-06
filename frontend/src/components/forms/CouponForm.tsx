import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";
import { useCoupon } from "@/hooks/useCoupon";
import { useCouponManagement } from "@/hooks/useCouponManagement";
import type { ICouponItem } from "@/interfaces/interfaces";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import BackToDashboard from "../BackToDashboard";
import ReUsableForm from "./ReUsableForm";
import {  getCouponFields } from "@/formConfig/fields";

interface CouponFormProps {
  mode: "create" | "edit";
  couponData?: ICouponItem;
  role: "operator" | "admin";
}

const CouponForm = ({ mode, couponData, role }: CouponFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const hook = useCouponManagement();
  const loading = hook.loading;

  const handleSubmit = async (data: any) => {
    try {
        const payload={...data}
        if(payload.type!=='BANK'){
            delete payload.bankName
            delete payload.allowedBins

        }
      if (mode === "create") {
        await hook.createCoupon(data);
        toast.success(FEEDBACK_MESSAGES.COUPON.SUCCESS.CREATE);
        setFormData({
          type: "GENERAL",
          discoutType: "PERCENTAGE",
          minBookingAmount: 0,
          isActive: true,
        });
      } else {
        await hook.updateCoupon(couponData?._id as string, data);
        toast.success(FEEDBACK_MESSAGES.COUPON.SUCCESS.UPDATE);
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setFieldError(error.response.data.errors);
        return;
      }
      toast.error(
        error.response?.data?.message ??
          `Failed to ${mode === "create" ? "create" : "update"} package`,
      );
    }
  };

  const activeFields=useMemo(()=>getCouponFields(formData),[formData?.type])
  useEffect(() => {
    if (couponData) {
      setFormData({
        ...couponData,
        validTill: couponData.validTill
          ? new Date(couponData.validTill).toISOString().split("T")[0]
          : "",
        allowedBins: Array.isArray(couponData.allowedBins)
          ? couponData.allowedBins.join(", ")
          : couponData.allowedBins || "",
      });
    } else {
      setFormData({
        type: "GENERAL",
        discoutType: "PERCENTAGE",
        minBookingAmount: 0,
        isActive: true,
      });
    }
  }, [couponData]);
  return (
    <div className="p-6 max-w-4xl  mt-10 mb-10 mx-auto">
      <div className="mb-5">
        <BackToDashboard
          path={`/${role === "admin" ? "admin" : "operator"}/dashboard`}
        />
      </div>

      <ReUsableForm
        heading={mode === "create" ? "Create Coupon" : "Update Coupon"}
        formData={formData}
        setFormData={setFormData}
        fields={activeFields}
        buttonText={mode === "create" ? "Create Coupon" : "Update Coupon"}
        loading={loading}
        onSubmit={handleSubmit}
        fieldError={fieldError}
        setFieldError={setFieldError}
        initialData={couponData}
      />
    </div>
  );
};

export default CouponForm;
