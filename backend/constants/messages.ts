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
} as const;
