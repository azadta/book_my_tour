import express from "express";
import { ROUTES } from "../../constants/routesConstants";
import { authMiddleware, packageCategoryController, packageDestinationController } from "../../config/container";
import { validatePackageCategory } from "../../middlewares/validatePackageCategory";
import { validateDestination } from "../../middlewares/validateDestination";

const adminRouter = express.Router();

adminRouter.post(
  ROUTES.PACKAGE_DESTINATIONS.ADMIN.CREATE,
  authMiddleware.verifyRole("admin"),
  validateDestination,
  packageDestinationController.createDestination,
);
adminRouter.get(
  ROUTES.PACKAGE_DESTINATIONS.ADMIN.CREATE,
  authMiddleware.verifyRole("admin"),
  validateDestination,
  packageDestinationController.createDestination,
);


export { adminRouter };
