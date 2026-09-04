import { Ipackage } from "../../../models/Package";

export interface BookingCouponDTO {
  couponId: string;
  code: string;
  title: string;
  type: "GENERAL" | "BANK";
  discountAmount: number;
}
export interface BookingPricingDTO {
  baseAmount: number;
  addedActivitiesAmount: number;
  removedActivitiesAmount: number;
  subtotal: number;
  generalCoupon: BookingCouponDTO | null;
  bankCoupon: BookingCouponDTO | null;
  totalDiscount: number;
  walletApplied: number;
  finalAmount: number;
}

export interface BookingCancellationDTO {
  requestedAt: string | null;
  processedAt: string | null;
  refundAmount: number;
  reason: string;
  adminNotes: string;
}

export interface BookingResponseDTO {
  _id: string;
  userId: string;
  packageId: {
    _id: string;
    name: string;
    startDate: string;
    images: string[];
  };
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  addedActivityIds: string[];
  removedActivityIds: string[];
  status: "PENDING" | "CONFIRMED" | "CANCEL_REQUESTED" | "FAILED" | "CANCELLED";
  attendance: "PENDING" | "CHECKED_IN" | "NOT_SHOW" | "COMPLETED";
  checkInTime: string | null;
  cancellation: BookingCancellationDTO;
  pricing: BookingPricingDTO;
  createdAt: string;
  updatedAt: string;
}

export interface cancelBookingResponseDTO {
  requiresAdminApproval: boolean;
  refundAmount: number;
  message: string;
  booking: BookingResponseDTO;
}

export interface CreateBookingOrderResponseDTO {
  orderId: string;
  amount: number;
  currency: string;
  isFullyPaidByWallet: boolean;
  keyId: string;
  packageName: string;
  packageDescription: string;
}

export interface VerifyPamentResponseDTO {
  message: string;
  bookingId?: string;
}

export interface OperatorBookingListResponseDTO {
  bookings: BookingResponseDTO[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface PendingCancellationItemResponseDTO {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  package: {
    _id: string;
    name: string;
    startDate?: string;
  };
  cancellationReason?: string;
  requestedAt?: string;
  refundAmount: number;
}

export interface ProcessAdminCancellationResponseDTO {
  success: boolean;
  message: string;
  data: BookingResponseDTO;
}
