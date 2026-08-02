import express from "express";
import { ROUTES } from "../constants/routesConstants";
import { WebhookController } from "../controllers/webhookController";
import { webhookController } from "../config/container";
const router = express.Router();

router.post(
  ROUTES.RAZORPAY_WEBHOOK.PAYMENTS,
  express.raw({ type: "application/json" }),
  webhookController.handleRazorpayWebhook,
);

export default router;
