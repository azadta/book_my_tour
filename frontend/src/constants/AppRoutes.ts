export const APP_ROUTES = {
  USER: {
    REGISER: "/user/register",
    VERIFY_OTP: "/user/verify-otp",
    RESEND_OTP: "/user/resend-otp",
    LOGIN: "/user/login",
    GOOGLE: "/user/google",
    FORGOT_PASSWORD: "/user/forgot-password",
    RESET_PASSWORD: (token: string) => `/user/reset-password/${token}`,
    LOGOUT: "/user/logout",
    UPDATE: (id: string) => `/user/update/${id}`,
    UPDATE_IMAGE: "/user/update-profile-image",
    DELETE: (id: string) => `/user/delete/${id}`,

    PACKAGE_CATEGORIES: "/user/package-categories",
    ACTIVE_PACKAGE_CATEGORIES: "/user/active-package-categories",
    PACKAGES_HOME: "/user/packages/home",
    PACKAGES: "/user/packages",
    PACKAGE: (id: string) => `/user/package/${id}`,
    PACKAGE_FILTER: `/user/packages/filter`,

    DESTINATIONS_BY_PACKAGE_CATEGORY: (category: string) =>
      `/user/destinations/package-category/${encodeURIComponent(category)}`,
    PACKAGES_BY_CATEGORY: (category: string) =>
      `/user/packages/category/${encodeURIComponent(category)}`,
    RESET_PASSWORD_AUTH: "/user/reset-password-authenticated",
    WISHLISTS: "/user/wishlists",
    WISHLIST_TOGGLE: "/user/wishlist/toggle",
    WISHLIST_CREATE: "/user/wishlist/create",
    WISHLIST_UPDATE: (groupId: string) => `/user/wishlist/update/${groupId}`,
    WISHLIST_DELETE: (groupId: string) => `/user/wishlist/delete/${groupId}`,

    WISHLIST_ADD_NOTE: (groupId: string) =>
      `/user/wishlist/add-note/${groupId}`,
    WISHLIST_UPDATE_NOTE: (groupId: string, noteId: string) =>
      `/user/wishlist/update-note/${groupId}/${noteId}`,
    WISHLIST_DELETE_NOTE: (groupId: string, noteId: string) =>
      `/user/wishlist/delete-note/${groupId}/${noteId}`,
    WISHLIST_SHARE_LINK: (groupId: string) =>
      `/user/wishlist/share-link/${groupId}`,
    WISHLIST_SHARED_GROUP: (sharedToken: string) =>
      `/user/wishlist/shared/${sharedToken}`,
    REVIEWS: (packageId: string) => `/user/reviews/${packageId}`,
    CREATE_REVIEW: (packageId: string) => `/user/review/create/${packageId}`,
    UPDATE_REVIEW: (reviewId: string, packageId: string) =>
      `/user/review/update/${reviewId}/${packageId}`,
    DELETE_REVIEW: (reviewId: string, packageId: string) =>
      `/user/review/delete/${reviewId}/${packageId}`,
    CREATE_BOOKING: "/user/booking",
    VERIFY_BOOKING_PAYMENT: "/user/booking/payment/verify",
    BOOKING_BY_ORDER_ID: (orderId: string) => `/user/booking/${orderId}`,
    MY_BOOKINGS: "/user/my-bookings",
    COUPONS: "/user/coupons",
    WALLET: "/user/wallet",
    WALLET_TOPUP: "/user/wallet/topup",
    VERIFY_WALLET_TOPUP: "/user/wallet/verify-topup",
    CANCEL_BOOKING: (packageId: string) => `/user/booking/cancel/${packageId}`,
  },
  COMMON_AUTH: {
    REFRESH_TOKEN: "/auth/refresh",
  },
  OPERATOR: {
    REGISTER: "/operator/register",
    VERIFY_OTP: "/operator/verify-otp",
    RESEND_OTP: "/operator/resend-otp",
    LOGIN: "/operator/login",
    FORGOT_PASSWORD: "/operator/forgot-password",
    RESET_PASSWORD: (token: string) => `/operator/reset-password/${token}`,
    LOGOUT: "/operator/logout",
    UPDATE: (id: string) => `/operator/update/${id}`,
    UPDATE_IMAGE: "/operator/update-profile-image",

    CREATE_PACKAGE: "/operator/create-package",
    DESTINATIONS: "/operator/destinations",
    PACKAGE_CATEGORIES: "/operator/package-categories",
    MY_PACKAGES_COUNT: "/operator/my-packages-count",

    PACKAGES: (operatorId: string) => `/operator/packages/${operatorId}`,
    PACKAGE: (id: string) => `/operator/package/${id}`,
    PACKAGES_UPDATE: (id: string) => `/operator/packages/update/${id}`,
    DELETE_PACKAGE: (id: string) => `/operator/package/delete/${id}`,
    RESET_PASSWORD_AUTH: "/operator/reset-password-authenticated",
    COUPONS: "/operator/coupons",
    TOGGLE_COUPON_STATUS: (couponId: string) =>
      `/operator/coupon/${couponId}/toggle-status`,
    CREATE_COUPON: "/operator/coupon/create",
    FETCH_COUPON_BY_ID: (couponId: string) => `/operator/coupon/${couponId}`,
    UPDATE_COUPON: (couponId: string) => `/operator/coupon/update/${couponId}`,
    BOOKINGS: "/operator/bookings",
    DASHBOARD_DATA: "/operator/dashboard-data",
    BOOKING_DETAILS: (bookingId: string) =>
      `/operator/booking-details/${bookingId}`,
    UPDATE_GUEST_ATTENDANCE: (bookingId: string) =>
      `/operator/booking/guest-attendance/${bookingId}`,
    CANCEL_BOOKING: (bookingId: string) =>
      `/operator/booking/cancel/${bookingId}`,
    RESCHEDULE_BOOKING: (bookingId: string) =>
      `operator/booking/reschedule/${bookingId}`,
    VERIFY_BOOKING: (bookingId: string) =>
      `/operator/booking/verify-cancellation/${bookingId}`,
  },
  ADMIN: {
    LOGIN: "/admin/login",
    LOGOUT: "/admin/logout",
    UPDATE_IMAGE: "/admin/update-profile-image",
    UPDATE: (id: string) => `/admin/update/${id}`,

    OPS_VERIFICATION_REQS: "/admin/operators/get-verification-requests",
    OPS_VERIFY: (id: string) => `/admin/operators/verify-operator/${id}`,
    OPS_LIST: "admin/operators",
    OPS_BLOCK: (id: string) => `/admin/operators/block/${id}`,
    OPS_DELETE: (id: string) => `/admin/operators/delete/${id}`,
    OPS_SINGLE: (id: string) => `/admin/operators/single-operator/${id}`,
    OPS_UPDATE: (id: string) => `/admin/operators/update/${id}`,
    OPS_COUNT: "/admin/operators/total-count",
    OPS_PENDING_COUNT: "/admin/operators/pending-verification-count",

    USERS_LIST: "/admin/users",
    USERS_BLOCK: (id: string) => `/admin/users/block/${id}`,
    USERS_DELETE: (id: string) => `/admin/users/delete/${id}`,
    USERS_SINGLE: (id: string) => `/admin/users/single-user/${id}`,
    USERS_UPDATE: (id: string) => `/admin/users/update/${id}`,
    USER_COUNT: "/admin/users/total-count",
    SIGNUP_TODAY: "/admin/users/signup-today",

    CREATE_CATEGORY: "admin/create-package-category",
    CREATE_DESTINATION: "/admin/create-destination",

    PACKAGES_LIST: "/admin/packages",
    PACKAGE: (id: string) => `/admin/package/${id}`,
    PACKAGES_UPDATE: (id: string) => `/admin/packages/update/${id}`,
    DELETE_PACKAGE: (id: string) => `/admin/package/delete/${id}`,
    RESET_PASSWORD_AUTH: "/admin/reset-password-authenticated",
  },

  EXTERNAL: {
    CLOUDINARY: (cloudName: string) =>
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  },
  CHATS: {
    MY_CHATS: "/chat/my_chats",
    ACCESS_CHAT: "/chat/access_chat",
    CHAT_MESSAGES: (chatId: string) => `/chat/chat_messages/${chatId}`,
    CLEAR_MESSAGES: (chatId: string) => `/chat/clear-messages/${chatId}`,
  },
  NOTIFICATIONS: {
    USER_NOTIFICATIONS: "/notification/user-notifications",
    CREATE: "/notification/create",
    MARK_AS_READ: (notificationId: string) =>
      `notification/mark-as-read/${notificationId}`,
    MARK_ALL_READ: "/notification/mark-all-as-read",
    CLEAR_ALL: "/notification/clear-all",
  },
} as const;
