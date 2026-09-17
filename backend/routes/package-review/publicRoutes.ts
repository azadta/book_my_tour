import express from "express";
import { packageReviewController } from "../../config/container";
import { ROUTES } from "../../constants/routesConstants";

const publicRouter = express.Router();

publicRouter.get(
  ROUTES.PACKAGE_REVIEWS.PUBLIC.LIST_BY_PACKAGE_ID,
  packageReviewController.getPackageReviewsByPackageId,
);

export { publicRouter };
