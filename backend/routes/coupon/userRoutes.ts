import express from "express";
import {
    authMiddleware,
    couponController
} from "../../config/container";
import { ROUTES } from "../../constants/routesConstants";

const userRouter = express.Router();

userRouter.get(
  ROUTES.COUPONS.USER.LIST,
  authMiddleware.verifyRole("user"),
  couponController.getCoupons,
);
userRouter.get(
  ROUTES.COUPONS.USER.VALIDATE,
  authMiddleware.verifyRole("user"),
  couponController.validateCoupon,
);


export { userRouter };

