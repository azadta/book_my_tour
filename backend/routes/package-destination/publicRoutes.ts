import express from "express";
import { packageDestinationController } from "../../config/container";
import { ROUTES } from "../../constants/routesConstants";

const publicRouter = express.Router();

publicRouter.get(
  ROUTES.PACKAGE_DESTINATIONS.PUBLIC.ALL,
  packageDestinationController.getAllDestinations,
);
publicRouter.get(
  ROUTES.PACKAGE_DESTINATIONS.PUBLIC.BY_PACKAGE_CATEGORY,
  packageDestinationController.getDestinationsByPackageCategory,
);

export { publicRouter };
