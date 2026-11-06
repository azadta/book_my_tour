import type { CouponFormData } from "@/interfaces/ICoupon";



export const formatCouponPayload = (data:CouponFormData) => {
  return {
    ...data,
    code: data.code ? data.code.toUpperCase().trim() : "",
    allowedBins:
      typeof data.allowedBins === "string"
        ? data.allowedBins
            .split(",")
            .map((bin: string) => bin.trim())
            .filter(Boolean)
        : data.allowedBins,
  };
};
