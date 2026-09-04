export interface CancelBookingRequestDTO {
  userId: string;
  bookingId: string;
  reason: string;
}

export interface CreateBookingRequestDTO {
  userId: string;
  packageId: string;
  addedActivityIds?: string[];
  removedActivityIds: string[];
  generalCouponCode?: string;
  bankCouponCode?: string;
  useWallet?: boolean;
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

export interface ProcessAdminCancellationRequestDTO{
  bookingId:string,
  approve:boolean,
  adminNotes?:string
}
