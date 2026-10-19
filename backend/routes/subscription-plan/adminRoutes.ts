import express from "express";
import {
    authMiddleware,
    subscriptionPlanController
} from "../../config/container";
import { ROUTES } from "../../constants/routesConstants";
import { validateSubscriptionPlan } from "../../middlewares/validateSubscriptionPlan";

const adminRouter = express.Router();

adminRouter.post(
  ROUTES.SUBSCRIPTION_PLAN.ADMIN.CREATE,
  authMiddleware.verifyRole("admin"),
  validateSubscriptionPlan,
  subscriptionPlanController.createPlan,
);
adminRouter.get(
  ROUTES.SUBSCRIPTION_PLAN.ADMIN.LIST,
  authMiddleware.verifyRole("admin",'operator'),
  subscriptionPlanController.getAllPlans,
);
adminRouter.get(
  ROUTES.SUBSCRIPTION_PLAN.ADMIN.DETAIL,
  authMiddleware.verifyRole("admin"),
  subscriptionPlanController.getPlanDetail,
);
adminRouter.put(
  ROUTES.SUBSCRIPTION_PLAN.ADMIN.UPDATE,
  authMiddleware.verifyRole("admin"),
  validateSubscriptionPlan,
  subscriptionPlanController.updatePlan,
);
adminRouter.delete(
  ROUTES.SUBSCRIPTION_PLAN.ADMIN.DELETE,
  authMiddleware.verifyRole("admin"),
  subscriptionPlanController.deletePlan,
);
export { adminRouter };

