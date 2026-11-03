import express from "express";
import { authMiddleware, payoutController } from "../../config/container";
import { ROUTES } from "../../constants/routesConstants";

const router = express.Router();
router.get(
  ROUTES.PAYOUT.LIST,
  authMiddleware.verifyRole("admin"),
  payoutController.getEligiblePayouts,
);

router.post(
  ROUTES.PAYOUT.CREATE_ORDER,
  authMiddleware.verifyRole("admin"),
  payoutController.createOrder,
);
router.post(
  ROUTES.PAYOUT.VERIFY_PAYMENT,
  authMiddleware.verifyRole("admin"),
  payoutController.verifyPayment,
);

export default router;
