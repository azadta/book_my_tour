import express from "express";

import { authMiddleware, userController } from "../config/container";
import { validateUpdateUser } from "../middlewares/userUpdateValidator";
import { validateUser } from "../middlewares/userValidator";
import { ROUTES } from "../constants/routesConstants";
import { resetPasswordValidator } from "../middlewares/resetPasswordValidator";

const router = express.Router();

router.post(ROUTES.USER.REGISTER, validateUser, userController.register);
router.post(ROUTES.USER.VERIFY_OTP, userController.verifyOtp);
router.post(ROUTES.USER.RESEND_OTP, userController.resendOtp);
router.post(ROUTES.USER.LOGIN, userController.login);
router.post(ROUTES.USER.GOOGLE, userController.google);
router.post(ROUTES.USER.FORGOT_PASSWORD, userController.forgotPassword);
router.post(
  ROUTES.USER.RESET_PASSWORD,
  resetPasswordValidator,
  userController.resetPassword,
);
router.delete(ROUTES.USER.LOGOUT, userController.logout);

router.post(
  ROUTES.USER.UPDATE_IMAGE,
  authMiddleware.verifyRole("user"),
  validateUpdateUser,
  userController.updateProfileImage,
);
router.post(
  ROUTES.USER.UPDATE,
  authMiddleware.verifyRole("user"),
  validateUpdateUser,
  userController.updateUser,
);
router.delete(
  ROUTES.USER.DELETE,
  authMiddleware.verifyRole("user"),
  userController.deleteUser,
);
router.get(
  ROUTES.USER.PACKAGE_CATEGORIES,
  userController.getAllPackageCategories,
);
router.get(ROUTES.USER.DESTINATIONS, userController.getAllDestinations);
router.get(ROUTES.USER.PACKAGES_HOME, userController.getPaginatedPackages);
router.get(ROUTES.USER.PACKAGES, userController.getAllPackages);
router.post(
  ROUTES.USER.RESET_PASSWORD_AUTH,
  authMiddleware.verifyRole("user"),
  resetPasswordValidator,
  userController.resetPasswordAuthenticated,
);
router.get(ROUTES.USER.PACKAGE_FILTER, userController.getFilteredPackages);
router.get(
  ROUTES.USER.ACTIVE_PACKAGE_CATEGORIES,
  userController.getActiveCategories,
);

router.get(ROUTES.USER.PACKAGE, userController.getPackageById);
router.get(
  ROUTES.USER.DESTINATIONS_BY_PACKAGE_CATEGORY,
  userController.getDestinationsByPackageCategory,
);
router.get(
  ROUTES.USER.PACKAGES_BY_CATEGORY,
  userController.getPackagesByCategory,
);

router.get(
  ROUTES.USER.WISHLISTS,
  authMiddleware.verifyRole("user"),

  userController.getWishlists,
);
router.post(
  ROUTES.USER.CREATE_WISHLIST_GROUP,
  authMiddleware.verifyRole("user"),

  userController.createWhishlistGroup,
);
router.put(
  ROUTES.USER.UPDATE_WISHLIST_GROUP,
  authMiddleware.verifyRole("user"),

  userController.editWishlistGroup,
);
router.delete(
  ROUTES.USER.DELETE_WISHLIST_GROUP,
  authMiddleware.verifyRole("user"),

  userController.deleteWishlistGroup,
);
router.post(
  ROUTES.USER.WISHLIST_TOGGLE,
  authMiddleware.verifyRole("user"),

  userController.toggleWhishlistPackage,
);
router.post(
  ROUTES.USER.WISHLIST_ADD_NOTE,
  authMiddleware.verifyRole("user"),

  userController.addWishlistNote,
);
router.put(
  ROUTES.USER.WISHLIST_UPDATE_NOTE,
  authMiddleware.verifyRole("user"),

  userController.editWishlistNote,
);
router.delete(
  ROUTES.USER.WISHLIST_DELETE_NOTE,
  authMiddleware.verifyRole("user"),

  userController.deleteWishlistNote,
);

router.get(
  ROUTES.USER.WISHLIST_SHARE_LINK,
  authMiddleware.verifyRole("user"),

  userController.getWishlistShareLink,
);
router.get(ROUTES.USER.WISHLIST_SHARED, userController.getSharedWishlist);
router.get(
  ROUTES.USER.REVIEWS,

  userController.getPackageReviews,
);
router.post(
  ROUTES.USER.CREATE_REVIEW,
  authMiddleware.verifyRole("user"),
  userController.createPackageReview,
);
router.put(
  ROUTES.USER.UPDATE_REVIEW,
  authMiddleware.verifyRole("user"),
  userController.updatePackageReview,
);

router.delete(
  ROUTES.USER.DELETE_REVIEW,
  authMiddleware.verifyRole("user"),
  userController.deletePackageReview,
);

router.post(
  ROUTES.USER.CREATE_BOOKING,
  authMiddleware.verifyRole("user"),
  userController.createBookingOrder,
);
router.post(
  ROUTES.USER.PAYMENT_VERIFY,
  authMiddleware.verifyRole("user"),
  userController.verifyBookingPayment,
);

router.get(
  ROUTES.USER.BOOKING_BY_ORDER_ID,
  authMiddleware.verifyRole("user"),
  userController.findBookingByOrderId,
);

router.get(
  ROUTES.USER.MY_BOOKINGS,
  authMiddleware.verifyRole("user"),
  userController.getUserBookings,
);
router.get(
  ROUTES.USER.COUPONS,
  authMiddleware.verifyRole("user"),
  userController.getCoupons,
);
router.get(
  ROUTES.USER.VALIDATE_COUPONS,
  authMiddleware.verifyRole("user"),
  userController.validateCoupon,
);

router.get(
  ROUTES.USER.WALLET,
  authMiddleware.verifyRole("user"),
  userController.getWallet,
);
router.get(
  ROUTES.USER.WALLET,
  authMiddleware.verifyRole("user"),
  userController.getWallet,
);
router.post(
  ROUTES.USER.WALLET_TOPUP,
  authMiddleware.verifyRole("user"),
  userController.createWalletTopupOrder,
);
router.post(
  ROUTES.USER.VERIFY_WALLET_TOPUP,
  authMiddleware.verifyRole("user"),
  userController.verifyWalletTopupPayment,
);
router.post(
  ROUTES.USER.CANCEL_BOOKING,
  authMiddleware.verifyRole("user"),
  userController.cancelBooking,
);
export default router;
