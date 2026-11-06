import type { ICouponItem } from "./interfaces";

export type CouponFormData=Partial<Omit<ICouponItem,'_id'|'createdAt'|'updatedAt'|'allowedBins'|'validTill'>>&{
    allowedBins?:string,
    validTill?:string
}