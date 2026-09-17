import express from "express";
import { authMiddleware, packageController } from "../../config/container";
import { ROUTES } from "../../constants/routesConstants";

const userRouter = express.Router();

userRouter.get(
  ROUTES.PACKAGES.USER.HOME,
  packageController.getPaginatedPackages,
);
userRouter.get(ROUTES.PACKAGES.USER.LIST, packageController.getAllPackages);
userRouter.get(
  ROUTES.PACKAGES.USER.FILTER,
  packageController.getFilteredPackages,
);
userRouter.get(ROUTES.PACKAGES.USER.DETAIL, packageController.getPackageById);
userRouter.get(
  ROUTES.PACKAGES.USER.BY_CATEGORY,
  packageController.getPackagesByCategory,
);

export { userRouter };
