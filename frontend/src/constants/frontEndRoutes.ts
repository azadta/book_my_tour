export const FRONTEND_ROUTES = {
  USER: {
    HOME: "/",
    ABOUT: "/user/about",
    CONTACT:"/user/contact",
    FAVOURITES:'/user/favourites',
    NOTIFICATIONS:'/user/notifications',
    LOGIN: "/user/login",
    REGISTER: "/user/register",
    FORGOT_PASSWORD: "/user/forgot-password",
    PROFILE: "/user/profile",
    PACKAGES_LIST: "/user/packages-list",
    RESET_PASSWORD_AUTH: "/user/reset-password",

    VERIFY_OTP_PATTERN: "/user/verify-otp/:userId",
    RESET_PASSWORD_PATTERN: "/user/reset-password/:token",
    PACKAGE_DETAILS_PATTERN: "/user/package-details/:id",

    VERIFY_OTP: (userId: string) => `/user/verify-otp/${userId}`,
    RESET_PASSWORD: (token: string) => `/user/reset-password/${token}`,
    PACKAGE_DETAILS: (id: string) => `/user/package-details/${id}`,
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
    PACKAGES_LIST_PATTERN: "/operator/package-list/:id",

    OTP_VERIFICATION: (operatorId: string) =>
      `/operator/otp-verification/${operatorId}`,
    RESET_PASSWORD: (token: string) => `/operator/reset-password/${token}`,
    EDIT_PACKAGE: (id: string) => `/operator/edit-package/${id}`,
    PACKAGES_LIST: (id: string) => `/operator/packages-list/${id}`,
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
} as const
