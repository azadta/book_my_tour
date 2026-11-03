import express from "express";
import { authMiddleware, packageDestinationController } from "../../config/container";
import { ROUTES } from "../../constants/routesConstants";
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
