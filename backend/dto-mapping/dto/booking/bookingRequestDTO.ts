export interface CancelBookingRequestDTO {
  userId: string;
  bookingId: string;
  reason: string;
}

export interface CreateBookingRequestDTO {
  userId: string;
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
    dob:  Date;
    gender: "male" | "female" | "other";
    passportNumber: string|null;
  }>;
  addedActivityIds?: string[];
  removedActivityIds: string[];
  generalCouponCode?: string;
  bankCouponCode?: string;
  isWalletApplied?: boolean;
}

export interface VerifyPaymentRequestDTO {
  userId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  packageId: string;
}

export interface UpdateAttendanceRequestDTO {
  bookingId: string;
  operatorId: string;
  attendance: string;
}

export interface OperatorCancelBookingRequestDTO {
  bookingId: string;
  operatorId: string;
  reason: string;
}

export interface OperatorRescheduleBookingRequestDTO {
  bookingId: string;
  operatorId: string;
  startDate: string;
}

export interface VerifyCancellationRequestDTO {
  bookingId: string;
  operatorId: string;
  action: "APPROVE" | "REJECT";
  operatorNotes?: string;
}

export interface GetOperatorBookingsQueryDTO {
  operatorId: string;
  status?: string;
  skip: number;
  limit: number;
}

export interface ProcessAdminCancellationRequestDTO {
  bookingId: string;
  approve: boolean;
  adminNotes?: string;
}
