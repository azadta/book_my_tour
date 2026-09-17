import express from "express";
import { ROUTES } from "../../constants/routesConstants";
import { authMiddleware, userController } from "../../config/container";
import { validateUpdateUser } from "../../middlewares/userUpdateValidator";

const adminRouter = express.Router();

adminRouter.get(
  ROUTES.USERS.ADMIN.LIST,
  authMiddleware.verifyRole("admin"),
  userController.getPaginatedUsers,
);
adminRouter.put(
  ROUTES.USERS.ADMIN.BLOCK,
  authMiddleware.verifyRole("admin"),
  userController.blockUser,
);
adminRouter.delete(
  ROUTES.USERS.ADMIN.DELETE,
  authMiddleware.verifyRole("admin"),
  userController.adminDeleteUser,
);
adminRouter.get(
  ROUTES.USERS.ADMIN.DETAIL,
  authMiddleware.verifyRole("admin"),
  userController.getUserDetails,
);
adminRouter.put(
  ROUTES.USERS.ADMIN.UPDATE,
  authMiddleware.verifyRole("admin"),
  validateUpdateUser,
  userController.adminUpdateUser,
);


export { adminRouter };
