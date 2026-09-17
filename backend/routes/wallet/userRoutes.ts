import express from "express";
import { authMiddleware, walletController } from "../../config/container";
import { ROUTES } from "../../constants/routesConstants";

const userRouter = express.Router();

userRouter.get(
  ROUTES.WALLETS.USER.LIST,
  authMiddleware.verifyRole('user'),
  walletController.getWallet,
);
userRouter.post(
  ROUTES.WALLETS.USER.TOPUP,
  authMiddleware.verifyRole('user'),
  walletController.createWalletTopupOrder,
);
userRouter.post(
  ROUTES.WALLETS.USER.VERIFY_TOPUP,
  authMiddleware.verifyRole('user'),
  walletController.verifyWalletTopupPayment,
);


export { userRouter };
