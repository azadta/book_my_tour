import express from "express";
import { ROUTES } from "../../constants/routesConstants";
import { authMiddleware, adminController } from "../../config/container";
import { validateUpdateAdmin } from "../../middlewares/adminUpdateValidator";
import { resetPasswordValidator } from "../../middlewares/resetPasswordValidator";

const router = express.Router();

router.post(ROUTES.ADMIN.LOGIN, adminController.loginAdmin);
router.delete(
  ROUTES.ADMIN.LOGOUT,
  authMiddleware.verifyRole("admin"),
  adminController.logoutAdmin,
);
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
router.post(
  ROUTES.ADMIN.RESET_PASSWORD_AUTH,
  authMiddleware.verifyRole("admin"),
  resetPasswordValidator,
  adminController.resetPasswordAuthenticated,
);

export default router;
