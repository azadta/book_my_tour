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
router.post(ROUTES.USER.RESET_PASSWORD,resetPasswordValidator, userController.resetPassword);
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
router.get(
  ROUTES.USER.DESTINATIONS,
  userController.getAllDestinations,
);
router.get(ROUTES.USER.PACKAGES_HOME, userController.getPaginatedPackages);
router.get(ROUTES.USER.PACKAGES, userController.getAllPackages);
router.post(
  ROUTES.USER.RESET_PASSWORD_AUTH,
  authMiddleware.verifyRole("user"),
  resetPasswordValidator,
  userController.resetPasswordAuthenticated,
);

export default router;
