import express from "express";
import { ROUTES } from "../../constants/routesConstants";
import { authMiddleware, dashboardController } from "../../config/container";

const adminRouter = express.Router();

adminRouter.get(
  ROUTES.DASHBOARD.ADMIN.USERS_COUNT,
  authMiddleware.verifyRole("admin"),

  dashboardController.getTotalUsersCount,
);
adminRouter.get(
  ROUTES.DASHBOARD.ADMIN.SIGNUP_TODAY,
  authMiddleware.verifyRole("admin"),

  dashboardController.todaySignupCount,
);

adminRouter.get(
  ROUTES.DASHBOARD.ADMIN.OPERATORS_COUNT,
  authMiddleware.verifyRole("admin"),
  dashboardController.getTotalOperatorsCount,
);

adminRouter.get(
  ROUTES.DASHBOARD.ADMIN.OPERATORS_PENDING_COUNT,
  authMiddleware.verifyRole("admin"),
  dashboardController.getPendingOperatorsCount,
);

export { adminRouter };
