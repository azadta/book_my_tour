import { StatusCode } from "./statusCodeConstants";

export const RESPONSE_MESSAGES = {
  AUTH: {
    SUCCESS: {
      OTP_SENT_EMAIL: "Otp sent to your registered email",
      OTP_RESENT_EMAIL: "Otp resent to email",
      OTP_VERIFIED: "OTP verified successfully",
      PASSWORD_UPDATE: "Password updated successfully",
      RESET_LINK_SENT: "Reset link sent to email",
      ADMIN_LOGOUT: "Admin has been logged out",
      OPERATOR_LOGOUT: "Operator has been logged out",
      USER_LOGOUT: "User has been logged out",
    },
    ERROR: {
      UNAUTHORIZED: "Unauthorized,Please Login Again",
      ACCESS_DENIED: "Access denied: Insufficient permissions",
      TOKEN_MISSING: "Unauthorized: No token provided",
      NO_REFRESH_TOKEN: "No refresh token",
      INVALID_CREDENTIALS: "Invalid email or password",
      OLD_PASSWORD_INCORRECT: "Old password is incorrect",
      PASSWORD_MISMATCH: "Password do not match",
      EMAIL_EXISTS: "Email already exists",
      EMAIL_ALREADY_VERIFIED: "Email is already verified",
      OTP_EXPIRED_OR_INVALID: "OTP is expired or invalid",
      INVALID_TOKEN: "Token invalid or expired",
      EXPIRED_TOKEN: "Token expired",
      ACCOUNT_BLOCKED: "Your account has been blocked, Please contact support",
      SERVER_ERROR: "Internal server error",
    },
  },
  ADMIN: {
    ERROR: {
      NOT_FOUND: "Admin not found",
    },
  },
  USER: {
    SUCCESS: {
      BLOCKED: "user is blocked",
      UNBLOCKED: "user unblocked",
      DELETED: "User deleted successfully",
    },
    ERROR: {
      NOT_FOUND: "User not found",
    },
  },
  OPERATOR: {
    SUCCESS: {
      BLOCKED: "operator is blocked",
      UNBLOCKED: "operator unblocked",
      DELETED: "Operator deleted successfully",
    },
    ERROR: {
      NOT_FOUND: "Operator not found",
      NOT_VERIFIED: "Operator not verified by the admin",
    },
  },
  DESTINATION: {
    SUCCESS: {
      CREATED: "Destination created",
      DELETED: "Destination deleted",
    },
    ERROR: {
      ALREADY_EXISTS: "Destination with same name already exists",
      NOT_FOUND: "Destination not found",
    },
  },
  PACKAGE: {
    SUCCESS: {
      DELETED: "Package deleted successfully",
    },
    ERROR: {
      NOT_FOUND: "Package not found",
      NAME_ALREADY_EXIST: "Package  name already exists",
      NOTFOUND_OR_UNAUTHORIZED: "Pacakage not found or unauthorized",
    },
  },
  CATEGORY: {
    SUCCESS: {
      CREATED: "Category created",
    },
    ERROR: {
      ALREADY_EXIST: "Category already exist",
    },
  },
  SYSTEM: {
    ERROR: {
      MISSNG_ACCESS_SECRET:
        "JWT_ACCESS_SECRET is not defined in environment variables",
      MISSING_REFRESH_SECRET:
        "JWT_REFRESH_SECRET is not defined in environment variables",
    },
  },
  VALIDATION: {
    ERROR: {
      ALL_FIELDS_REQUIRED: "Please enter all fields",
      VALIDATION_ERROR: "Validation Error",
    },
  },
  WISHLIST: {
    SUCCESS: {
      DELETE: "Wishlist Group deleted successfully",
    },
    ERROR: {
      NOT_FOUND: "Wishlist group not found",
      UPDATE: "Failed to update wishlist group",
      UNAUTHORIZED_OR_NOT_FOUND: "Unauthorized or group not found",
      ADD_NOTE: "Failed to add note",
      LINK_EXPIRE_OR_NOT_FOUND:
        "Shared wishlist folder not found or link expired",
    },
  },
  REVIEW: {
    SUCCESS: {
      UPDATE: "review updated successfully",
      DELETE: "review deleted successfully",
    },
    ERROR: {
      ALREADY_EXIST: "You have already submitted a review for this package",
      NOT_FOUND: "User review not found",
      FORBIDDEN: "Unauthorized to edit this review",
    },
  },
  BOOKING: {
    SUCCESS: {
      CONFIRM: "Booking confirmed successfully",
      CANCEL_WITH_FULL_REFUND:
        "Booking cancelled successfully. 100% refund added to your wallet",
      CANCEL_REQ_SUBMITTED:
        "Cancellation request submitted. Subject to admin approval(50% estimated refund).",
      CANCEL_REQ_APPROVED_REFUND:
        "Cancellation request approved and refund processed to wallet",
      CANCEL_REQ_REJECTED:
        "Cancellation request rejected. Booking remains confirmed.",
      CANCEL_BY_OPERATOR:
        "Booking cancelled successfully and full refund issued to guest wallet",
      DATE_RESCHEDULED_BY_OPERATOR: "Tour date rescheduled successfully",
    },
    ERROR: {
      INVALID_SIGNATURE:
        "Payment verification failed. Invalid transaction signature.",
      NOT_FOUND: "Booking records not found",
      INVALID_ORDER_ID: "Invalid order ID",
      INVALID_USER_ID: "Invalid user ID",
      USER_ID_MISSING: "User ID is required",
      CANCEL_NOT_CONFIRM_STATUS: "Only confirmed bookings can be cancelled",
      CANCEL_AFTER_START_DATE:
        "Cannot cancel a tour that has already started or passed",
      CANCEL_REQ_NOT_FOUND: "No pending cancellation request found",
      ATTENDANCE_CHANGE_FOR_NOT_CONFIRMED:
        "Attendance can only be updated for confirmed bookings",
      CANCEL_REASON_MISSING: "Cancellation reason is required",
      START_DATE_MISSING: "New start date is required",
      NOT_CANCEL_REQUESTED_STATUS: "Booking is not in CANCEL_REQUESTED status",
      INVALID_ACTION: "Invalid action type",
    },
  },
  PAYMENT: {
    ERROR: {
      INITIATE: "Failed to initiate payment order",
      RAZORPAY_OFFER: "Razorpay offer creation error",
      PAYMETNT_SIGNATURE: "Invalid payment signature",
    },
  },

  COUPON: {
    SUCCESS: {
      CREATED: "Coupon created successfully",
      UPDATE: "Coupon updated successfully",
      TOGGLE_STATUS: (isActive: boolean) =>
        `Coupon ${isActive ? "activated" : "deactivated"} successfully`,
    },
    ERROR: {
      INVALID_CODE: "Invalid or expired coupon code",
      MINIMUM_AMOUNT: (minAmount: Number) =>
        `Minimum booking amount of Rs ${minAmount} required for this coupon`,
      CARD_BIN_MISSING:
        "Card Bin (first 6 digits) required to validate bank offer",
      BANK_MISMATCH: (bankName: string) =>
        `This offer is only for selected ${bankName || "Bank"} cards`,
      CODE_AND_BOOKING_AMOUNT_MISSING:
        "Coupon code and booking amount are required",
      NOT_FOUND: "Coupon not found",
      COUPON_CODE_MISSING: "Coupon code is required",
      CODE_ALREADY_EXIST: "Coupon code already exist",
    },
  },
  WALLET: {
    ERROR: {
      NON_POSITIVE_AMOUNT: "Amount must be greater than zero",
      TRANSACTION_FAILED: "Failed to process wallet transaction",
    },
  },
} as const;
