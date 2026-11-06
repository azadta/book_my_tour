import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { getCouponFields } from "@/formConfig/fields";
import { useCouponManagement } from "@/hooks/useCouponManagement";
import type { ICouponItem } from "@/interfaces/interfaces";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ReUsableForm from "./ReUsableForm";
import type { CouponFormData } from "@/interfaces/ICoupon";
import { isAxiosError } from "axios";

interface CouponFormProps {
  mode: "create" | "edit";
  couponData?: ICouponItem;
  role: "operator" | "admin";
}

const CouponForm = ({ mode, couponData }: CouponFormProps) => {
  const [formData, setFormData] = useState<CouponFormData>({});
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const hook = useCouponManagement();
  const loading = hook.loading;

  const handleSubmit = async (data: CouponFormData) => {
    try {
      const payload = { ...data };
      if (payload.type !== "BANK") {
        delete payload.bankName;
        delete payload.allowedBins;
      }
      if (mode === "create") {
        await hook.createCoupon(payload);
        toast.success(FEEDBACK_MESSAGES.COUPON.SUCCESS.CREATE);
        setFormData({
          type: "GENERAL",
          discountType: "PERCENTAGE",
          minBookingAmount: 0,
          isActive: true,
        });
      } else {
        await hook.updateCoupon(couponData?._id as string, payload);
        toast.success(FEEDBACK_MESSAGES.COUPON.SUCCESS.UPDATE);
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const errors = error.response?.data?.errors;
        if (errors) {
          setFieldError(errors);
          return;
        }
        toast.error(
          error.response?.data?.message ??
            FEEDBACK_MESSAGES.GLOBAL.ERROR.SOMETHINK_WENT_WRONG,
        );
        console.error(error.message);
      } else if (error instanceof Error) {
        toast.error(FEEDBACK_MESSAGES.GLOBAL.ERROR.SOMETHINK_WENT_WRONG);
        console.error(error.message);
      } else {
        toast.error(FEEDBACK_MESSAGES.GLOBAL.ERROR.SOMETHINK_WENT_WRONG);
        console.error(error);
      }
    }
  };

  const activeFields = useMemo(
    () => getCouponFields(formData),
    [formData],
  );
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
        discountType: "PERCENTAGE",
        minBookingAmount: 0,
        isActive: true,
      });
    }
  }, [couponData]);
  return (
    <div className="p-6 max-w-3xl  mt-10 mb-10 mx-auto">
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
