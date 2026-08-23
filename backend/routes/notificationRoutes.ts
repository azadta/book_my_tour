import express from "express";
import { ROUTES } from "../constants/routesConstants";
import { authMiddleware, notificationController } from "../config/container";

const router = express.Router();
router.post(
  ROUTES.NOTIFICATION.CREATE,
  authMiddleware.verifyRole("operator", "admin"),
  notificationController.createNotification,
);
router.get(
  ROUTES.NOTIFICATION.USER_NOTIFICATIONS,
  authMiddleware.verifyRole("user", "operator"),
  notificationController.getUserNotifications,
);
router.patch(
  ROUTES.NOTIFICATION.MARK_AS_READ,
  authMiddleware.verifyRole("user"),
  notificationController.markAsRead,
);
router.patch(
  ROUTES.NOTIFICATION.MARK_ALL_AS_READ,
  authMiddleware.verifyRole("user"),
  notificationController.markAllAsRead,
);
router.delete(
  ROUTES.NOTIFICATION.CLEAR_ALL,
  authMiddleware.verifyRole("user"),
  notificationController.clearAllNotifications,
);

export default router;
