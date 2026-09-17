import express from "express";
import { ROUTES } from "../../constants/routesConstants";
import { authMiddleware, packageController } from "../../config/container";
import { validatePackage } from "../../middlewares/validatePackage";

const operatorRouter = express.Router();

operatorRouter.post(
  ROUTES.PACKAGES.OPERATOR.CREATE,
  authMiddleware.verifyRole("operator"),
  validatePackage,
  packageController.createPackage,
);
operatorRouter.get(
  ROUTES.PACKAGES.OPERATOR.MY_COUNT,
  authMiddleware.verifyRole("operator"),
  packageController.getMyPackagesCount,
);
operatorRouter.get(
  ROUTES.PACKAGES.OPERATOR.DETAIL,
  authMiddleware.verifyRole("operator"),
  packageController.getPackageByIdAndOperator,
);
operatorRouter.delete(
  ROUTES.PACKAGES.OPERATOR.DELETE,
  authMiddleware.verifyRole("operator"),
  packageController.deletePackage,
);
operatorRouter.put(
  ROUTES.PACKAGES.OPERATOR.UPDATE,
  authMiddleware.verifyRole("operator"),
  validatePackage,
  packageController.updatePackage,
);
operatorRouter.get(
  ROUTES.PACKAGES.OPERATOR.LIST,
  authMiddleware.verifyRole("operator"),
  packageController.getOperatorPaginatedPackages,
);

export { operatorRouter };
