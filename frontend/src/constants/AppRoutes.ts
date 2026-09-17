export const APP_ROUTES = {
  BOOKINGS: {
    USER: {
      CREATE: "/booking",
      PAYMENT_VERIFY: "/booking/payment/verify",
      BY_ORDER_ID: (orderId: string) => `/booking/${orderId}`,
      MY_BOOKINGS: "/booking",
      CANCEL: (bookingId: string) => `/booking/${bookingId}/cancel`,
    },
    OPERATOR: {
      LIST: "/booking/operator",
      DETAILS: (bookingId: string) => `/booking/operator/${bookingId}`,
      ATTENDANCE: (bookingId: string) =>
        `/booking/operator/${bookingId}/attendance`,
      RESCHEDULE: (bookingId: string) =>
        `/booking/operator/${bookingId}/reschedule`,
      CANCEL: (bookingId: string) => `/booking/operator/${bookingId}/cancel`,
      VERIFY_CANCELLATION: (bookingId: string) =>
        `/booking/operator/${bookingId}/verify-cancellation`,
    },
    ADMIN: {
      CANCELLATION_REQUESTS: "/booking/admin/cancellation-requests",
      PROCESS_CANCELLATION: (bookingId: string) =>
        `/booking/admin/${bookingId}/process-cancellation`,
    },
  },
  PACKAGES: {
    USER: {
      HOME: "/package/home",
      LIST: "/package",
      FILTER: "/package/filter",
      BY_CATEGORY: (category: string) => `/package/category/${category}`,
      DETAIL: (id: string) => `/package/${id}`,
    },
    OPERATOR: {
      CREATE: "/package/operator",
      MY_COUNT: "/package/operator/count",
      DETAIL: (id: string) => `/package/operator/${id}`,
      DELETE: (id: string) => `/package/operator/${id}`,
      UPDATE: (id: string) => `/package/operator/${id}`,
      LIST: "/package/operator/",
    },
    ADMIN: {
      LIST: "/package/admin",
      DETAIL: (id: string) => `/package/admin/${id}`,
      DELETE: (id: string) => `/package/admin/${id}`,
    },
  },
  PACKAGE_CATEGORIES: {
    PUBLIC: {
      ALL: "/package-category",
      ACTIVE: "/package-category/active",
    },
    ADMIN: {
      CREATE: "/package-category/admin",
    },
  },
  PACKAGE_DESTINATIONS: {
    PUBLIC: {
      ALL: "/package-destination",
      BY_PACKAGE_CATEGORY: (category: string) =>
        `/package-destination/package-category/${category}`,
    },
    ADMIN: {
      CREATE: "/package-destination/admin",
    },
  },
  USERS: {
    ADMIN: {
      LIST: "/user/admin",
      BLOCK: (id: string) => `/user/admin/${id}/block`,
      DELETE: (id: string) => `/user/admin/${id}`,
      DETAIL: (id: string) => `/user/admin/${id}`,
      UPDATE: (id: string) => `/user/admin/${id}`,
    },
    USER: {
      REGISTER: "/user/register",
      VERIFY_OTP: "/user/verify-otp",
      RESEND_OTP: "/user/resend-otp",
      LOGIN: "/user/login",
      GOOGLE: "/user/google",
      FORGOT_PASSWORD: "/user/forgot-password",
      RESET_PASSWORD: (token: string) => `/user/reset-password/${token}`,
      LOGOUT: "/user/logout",
      UPDATE_IMAGE: "/user/profile-image",
      UPDATE: (id: string) => `/user/${id}`,
      DELETE: (id: string) => `/user/${id}`,
      RESET_PASSWORD_AUTH: "/user/reset-password-authenticated",
    },
  },
  OPERATORS: {
    ADMIN: {
      VERIFICATION_RQS: "/operator/admin/verification-requests",
      VERIFY: (id: string) => `/operator/admin/${id}/verify`,
      LIST: "/operator/admin/",
      BLOCK: (id: string) => `/operator/admin/${id}/block`,
      DELETE: (id: string) => `/operator/admin/${id}`,
      DETAILS: (id: string) => `/operator/admin/${id}`,
      UPDATE: (id: string) => `/operator/admin/${id}`,
    },
    OPERATOR: {
      REGISTER: "/operator/register",
      VERIFY_OTP: "/operator/verify-otp",
      RESEND_OTP: "/operator/resend-otp",
      LOGIN: "/operator/login",
      FORGOT_PASSWORD: "/operator/forgot-password",
      RESET_PASSWORD: (token: string) => `/operator/reset-password/${token}`,
      LOGOUT: "/operator/logout",
      UPDATE_IMAGE: "/operator/profile-image",
      UPDATE: (id: string) => `/operator/${id}`,
      RESET_PASSWORD_AUTH: "/operator/reset-password-authenticated",
    },
  },

  ADMINS: {
    LOGIN: "/admin/login",
    LOGOUT: "/admin/logout",
    UPDATE_IMAGE: "/admin/profile-image",
    UPDATE: (id: string) => `/admin/${id}`,
    RESET_PASSWORD_AUTH: "/admin/reset-password-authenticated",
  },

  COUPONS: {
    USER: {
      LIST: "/coupon/",
      VALIDATE: "/coupon/validate",
    },
    OPERATOR: {
      LIST: "/coupon/operator",
      CREATE: "/coupon/operator",
      DETAIL: (id: string) => `/coupon/operator/${id}`,
      UPDATE: (id: string) => `/coupon/operator/${id}`,
      TOGGLE_STATUS: (id: string) => `/coupon/operator/${id}/toggle-status`,
    },
  },
  WALLETS: {
    USER: {
      LIST: "/wallet",
      TOPUP: "/wallet/topup",
      VERIFY_TOPUP: "/wallet/verify-topup",
    },
  },
  WISHLISTS: {
    USER: {
      LIST: "/wishlist/user",
      CREATE_GROUP: "/wishlist/user",
      UPDATE_GROUP: (groupId: string) => `/wishlist/user/${groupId}`,
      DELETE_GROUP: (groupId: string) => `/wishlist/user/${groupId}`,
      TOGGLE: "/wishlist/user/toggle",
      ADD_NOTE: (groupId: string) => `/wishlist/user/${groupId}/note`,
      UPDATE_NOTE: (groupId: string, noteId: string) =>
        `/wishlist/user/${groupId}/notes/${noteId}`,
      DELETE_NOTE: (groupId: string, noteId: string) =>
        `/wishlist/user/${groupId}/notes/${noteId}`,
      SHARE_LINK: (groupId: string) => `/wishlist/user/${groupId}/share`,
    },
    PUBLIC: {
      SHARED: (shareToken: string) => `/wishlist/shared/${shareToken}`,
    },
  },
  PACKAGE_REVIEWS: {
    PUBLIC: {
      LIST_BY_PACKAGE_ID: (packageId: string) => `/package-review/${packageId}`,
    },
    USER: {
      CREATE: (packageId: string) => `/package-review/user/${packageId}`,
      UPDATE: (reviewId: string, packageId: string) =>
        `/package-review/user/${reviewId}/${packageId}`,
      DELETE: (reviewId: string, packageId: string) =>
        `/package-review/user/${reviewId}/${packageId}`,
    },
  },
  CHATS: {
    ANY: {
      MY_CHATS: "/chat",
      ACCESS_CHAT: "/chat/access-chat",
      CHAT_MESSAGES: (chatId: string) => `/chat/${chatId}/messages`,
      CLEAR_MESSAGES: (chatId: string) => `/chat/${chatId}/messages`,
    },
  },
  NOTIFICATIONS: {
    ANY: {
      CREATE: "/notification",
      USER_NOTIFICATIONS: "/notification",
    },
    USER: {
      MARK_AS_READ: (notificationId: string) =>
        `/notification/user/${notificationId}/read`,
      MARK_ALL_AS_READ: "/notification/user/read-all",
      CLEAR_ALL: "/notification/user",
    },
  },
  COMMON: {
    REFRESH: "/auth/refresh",
  },
  DASHBOARD: {
    ADMIN: {
      USERS_COUNT: "/dashboard/admin/users-count",
      SIGNUP_TODAY: "/dashboard/admin/signup-today",
      OPERATORS_COUNT: "/dashboard/admin/operators-count",
      OPERATORS_PENDING_COUNT: "/dashboard/admin/operators-pending-count",
    },
    OPERATOR: {
      STATS: "/dashboard",
    },
  },
  EXTERNAL: {
    CLOUDINARY: (cloudName: string) =>
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  },
} as const;
