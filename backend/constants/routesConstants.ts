export const ROUTES = {
  USER: {
    REGISTER: "/register",
    VERIFY_OTP: "/verify-otp",
    RESEND_OTP: "/resend-otp",
    LOGIN: "/login",
    GOOGLE: "/google",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password/:token",
    LOGOUT: "/logout",
    UPDATE_IMAGE: "/update-profile-image",
    UPDATE: "/update/:id",
    DELETE: "/delete/:id",
    PACKAGE_CATEGORIES: "/package-categories",
    PACKAGES_HOME: "/packages/home",
    RESET_PASSWORD_AUTH: "/reset-password-authenticated",
  },
} as const;
