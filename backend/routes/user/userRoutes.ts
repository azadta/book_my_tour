import express from "express";
import { authMiddleware, userController } from "../../config/container";
import { ROUTES } from "../../constants/routesConstants";
import { validateUser } from "../../middlewares/userValidator";
import { resetPasswordValidator } from "../../middlewares/resetPasswordValidator";
import { validateUpdateUser } from "../../middlewares/userUpdateValidator";

const userRouter = express.Router();

userRouter.post(
  ROUTES.USERS.USER.REGISTER,
  validateUser,
  userController.register,
);
userRouter.post(ROUTES.USERS.USER.VERIFY_OTP, userController.verifyOtp);
userRouter.post(ROUTES.USERS.USER.RESEND_OTP, userController.resendOtp);
userRouter.post(ROUTES.USERS.USER.LOGIN, userController.login);
userRouter.post(ROUTES.USERS.USER.GOOGLE, userController.google);
userRouter.post(
  ROUTES.USERS.USER.FORGOT_PASSWORD,
  userController.forgotPassword,
);
userRouter.post(
  ROUTES.USERS.USER.RESET_PASSWORD,
  resetPasswordValidator,
  userController.resetPassword,
);
userRouter.delete(ROUTES.USERS.USER.LOGOUT, userController.logout);
userRouter.post(
  ROUTES.USERS.USER.UPDATE_IMAGE,
  authMiddleware.verifyRole("user"),
  validateUpdateUser,
  userController.updateProfileImage,
);


userRouter.post(
  ROUTES.USERS.USER.RESET_PASSWORD_AUTH,
  authMiddleware.verifyRole("user"),
  resetPasswordValidator,
  userController.resetPasswordAuthenticated,
);
userRouter.post(
  ROUTES.USERS.USER.UPDATE,
  authMiddleware.verifyRole("user"),
  validateUpdateUser,
  userController.updateUser,
);
userRouter.delete(
  ROUTES.USERS.USER.UPDATE,
  authMiddleware.verifyRole("user"),
  userController.deleteUser,
);

export { userRouter };
