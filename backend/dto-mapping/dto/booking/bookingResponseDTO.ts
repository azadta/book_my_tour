import { HydratedDocument, Types } from "mongoose";

import { IUser } from "../../../interfaces/IUser";
import { Ipackage } from "../../../models/Package";
import { IBookingDocument } from "../../../models/Booking";

export interface BookingCouponDTO {
  couponId: string;
  code: string;
  title: string;
  type: "GENERAL" | "BANK";
  discountAmount: number;
}
export interface BookingPricingDTO {
  baseAmount: number;
  adultCount: number;
  childCount: number;
  adultUnitPrice: number;
  childUnitPrice: number;
  adultAmount: number;
  childAmount: number;
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
  userId: { _id: string; name: string; email: string } | string;
  packageId:
    | {
        _id: string;
        name: string;
        startDate: string;
        images: string[];
      }
    | string;
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

export type BookingResponseInput = Omit<
  IBookingDocument,
  "packageId" | "userId"
> & {
  packageId: Types.ObjectId | HydratedDocument<Ipackage>;
  userId: Types.ObjectId | HydratedDocument<IUser>;
};

export interface cancelBookingResponseDTO {
  requiresAdminApproval: boolean;
  refundAmount: number;
  message: string;
  booking: BookingResponseDTO;
}
export interface cancelBookingResponseinput {
  requiresAdminApproval: boolean;
  refundAmount: number;
  message: string;
  booking: BookingResponseInput;
}

export interface CreateBookingOrderResponseDTO {
  orderId: string;
  bookingId: string;
  amount: number;
  currency: string;
  isFullyPaidByWallet: boolean;
  keyId: string;
  packageName: string;
  packageDescription: string;
}
export interface CreateBookingOrderResponseInput {
  orderId: string;
  bookingId: Types.ObjectId;
  amount?: number;
  currency?: string;
  isFullyPaidByWallet: boolean;
  keyId?: string;
  packageName?: string;
  packageDescription?: string;
}

export interface VerifyPamentResponseDTO {
  message: string;
  bookingId?: string;
}
export interface VerifyPamentResponseInput {
  message: string;
  bookingId?: Types.ObjectId;
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

export type PendingCancellationInput = Omit<
  IBookingDocument,
  "packageId" | "userId"
> & {
  packageId: {
    _id: Types.ObjectId;
    name: string;
    startDate?: Date;
  };
  userId: {
    _id: Types.ObjectId;
    name: string;
    email: string;
    phone?: string;
  };
};
