import express from "express";
import { ROUTES } from "../../constants/routesConstants";
import { authMiddleware, dashboardController } from "../../config/container";

const adminRouter = express.Router();

adminRouter.get(
  ROUTES.DASHBOARD.ADMIN.SUMMARY,
  authMiddleware.verifyRole("admin"),
  dashboardController.getAdminSummaryCounts,
);

adminRouter.get(
  ROUTES.DASHBOARD.ADMIN.STATS,
  authMiddleware.verifyRole("admin"),
  dashboardController.getAdminDashboardData,
);

export { adminRouter };
