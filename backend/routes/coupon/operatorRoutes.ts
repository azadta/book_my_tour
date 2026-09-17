import express from "express";
import { ROUTES } from "../../constants/routesConstants";
import { authMiddleware, couponController } from "../../config/container";

const operatorRouter = express.Router();

operatorRouter.get(
  ROUTES.COUPONS.OPERATOR.LIST,
  authMiddleware.verifyRole("operator"),
  couponController.getAllCoupons,
);
operatorRouter.post(
  ROUTES.COUPONS.OPERATOR.CREATE,
  authMiddleware.verifyRole("operator"),
  couponController.createCoupon,
);
operatorRouter.get(
  ROUTES.COUPONS.OPERATOR.DETAIL,
  authMiddleware.verifyRole("operator"),
  couponController.getCouponById,
);
operatorRouter.put(
  ROUTES.COUPONS.OPERATOR.UPDATE,
  authMiddleware.verifyRole("operator"),
  couponController.updateCoupon,
);
operatorRouter.patch(
  ROUTES.COUPONS.OPERATOR.TOGGLE_STATUS,
  authMiddleware.verifyRole("operator"),
  couponController.toggleCouponStatus,
);



export { operatorRouter };
