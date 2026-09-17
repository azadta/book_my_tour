import { inject, injectable } from "inversify";
import { IWalletController } from "../interfaces/IWalletController";
import { Types } from "../types/types";
import type { IWalletService } from "../interfaces/IWalletService";
import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../constants/statusCodeConstants";
import { WalletResponseMapper } from "../dto-mapping/mapper/wallet/WalletResponseMapper";
import { WalletRequestMapper } from "../dto-mapping/mapper/wallet/WalletRequestMapper";

@injectable()
export class WalletController implements IWalletController {
  constructor(
    @inject(Types.WalletService) private walletService: IWalletService,
  ) {}
  //user
  getWallet = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const data = await this.walletService.getWalletWithPagination(
        userId,
        page,
        limit,
      );

      res
        .status(StatusCode.OK)
        .json(WalletResponseMapper.toPaginatedWalletResponseDTO(data));
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
      const dto = WalletRequestMapper.toCreateTopupOrderReqDTO(req.body);

      const result = await this.walletService.createTopupOrder(userId, dto);
      res
        .status(StatusCode.OK)
        .json(WalletResponseMapper.toTopupOrderResponseDTO(result));
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
      const dto = WalletRequestMapper.toVerifyTopupPaymentReqDTO(req.body);

      const wallet = await this.walletService.verifyTopupPayment(userId, dto);
      res
        .status(StatusCode.OK)
        .json(WalletResponseMapper.toWalletResponseDTO(wallet));
    } catch (error) {
      next(error);
    }
  };
}
