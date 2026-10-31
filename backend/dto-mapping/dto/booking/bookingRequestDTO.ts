export interface CancelBookingRequestDTO {
  reason: string;
}

export interface CreateBookingRequestDTO {
  packageId: string;
  adultCount: number;
  childCount: number;
  primaryContact: {
    name: string;
    email: string;
    phone: string;
  };
  members: Array<{
    type: "adult" | "child";
    firstName: string;
    lastName: string;
    dob: Date;
    gender: "male" | "female" | "other";
    passportNumber: string | null;
  }>;
  addedActivityIds?: string[];
  removedActivityIds: string[];
  generalCouponCode?: string | null;
  bankCouponCode?: string | null;
  isWalletApplied?: boolean;
}

export interface VerifyPaymentRequestDTO {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  packageId: string;
}

export interface UpdateAttendanceRequestDTO {
  attendance: string;
}

export interface OperatorCancelBookingRequestDTO {
  reason: string;
}

export interface OperatorRescheduleBookingRequestDTO {
  startDate: Date;
}

export interface VerifyCancellationRequestDTO {
  action: "APPROVE" | "REJECT";
  operatorNotes?: string;
}

export interface GetOperatorBookingsQueryDTO {
  status?: string;
  skip: number;
  limit: number;
}
export interface GetOperatorBookingsQuery {
  page?: string;
  status?: number;
  limit?: number;
}

export interface ProcessAdminCancellationRequestDTO {
  approve: boolean;
  adminNotes: string;
}

export interface ProcessAdminCancellationBody {
  approve: boolean;
  adminNotes: string;
}

export interface OperatorCancelBookingBody {
  reason: string;
}

export interface toOperatorReschuduleBookingBody {
  startDate: Date;
}

export interface UpdateAttendanceBody {
  attendance: string;
}

export interface toVerifyCancellationBody {
  action: "APPROVE" | "REJECT";
  operatorNotes: string;
}

export interface CreateBookingBody {
  packageId: string;
  adultCount: number | string;
  childCount?: number | string;
  primaryContact: {
    name: string;
    email: string;
    phone: string;
  };
  members: {
    type: "adult" | "child";
    firstName: string;
    lastName: string;
    dob: string;
    gender: "male" | "female" | "other";
    passportNumber?: string | null;
  };
  addedActivityIds?: string[];
  removedActivityIds?: string[];
  generalCouponCode?: string | null;
  bankCouponCode?: string | null;
  isWalletApplied?: boolean | string;
}

export interface VerifyBookingPaymentBody {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  packageId: string;
}

export interface CancelBookingBody {
  reason: string;
}
