import express from "express";

import { validateUpdateAdmin } from "../middlewares/adminUpdateValidator";
import { validateUpdateOperator } from "../middlewares/operatorUpdateValidator";
import { validateUpdateUser } from "../middlewares/userUpdateValidator";

import { adminController, authMiddleware } from "../config/container";
import { validateDestination } from "../middlewares/validateDestination";
import { validatePackageCategory } from "../middlewares/validatePackageCategory";
import { ROUTES } from "../constants/routesConstants";
import { resetPasswordValidator } from "../middlewares/resetPasswordValidator";
import { validatePackage } from "../middlewares/validatePackage";

const router = express.Router();

router.post(ROUTES.ADMIN.LOGIN, adminController.loginAdmin);
router.delete(ROUTES.ADMIN.LOGOUT, adminController.logoutAdmin);

router.post(
  ROUTES.ADMIN.UPDATE_IMAGE,
  authMiddleware.verifyRole("admin"),
  validateUpdateAdmin,
  adminController.updateAdminProfileImage,
);
router.post(
  ROUTES.ADMIN.UPDATE,
  authMiddleware.verifyRole("admin"),
  validateUpdateAdmin,
  adminController.updateAdmin,
);

router.get(
  ROUTES.ADMIN.OPS_VERIFICATION_REQS,
  authMiddleware.verifyRole("admin"),
  adminController.getOperatorVerificationRequests,
);
router.put(
  ROUTES.ADMIN.OPS_VERIFY,
  authMiddleware.verifyRole("admin"),
  adminController.verifyOperator,
);
router.get(
  ROUTES.ADMIN.OPS_LIST,
  authMiddleware.verifyRole("admin"),
  adminController.getPaginatedOperators,
);
router.put(
  ROUTES.ADMIN.OPS_BLOCK,
  authMiddleware.verifyRole("admin"),
  adminController.blockOperator,
);
router.delete(
  ROUTES.ADMIN.OPS_DELETE,
  authMiddleware.verifyRole("admin"),
  adminController.deleteOperator,
);
router.get(
  ROUTES.ADMIN.OPS_SINGLE,
  authMiddleware.verifyRole("admin"),
  adminController.getSingleOperator,
);
router.put(
  ROUTES.ADMIN.OPS_UPDATE,
  authMiddleware.verifyRole("admin"),
  validateUpdateOperator,
  adminController.updateOperator,
);

router.get(
  ROUTES.ADMIN.USERS_LIST,
  authMiddleware.verifyRole("admin"),
  adminController.getPaginatedUsers,
);
router.put(
  ROUTES.ADMIN.USERS_BLOCK,
  authMiddleware.verifyRole("admin"),
  adminController.blockUser,
);
router.delete(
  ROUTES.ADMIN.USERS_DELETE,
  authMiddleware.verifyRole("admin"),
  adminController.deleteUser,
);
router.get(
  ROUTES.ADMIN.USERS_SINGLE,
  authMiddleware.verifyRole("admin"),
  adminController.getSingleUser,
);
router.put(
  ROUTES.ADMIN.USERS_UPDATE,
  authMiddleware.verifyRole("admin"),
  validateUpdateUser,
  adminController.updateUser,
);

router.post(
  ROUTES.ADMIN.CREATE_CATEGORY,
  authMiddleware.verifyRole("admin"),
  validatePackageCategory,
  adminController.createPackageCategory,
);
router.get(
  ROUTES.ADMIN.PACKAGE_CATEGORIES,
  authMiddleware.verifyRole("admin"),
  adminController.getAllPackageCategory,
);
router.get(
  ROUTES.ADMIN.DESTINATIONS,
  authMiddleware.verifyRole("admin"),
  adminController.getAllDestinations,
);
router.post(
  ROUTES.ADMIN.CREATE_DESTINATION,
  authMiddleware.verifyRole("admin"),
  validateDestination,
  adminController.createDestination,
);

router.get(
  ROUTES.ADMIN.PACKAGES_LIST,
  authMiddleware.verifyRole("admin"),
  adminController.getAllPackages,
);
router.post(
  ROUTES.ADMIN.RESET_PASSWORD_AUTH,
  authMiddleware.verifyRole("admin"),
  resetPasswordValidator,
  adminController.resetPasswordAuthenticated,
);
router.get(
  ROUTES.ADMIN.USER_COUNT,
  authMiddleware.verifyRole("admin"),
  adminController.getTotalUsersCount,
);
router.get(
  ROUTES.ADMIN.OPS_COUNT,
  authMiddleware.verifyRole("admin"),
  adminController.getTotalOperatorsCount,
);
router.get(
  ROUTES.ADMIN.OPS_PENDING_COUNT,
  authMiddleware.verifyRole("admin"),
  adminController.getPendingOperatorsCount,
);
router.get(
  ROUTES.ADMIN.SIGNUP_TODAY,
  authMiddleware.verifyRole("admin"),
  adminController.todaySignupCount,
);

router.get(
  ROUTES.ADMIN.PACKAGE,
  authMiddleware.verifyRole("admin"),
  adminController.getPackageById,
);

router.delete(
  ROUTES.ADMIN.DELETE_PACKAGE,
  authMiddleware.verifyRole("admin"),
  adminController.deletePackage,
);

router.get(
  ROUTES.ADMIN.CANCELLATION_REQUESTS,
  authMiddleware.verifyRole("admin"),

  adminController.getPendingCancellations,
);
router.patch(
  ROUTES.ADMIN.PROCESS_CANCELLATION,
  authMiddleware.verifyRole("admin"),

  adminController.processCancellationRequests,
);

export default router;
