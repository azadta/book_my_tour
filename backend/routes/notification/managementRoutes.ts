import express from "express";
import { authMiddleware, notificationController } from "../../config/container";
import { ROUTES } from "../../constants/routesConstants";

const managementRouter = express.Router();

managementRouter.post(
  ROUTES.NOTIFICATIONS.ANY.CREATE,
  authMiddleware.verifyRole("operator", "admin"),
  notificationController.createNotification,
);
managementRouter.get(
  ROUTES.NOTIFICATIONS.ANY.USER_NOTIFICATIONS,
  authMiddleware.verifyRole("operator", "user"),
  notificationController.getUserNotifications,
);

export { managementRouter };
