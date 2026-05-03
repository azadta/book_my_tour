import express from "express";

import { authMiddleware, operatorController } from "../config/container.js";
import { validateUpdateOperator } from "../middlewares/operatorUpdateValidator.js";
import { validateOperator } from "../middlewares/operatorValidator.js";
import { validatePackage } from "../middlewares/validatePackage.js";
import { ROUTES } from "../constants/routesConstants.js";

const router = express.Router();

router.post(
  ROUTES.OPERATOR.REGISTER,
  validateOperator,
  operatorController.operatorRegister,
);
router.post(
  ROUTES.OPERATOR.VERIFY_OTP,
  operatorController.operatorOtpverification,
);
router.post(ROUTES.OPERATOR.RESEND_OTP, operatorController.operatorResendOtp);
router.post(ROUTES.OPERATOR.LOGIN, operatorController.loginOperator);
router.post(
  ROUTES.OPERATOR.FORGOT_PASSWORD,
  operatorController.forgotOperatorPassword,
);
router.post(
  ROUTES.OPERATOR.RESET_PASSWORD,
  operatorController.resetOperatorPassword,
);
router.delete(ROUTES.OPERATOR.LOGOUT, operatorController.operatorLogout);

router.post(
  ROUTES.OPERATOR.UPDATE_IMAGE,
  authMiddleware.verifyRole("operator"),
  validateUpdateOperator,
  operatorController.updateOperatorProfileImage,
);
router.post(
  ROUTES.OPERATOR.UPDATE,
  authMiddleware.verifyRole("operator"),
  validateUpdateOperator,
  operatorController.updateOperator,
);
router.post(
  ROUTES.OPERATOR.CREATE_PACKAGE,
  authMiddleware.verifyRole("operator"),
  validatePackage,
  operatorController.createPackage,
);

router.get(ROUTES.OPERATOR.DESTINATIONS, operatorController.getAllDestinations);
router.get(
  ROUTES.OPERATOR.PACKAGE_CATEGORIES,
  operatorController.getAllPackageCategory,
);
router.post(
  ROUTES.OPERATOR.RESET_PASSWORD_AUTH,
  authMiddleware.verifyRole("operator"),
  operatorController.resetPasswordAuthenticated,
);
router.get(
  ROUTES.OPERATOR.MY_PACKAGES_COUNT,
  authMiddleware.verifyRole("operator"),
  operatorController.getMyPackagesCount,
);

export default router;
