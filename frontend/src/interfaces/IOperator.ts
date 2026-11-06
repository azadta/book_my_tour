import type { BaseFormData, ISubscriptionDetails } from "./interfaces";

interface IBusinessAddress {
  buildingNo?: string;
  landmark?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

interface IVerificationDetails {
  companyName?: string;
  licenseNo?: string;
  businessAddress?: IBusinessAddress;
  submittedAt?: Date;
}

export interface IOperator {
  _id: string;
  name: string;
  email: string;
  image: string;
  mobile?: string;
  isVerified: boolean;
  isBlocked: boolean;
  isPremium: boolean;
  verificationDetails?: IVerificationDetails;
  subscriptionDetails?: ISubscriptionDetails;
  referralCode?: string;
  referredBy?: string;
}

export type OperatorFormType = Omit<
  IOperator,
  "_id" | "isVerified" | "subscriptionDetails"
> &
  BaseFormData;
