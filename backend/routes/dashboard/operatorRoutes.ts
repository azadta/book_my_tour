import express from "express";
import { ROUTES } from "../../constants/routesConstants";
import { authMiddleware, dashboardController } from "../../config/container";

const operatorRouter = express.Router();

operatorRouter.get(
  ROUTES.DASHBOARD.OPERATOR.STATS,
  authMiddleware.verifyRole("operator"),
  dashboardController.getOperatorDashboardData,
);

export { operatorRouter };
