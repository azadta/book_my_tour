export const FRONTEND_ROUTES = {
  USER: {
    HOME: "/",
    ABOUT: "/user/about",
    CONTACT: "/user/contact",
    FAVOURITES: "/user/favourites",
    NOTIFICATIONS: "/user/notifications",
    LOGIN: "/user/login",
    REGISTER: "/user/register",
    FORGOT_PASSWORD: "/user/forgot-password",
    PROFILE: "/user/profile",
    WISHLIST: "/user/wishlist",
    PACKAGES_LIST: "/user/packages-list",
    RESET_PASSWORD_AUTH: "/user/reset-password",

    VERIFY_OTP_PATTERN: "/user/verify-otp/:userId",
    RESET_PASSWORD_PATTERN: "/user/reset-password/:token",
    PACKAGE_DETAILS_PATTERN: "/user/package-details/:id",

    VERIFY_OTP: (userId: string) => `/user/verify-otp/${userId}`,
    RESET_PASSWORD: (token: string) => `/user/reset-password/${token}`,
    PACKAGE_DETAILS: (id: string) => `/user/package-details/${id}`,
    SHARED_WISHLIST: (shareToken: string) => `/shared-wishlist/${shareToken}`,
    SHARED_WISHLIST_PATTERN: `/shared-wishlist/:shareToken`,

    BOOKING_SUCCESS_PATTERN: "/booking/success",
    BOOKING_SUCCESS: (orderId: string) =>
      `/booking/success/?order_id=${encodeURIComponent(orderId)}`,
    MY_BOOKINGS: "/user/my-bookings",
    WALLET: "/user/wallet",
  },

  OPERATOR: {
    LOGIN: "/operator/login",
    REGISTER: "/operator/register",
    FORGOT_PASSWORD: "/operator/forgot-password",
    PROFILE: "/operator/profile",
    DASHBOARD: "/operator/dashboard",
    CREATE_PACKAGE: "/operator/create-package",
    RESET_PASSWORD_AUTH: "/operator/reset-password",

    OTP_VERIFICATION_PATTERN: "/operator/otp-verification/:operatorId",
    RESET_PASSWORD_PATTERN: "/operator/reset-password/:token",
    EDIT_PACKAGE_PATTERN: "/operator/edit-package/:id",
    PACKAGES_LIST_PATTERN: "/operator/packages-list/:id",

    OTP_VERIFICATION: (operatorId: string) =>
      `/operator/otp-verification/${operatorId}`,
    RESET_PASSWORD: (token: string) => `/operator/reset-password/${token}`,
    EDIT_PACKAGE: (id: string) => `/operator/edit-package/${id}`,
    PACKAGES_LIST: (id: string) => `/operator/packages-list/${id}`,
    UPDATE_COUPON_PATTERN: "/operator/update-coupon/:couponId",
    UPDATE_COUPON: (couponId: string) => `/operator/update-coupon/${couponId}`,
    CREATE_COUPON: "/operator/create-coupon",
    COUPONS_LIST: `/operator/coupons-list`,
    BOOKING_DETAILS_PATTERN: "/operator/booking-details/:bookingId",
    BOOKING_DETAILS: (bookingId: string) =>
      `/operator/booking-details/${bookingId}`,
    BOOKING_LIST: "/operator/booking-list",
  },
  ADMIN: {
    LOGIN: "/admin/login",
    PROFILE: `/admin/profile`,
    DASHBOARD: "/admin/dashboard",
    RESET_PASSWORD_AUTH: "/admin/reset-password",
    USERS: "/admin/users",
    OPERATORS: "/admin/operators",
    OPERATOR_VERIFICATION: "/admin/operator-verification",
    PACKAGES: "/admin/packages",
    CREATE_DESTINATION: "/admin/create-destination",
    CREATE_PACKAGE_CATEGORY: "/admin/create-package-category",

    EDIT_USER_PATTERN: "/admin/edit-user/:id",
    EDIT_OPERATOR_PATTERN: "/admin/edit-operator/:id",
    EDIT_PACKAGE_PATTERN: "/admin/edit-package/:id",

    EDIT_USER: (id: string) => `/admin/edit-user/${id}`,
    EDIT_OPERATOR: (id: string) => `/admin/edit-operator/${id}`,
    EDIT_PACKAGE: (id: string) => `/admin/edit-package/${id}`,
  },
} as const;
