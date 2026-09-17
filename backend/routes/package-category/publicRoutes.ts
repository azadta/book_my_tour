import express from "express";
import {
    packageCategoryController
} from "../../config/container";
import { ROUTES } from "../../constants/routesConstants";

const publicRouter = express.Router();

publicRouter.get(
  ROUTES.PACKAGE_CATEGORIES.PUBLIC.ALL,
  packageCategoryController.getAllPackageCategories,
);
publicRouter.get(
  ROUTES.PACKAGE_CATEGORIES.PUBLIC.ACTIVE,
  packageCategoryController.getActiveCategories,
);

export { publicRouter };

