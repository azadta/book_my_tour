import express from "express";
import { ROUTES } from "../../constants/routesConstants";
import { authMiddleware, operatorController } from "../../config/container";
import { validateUpdateOperator } from "../../middlewares/operatorUpdateValidator";

const adminRouter = express.Router();

adminRouter.get(
  ROUTES.OPERATORS.ADMIN.VERIFICATION_RQS,
  authMiddleware.verifyRole("admin"),
  operatorController.getOperatorVerificationRequests,
);
adminRouter.put(
  ROUTES.OPERATORS.ADMIN.VERIFY,
  authMiddleware.verifyRole("admin"),
  operatorController.verifyOperator,
);
adminRouter.get(
  ROUTES.OPERATORS.ADMIN.LIST,
  authMiddleware.verifyRole("admin"),
  operatorController.getPaginatedOperators,
);
adminRouter.put(
  ROUTES.OPERATORS.ADMIN.BLOCK,
  authMiddleware.verifyRole("admin"),
  operatorController.blockOperator,
);
adminRouter.delete(
  ROUTES.OPERATORS.ADMIN.DELETE,
  authMiddleware.verifyRole("admin"),
  operatorController.deleteOperator,
);
adminRouter.get(
  ROUTES.OPERATORS.ADMIN.DETAILS,
  authMiddleware.verifyRole("admin"),
  operatorController.getOperatorDetails,
);
adminRouter.put(
  ROUTES.OPERATORS.ADMIN.UPDATE,
  authMiddleware.verifyRole("admin"),
  validateUpdateOperator,
  operatorController.AdminUpdateOperator,
);

export { adminRouter };
