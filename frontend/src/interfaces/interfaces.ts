export interface FormField {
  id: string;
  type: string;
  placeholder?: string;
  label: string;
  options?: { label: string; value: string }[];
  multiple?: boolean;
  disabled?: boolean;
  required: boolean;
  readOnly?: boolean;
}

export interface Ilocation {
  latitude: number;
  longitude: number;
}

export interface Destination {
  _id: string;
  name: string;
  location: Ilocation;
  images: string[];
  createdAt: Date;
}

interface Operator {
  _id: string;
  name: string;
}
export interface ICategory {
  _id: string;
  name: string;
}

export interface IActivity {
  id: string;
  name: string;
  cost: number;
  customizable: boolean;
}

export interface IOptionalActivity {
  id: string;
  name: string;
  cost: number;
}

export interface IItineraryDay {
  day: number;
  title: string;
  description: string;
  gallery: string[];
  activities: IActivity[];
  optionalActivities: IOptionalActivity[];
}

export interface IPackageItem {
  _id: string;
  name: string;
  amount: number;
  destinations: Destination[];
  specifications?: string;

  startDate?: string;
  duration: { day: number; night: number };
  remark?: string;
  discount?: number;
  availableSlots?: string;
  images: string[];

  category: ICategory;
  operatorId?: Operator;
  itinerary: IItineraryDay[];
  createdAt?: string;
  updatedAt?: string;
}

export interface INote {
  _id: string;
  text: string;
  createdAt: string;
}

export interface IWishlistGroup {
  _id: string;
  userId: string;
  title: string;
  description: string;
  packages: IPackageItem[];
  notes: INote[];
  shareToken?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IReviewItem {
  _id: string;
  userId: { _id: string; name: string; image?: string };
  rating: number;
  categoryRatings: {
    guide: number;
    value: number;
    itinerary: number;
    transport: number;
  };
  comment: string;
  travelerType: string;
  createdAt: string;
  images?: string[];
}

export interface IReviewStats {
  totalReviews: number;
  averageRating: number;
  avgGuide: number;
  avgValue: number;
  avgItinerary: number;
  avgTransport: number;
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
}

export interface IAppliedCoupon {
  couponId: string;
  code: string;
  title: string;
  type: "GENERAL" | "BANK";
  discountAmount: number;
}
export interface IPricing {
  baseAmount: number;
  addedActivitiesAmount: number;
  removedActivitiesAmount: number;
  subtotal: number;
  generalCoupon: IAppliedCoupon | null;
  bankCoupon: IAppliedCoupon | null;
  totalDiscount: number;
  walletApplied: number;
  finalAmount: number;
}

export interface IBookingResponse {
  _id: string;
  userId: string;
  packageId: IPackageItem;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  pricing: IPricing;
  addedActivityIds: string[];
  removedActivityIds: string[];
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export type IBookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCEL_REQUESTED"
  | "FAILED"
  | "CANCELLED";

export interface IBookingCancellation {
  requestedAt?: string | null;
  processedAt?: string | null;
  refundAmount: number;
  reason: string;
  adminNotes: string;
}

export interface IBookingCustomer {
  _id: string;
  name: string;
  email: string;
  phone: string;
}
export interface IBookingPackageDestination {
  _id?: string;
  name: string;
}
export interface IBookingPackage {
  _id: string;
  name: string;
  amount: number;
  startDate: string;
  destinations: IBookingPackageDestination[];
  duration: {
    day: number;
    night: number;
  };
  images?: string[];
  operatorId: string;
}
export type IAttendanceStatus =
  | "PENDING"
  | "CHECKED_IN"
  | "COMPLETED"
  | "NOT_SHOW";

export interface IPopulatedBooking {
  _id: string;
  userId: IBookingCustomer;
  packageId: IBookingPackage;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  addedActivityIds: string[];
  removedActivityIds: string[];
  status: IBookingStatus;
  attendance: IAttendanceStatus;
  checkInTime: string | null;
  cancellation: IBookingCancellation;
  pricing: IPricing;
  createdAt: string;
  updatedAt: string;
}

export interface ICouponItem {
  _id: string;
  code: string;
  title: string;
  description: string;
  type: "GENERAL" | "BANK";
  discountType: "PERCENTAGE" | "FLAT";
  discountValue: number;
  maxDiscountAmount?: number;
  minBookingAmount: number;
  bankName?: string;
  allowedBins?: string[];
  razorpayOfferId?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  validTill: string;
}

export interface CouponFormValues {
  code: string;
  title: string;
  description: string;
  type: "GENERAL" | "BANK";
  discountType: "PERCENTAGE" | "FLAT";
  discountValue: number;
  maxDiscountAmount?: number;
  minBookingAmount: number;
  bankName?: string;
  allowedBins?: string;
  isActive: boolean;
  validTill: string;
}

export interface IWalletTransaction {
  _id: string;
  transactionId: string;
  type: "DEBIT" | "CREDIT";
  purpose: string;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  description: string;
  createdAt: string;
}
