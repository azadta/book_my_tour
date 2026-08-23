export const FEEDBACK_MESSAGES = {
  GLOBAL: {
    ERROR: {
      SOMETHINK_WENT_WRONG: "Something went wrong",
      DROP_DOWN_FETCH_FAILED: "Error fetching dropdown data",
      DASHBOARD_FETCH: "Failed to fetch dashboard data",
    },
  },
  AUTH: {
    SUCCESS: {
      REGISTRATION: "Your account has been registered successfully",

      OTP_SENT: "OTP has been sent to your registered email",
      OTP_RESENT: "OTP has been resent to your registered email",
      PASSWORD_UPDATE: "Password updated successfully",
      PASSWORD_REDIRECTING: "Password updated! Redirecting...",
      FORGOT_PASSWORD_SENT:
        "Password reset link sent!, Please check your email",
    },
    ERROR: {
      LOGIN: "Login Failed, Please try again",
      GOOGLE_LOGIN_FAILED: "Google log-in failed",

      REGISTRATION_FAILED: "Registration failed",

      PASSWORD_DONT_MATCH: "Passwords do not match",
      FORGOT_PASSWORD: "Failed to process forgot password request",
      PASSWORD_RESET: "Error reseting password",
    },
  },
  ADMIN: {
    SUCCESS: {
      UPDATE: "Admin updated successfully",
    },
    ERROR: {
      UPDATE: "Error updating admin",
      LOGOUT: "Error logging out admin",
      VERIFICATION_REQUESTS: "Failed to fetch verification requests",
      VERIFICATION_STATUS: "Failed to update verification status",
    },
  },
  OPERATOR: {
    SUCCESS: {
      UPDATE: "Operator updated successfully",
      REGISTRATION_AWAITING:
        "Registration Submitted, awaiting admin verification",
    },
    ERROR: {
      FETCH: "Failed to fetch operator",
      FETCH_OPERATORS: "Failed to fetch operators",
      UPDATE_BLOCK_STATUS: "Failed to update operator block status",
      DELETE: "Failed to delete operator",
      LOGOUT: "Error logging out operator",
      NOT_VERIFIED: "Your account is not verified by the admin yet",
      UPDATE: "Failed to update operator",
    },
  },
  USER: {
    SUCCESS: {
      UPDATE: "User updated successfully",
      DELETE: "You account has been deleted successfully",
    },
    ERROR: {
      UPDATE: "Error updating user",
      UPDATE_BLOCK_STATUS: "Failed to update user block status",
      DELETE: "Error deleting user",
      LOGOUT: "Error logging out user",
      FETCH: "Failed to fetch user",

      FETCH_USERS: "Failed to fetch users",
    },
  },
  PACKAGE: {
    SUCCESS: {
      CREATE: "Package created successfully",
      UPDATE: "Package updated successfully",
    },
    ERROR: {
      FETCH: "Failed to fetch packages",
      DELETE: "Failed to delete package",
    },
  },
  PACKAGE_CATEGORY: {
    SUCCESS: {
      CREATE: "Package category created successfully",
    },
    ERROR: {
      CREATE: "Failed to create category",
      FETCH: "Failed to fetch categories",
      FETCH_ACTIVE: "Failed to fetch active categories",
    },
  },
  DESTINATON: {
    SUCCESS: {
      CREATE: "Destination created successfully",
    },
    ERROR: {
      CREATE: "Failed to create destination",
      FETCH: "Failed to fetch destinations",
    },
  },
  MEDIA: {
    SUCCESSS: {
      UPLOAD: "Image uploaded successfully",
    },
    ERROR: {
      UPLOAD: "Error uploading image",
      CLOUDINARY: "Cloudinary upload error",
    },
  },
  WISHLIST: {
    ERROR: {
      FETCH: "Failed to fetch wishlist groups",
      TOGGLE: "Failed to toggle wishlist",
      CREATE_GROUP: "Failed to create wishlist group",
      UPDATE_GROUP: "Failed to update wishlist group ",
      DELETE_GROUP: "Failed to delete wishlist group ",
      ADD_NOTE: "Failed to add note in wishlist group",
      UPDATE_NOTE: "Failed to update note in wishlist group",
      DELETE_NOTE: "Failed to delete note in wishlist group",
      LOGIN: "Please sign in to save packages to your wishlist!",
      SHARED_GROUP: "Failed to fetch shared group",
    },
  },
  REVIEWS: {
    SUCCESS: {
      CREATE: "You review has been posted successfully",
      UPDATE: "You review has been updated successfully",
      DELETE: "You review has been deleted successfully",
    },
    ERROR: {
      FETCH: "Failed to fetch user reviews",
      CREATE: "Failed to create user review",
      UPDATE: "Failed to update user review",
      DELETE: "Failed to delete user review",
    },
  },
  BOOKING: {
    SUCCESS: {
      BOOKING: "Booking confirmed succesfully",
      UPDATE_GUEST_STATUS: (newStatus: string) =>
        `Guest attendance marked as ${newStatus.replace("_", " ")}`,
      CANCEL: "Tour cancelled and full refund credited to guest wallet",
      RESCHEDULE: "Tour date successfully rescheduled",
      APPROVE_CANCEL_REQ:
        "Cancelation approved and  50% refund credited to guest wallet.",
      REJECT_CANCEL_REQ: "Cancelation request rejected.",
    },
    ERROR: {
      FETCH: "Failed to fetch booking",
      FETCH_USER_BOOKINGS: "Failed to fetch user bookings",
      FETCH_OPERATOR_BOOKINGS: "Failed to fetch operator bookings",
      INITIATE: "Failed to initiate booking",
      CANCEL: "Failed to cancel booking",
      UPDATE_ATTENDANCE: "Failed to update attendance",
      BOOKING_DETAILS: "Failed to fetch booking details",
      CANCEL_REASON_MISSING: "Please provide a reason for cancelling this tour",
      DATE_MISSING: "Please pick a valid future date",
      RESCHEDULE: "Failed to reschedule tour",
      CANCEL_REQ_VERIFICATION: "Cancel request verification failed",
    },
  },
  COUPON: {
    SUCCESS: {
      CREATE: "Coupon created successfully",
      UPDATE: "Coupon updated successfully",
    },
    ERROR: {
      FETCH: "Failed to fetch coupons",
    },
  },
  PAYMENT: {
    ERROR: {
      RAZORPAY_LOAD: "Failed to load razorpay SDK. Are you online?",
      PAYMENT_VERIFICATION: "Payment verification failed",
      PAYMENT_POPUP: "Payment popup closed.",
    },
  },
  WALLET: {
    SUCCESS: {
      RECHARGE: "Wallet rechareged successfully",
    },
    ERROR: {
      FETCH: "Failed to load wallet data",
      INVALID_TOPUP_AMOUNT: "Please enter a valid amount",
      INITIATE_TOPUP: "Failed to initiate top-up",
    },
  },
  CHATS: {
    ERROR: {
      FETCH_CHATS: "Failed to fetch chats",
      FETCH_MESSAGES: "Failed to fetch messages",
      START_CHAT: "Failed to start chat session",
      CLEAR_CHAT:'Failed to clear chat'
    },
  },
  NOTIFICATIONS: {
    SUCCESS: {
      SEND: "Notification send successfully",
    },
    ERROR: {
      FETCH: "Failed to fetch notifications",
      MARK_AS_READ: "Failed to mark notification as read",
      MARK_ALL_AS_READ: "Failed to mark all notification as read",
      SEND: "Failed to send notification",
      CLEAR_ALL: "Failed to clear all notifications",
    },
  },
} as const;
