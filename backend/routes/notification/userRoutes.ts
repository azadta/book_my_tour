import express from "express";
import { authMiddleware, notificationController } from "../../config/container";
import { ROUTES } from "../../constants/routesConstants";

const userRouter = express.Router();

userRouter.patch(
  ROUTES.NOTIFICATIONS.USER.MARK_AS_READ,
  authMiddleware.verifyRole("user"),
  notificationController.markAsRead,
);
userRouter.patch(
  ROUTES.NOTIFICATIONS.USER.MARK_ALL_AS_READ,
  authMiddleware.verifyRole("user"),
  notificationController.markAllAsRead,
);
userRouter.delete(
  ROUTES.NOTIFICATIONS.USER.CLEAR_ALL,
  authMiddleware.verifyRole("user"),
  notificationController.clearAllNotifications,
);

export { userRouter };
