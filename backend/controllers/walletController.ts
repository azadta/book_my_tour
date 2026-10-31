import { inject, injectable } from "inversify";
import { IWalletController } from "../interfaces/IWalletController";
import { Types } from "../types/types";
import type { IWalletService } from "../interfaces/IWalletService";
import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../constants/statusCodeConstants";
import { WalletResponseMapper } from "../dto-mapping/mapper/wallet/WalletResponseMapper";
import { WalletRequestMapper } from "../dto-mapping/mapper/wallet/WalletRequestMapper";
import { sendSuccessResponse } from "../utils/apiResponse";
import { RESPONSE_MESSAGES } from "../constants/messages";

@injectable()
export class WalletController implements IWalletController {
  constructor(
    @inject(Types.WalletService) private _walletService: IWalletService,
  ) {}

  getWallet = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const data = await this._walletService.getWalletWithPagination(
        userId,
        page,
        limit,
      );

      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.WALLET.SUCCESS.FETCH,
        data,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };
  createWalletTopupOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id as string;

      const result = await this._walletService.createTopupOrder(
        userId,
        req.body,
      );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.WALLET.SUCCESS.TOPUP_ORDER,
        result,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };
  verifyWalletTopupPayment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id as string;

      const wallet = await this._walletService.verifyTopupPayment(
        userId,
        req.body,
      );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.WALLET.SUCCESS.VERIFIED_TOPUP,
        wallet,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };
}
