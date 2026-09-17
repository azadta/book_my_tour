import express from "express";
import { authMiddleware, operatorController } from "../../config/container";
import { ROUTES } from "../../constants/routesConstants";
import { validateUpdateOperator } from "../../middlewares/operatorUpdateValidator";
import { resetPasswordValidator } from "../../middlewares/resetPasswordValidator";

const operatorRouter = express.Router();

operatorRouter.post(
  ROUTES.OPERATORS.OPERATOR.REGISTER,
  operatorController.operatorRegister,
);
operatorRouter.post(
  ROUTES.OPERATORS.OPERATOR.VERIFY_OTP,
operatorController.operatorOtpverification,
);
operatorRouter.post(
  ROUTES.OPERATORS.OPERATOR.RESEND_OTP,
operatorController.operatorResendOtp,
);
operatorRouter.post(
  ROUTES.OPERATORS.OPERATOR.LOGIN,
operatorController.loginOperator,
);
operatorRouter.post(
  ROUTES.OPERATORS.OPERATOR.FORGOT_PASSWORD,
operatorController.forgotOperatorPassword,
);
operatorRouter.post(
  ROUTES.OPERATORS.OPERATOR.RESET_PASSWORD,
  resetPasswordValidator,
operatorController.resetOperatorPassword,
);
operatorRouter.delete(
  ROUTES.OPERATORS.OPERATOR.LOGOUT,
operatorController.operatorLogout,
);
operatorRouter.post(
  ROUTES.OPERATORS.OPERATOR.UPDATE_IMAGE,
  authMiddleware.verifyRole('operator'),
  validateUpdateOperator,
operatorController.updateOperatorProfileImage,
);
operatorRouter.post(
  ROUTES.OPERATORS.OPERATOR.UPDATE,
  authMiddleware.verifyRole('operator'),
  validateUpdateOperator,
operatorController.updateOperator,
);
operatorRouter.post(
  ROUTES.OPERATORS.OPERATOR.RESET_PASSWORD_AUTH,
  authMiddleware.verifyRole('operator'),
  resetPasswordValidator,
operatorController.resetPasswordAuthenticated,
);

export { operatorRouter };
