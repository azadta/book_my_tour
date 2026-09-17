import express from "express";
import {
    authMiddleware,
    packageReviewController
} from "../../config/container";
import { ROUTES } from "../../constants/routesConstants";

const userRouter = express.Router();

userRouter.post(
  ROUTES.PACKAGE_REVIEWS.USER.CREATE,
  authMiddleware.verifyRole("user"),
  packageReviewController.createPackageReview,
);
userRouter.put(
  ROUTES.PACKAGE_REVIEWS.USER.UPDATE,
  authMiddleware.verifyRole("user"),
  packageReviewController.updatePackageReview,
);
userRouter.delete(
  ROUTES.PACKAGE_REVIEWS.USER.DELETE,
  authMiddleware.verifyRole("user"),
  packageReviewController.deletePackageReview,
);


export { userRouter };

