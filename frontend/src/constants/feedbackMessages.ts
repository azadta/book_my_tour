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
    },
    ERROR: {
      RAZORPAY_LOAD: "Failed to load razorpay SDK. Are you online?",
      PAYMENT_VERIFICATION: "Payment verification failed",
      PAYMENT_POPUP: "Payment popup closed.",
      FETCH: "Failed to fetch booking",
      FETCH_USER_BOOKINGS: "Failed to fetch user bookings",
    },
  },
} as const;
