import express from "express";
import { ROUTES } from "../../constants/routesConstants";
import { authMiddleware, packageController } from "../../config/container";

const adminRouter = express.Router();

adminRouter.get(
  ROUTES.PACKAGES.ADMIN.LIST,
  authMiddleware.verifyRole("admin"),
  packageController.getAdminAllPackages,
);
adminRouter.get(
  ROUTES.PACKAGES.ADMIN.DETAIL,
  authMiddleware.verifyRole("admin"),
  packageController.getPackageById,
);
adminRouter.delete(
  ROUTES.PACKAGES.ADMIN.DELETE,
  authMiddleware.verifyRole("admin"),
  packageController.adminDeletePackage,
);

export { adminRouter };
