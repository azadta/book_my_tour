import express from "express";
import { ROUTES } from "../../constants/routesConstants";
import { authMiddleware, packageCategoryController } from "../../config/container";
import { validatePackageCategory } from "../../middlewares/validatePackageCategory";

const adminRouter = express.Router();

adminRouter.post(
  ROUTES.PACKAGE_CATEGORIES.ADMIN.CREATE,
  authMiddleware.verifyRole("admin"),
  validatePackageCategory,
  packageCategoryController.createPackageCategory,
);


export { adminRouter };
