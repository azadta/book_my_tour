import express from "express";
import { ROUTES } from "../../constants/routesConstants";
import { authMiddleware, subscriptionController } from "../../config/container";

const router = express.Router();

router.post(
  ROUTES.SUBSCRIPTION.CREATE_ORDER,
  authMiddleware.verifyRole("operator"),
  subscriptionController.createOrder,
);
router.post(
  ROUTES.SUBSCRIPTION.VERIFY_PAYMENT,
  authMiddleware.verifyRole("operator"),
  subscriptionController.verifyPayment,
);

export default router;
