export const ROUTES = {
  BOOKINGS: {
    USER: {
      CREATE: "/",
      PAYMENT_VERIFY: "/payment/verify",
      BY_ORDER_ID: "/:orderId",
      MY_BOOKINGS: "/",
      CANCEL: "/:bookingId/cancel",
    },
    OPERATOR: {
      LIST: "/",
      DETAILS: "/:bookingId",
      ATTENDANCE: "/:bookingId/attendance",
      RESCHEDULE: "/:bookingId/reschedule",
      CANCEL: "/:bookingId/cancel",
      VERIFY_CANCELLATION: "/:bookingId/verify-cancellation",
    },
    ADMIN: {
      CANCELLATION_REQUESTS: "/cancellation-requests",
      PROCESS_CANCELLATION: "/:bookingId/process-cancellation",
    },
  },
  PACKAGES: {
    USER: {
      HOME: "/home",
      LIST: "/",
      FILTER: "/filter",
      BY_CATEGORY: "/category/:category",
      DETAIL: "/:id",
    },
    OPERATOR: {
      CREATE: "/",
      MY_COUNT: "/count",
      DETAIL: "/:id",
      DELETE: "/:id",
      UPDATE: "/:id",
      LIST: "/",
    },
    ADMIN: {
      LIST: "/",
      DETAIL: "/:id",
      DELETE: "/:id",
    },
  },
  PACKAGE_CATEGORIES: {
    PUBLIC: {
      ALL: "/",
      ACTIVE: "/active",
    },
    ADMIN: {
      CREATE: "/",
    },
  },
  PACKAGE_DESTINATIONS: {
    PUBLIC: {
      ALL: "/",
      BY_PACKAGE_CATEGORY: "/package-category/:category",
    },
    ADMIN: {
      CREATE: "/",
    },
  },
  USERS: {
    ADMIN: {
      LIST: "/",
      BLOCK: "/:id/block",
      DELETE: "/:id",
      DETAIL: "/:id",
      UPDATE: "/:id",
    },
    USER: {
      REGISTER: "/register",
      VERIFY_OTP: "/verify-otp",
      RESEND_OTP: "/resend-otp",
      LOGIN: "/login",
      GOOGLE: "/google",
      FORGOT_PASSWORD: "/forgot-password",
      RESET_PASSWORD: "/reset-password/:token",
      LOGOUT: "/logout",
      UPDATE_IMAGE: "/profile-image",
      UPDATE: "/:id",
      DELETE: "/:id",
      RESET_PASSWORD_AUTH: "/reset-password-authenticated",
    },
  },
  OPERATORS: {
    ADMIN: {
      VERIFICATION_RQS: "/verification-requests",
      VERIFY: "/:id/verify",
      LIST: "/",
      BLOCK: "/:id/block",
      DELETE: "/:id",
      DETAILS: "/:id",
      UPDATE: "/:id",
    },
    OPERATOR: {
      REGISTER: "/register",
      VERIFY_OTP: "/verify-otp",
      RESEND_OTP: "/resend-otp",
      LOGIN: "/login",
      FORGOT_PASSWORD: "/forgot-password",
      RESET_PASSWORD: "/reset-password/:token",
      LOGOUT: "/logout",
      UPDATE_IMAGE: "/profile-image",
      UPDATE: "/:id",
      RESET_PASSWORD_AUTH: "/reset-password-authenticated",
      DASHBOARD: "/dashboard",
    },
  },

  ADMIN: {
    LOGIN: "/login",
    LOGOUT: "/logout",
    UPDATE_IMAGE: "/profile-image",
    UPDATE: "/:id",
    RESET_PASSWORD_AUTH: "/reset-password-authenticated",
  },

  COUPONS: {
    USER: {
      LIST: "/",
      VALIDATE: "/validate",
    },
    OPERATOR: {
      LIST: "/",
      CREATE: "/",
      DETAIL: "/:id",
      UPDATE: "/:id",
      TOGGLE_STATUS: "/:id/toggle-status",
    },
  },
  WALLETS: {
    USER: {
      LIST: "/",
      TOPUP: "/topup",
      VERIFY_TOPUP: "/verify-topup",
    },
  },
  WISHLISTS: {
    USER: {
      LIST: "/",
      CREATE_GROUP: "/",
      UPDATE_GROUP: "/:groupId",
      DELETE_GROUP: "/:groupId",
      TOGGLE: "/toggle",
      ADD_NOTE: "/:groupId/note",
      UPDATE_NOTE: "/:groupId/notes/:noteId",
      DELETE_NOTE: "/:groupId/notes/:noteId",
      SHARE_LINK: "/:groupId/share",
    },
    PUBLIC: {
      SHARED: "/shared/:shareToken",
    },
  },
  PACKAGE_REVIEWS: {
    PUBLIC: {
      LIST_BY_PACKAGE_ID: "/:packageId",
    },
    USER: {
      CREATE: "/:packageId",
      UPDATE: "/:reviewId/:packageId",
      DELETE: "/:reviewId/:packageId",
    },
  },
  CHATS: {
    ANY: {
      MY_CHATS: "/",
      ACCESS_CHAT: "/access-chat",
      CHAT_MESSAGES: "/:chatId/messages",
      CLEAR_MESSAGES: "/:chatId/messages",
    },
  },
  NOTIFICATIONS: {
    ANY: {
      CREATE: "/",
      USER_NOTIFICATIONS: "/",
    },
    USER: {
      MARK_AS_READ: "/:notificationId/read",
      MARK_ALL_AS_READ: "/read-all",
      CLEAR_ALL: "/",
    },
  },
  COMMON: {
    REFRESH: "/refresh",
  },
  DASHBOARD: {
    ADMIN: {
      USERS_COUNT: "/users-count",
      SIGNUP_TODAY: "/signup-today",
      OPERATORS_COUNT: "/operators-count",
      OPERATORS_PENDING_COUNT: "/operators-pending-count",
    },
    OPERATOR: {
      STATS: "/",
    },
  },
} as const;
