import crypto from "crypto";
import { inject, injectable } from "inversify";
import mongoose from "mongoose";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import {
  CreateTopupOrderRequestDTO,
  verifyTopupPaymentRequestDTO,
} from "../dto-mapping/dto/wallet/walletRequestDTO";
import type { IPaymentService } from "../interfaces/IPaymentService";
import type { IWalletRepository } from "../interfaces/IWalletRepository";
import { IWalletService } from "../interfaces/IWalletService";
import { Types } from "../types/types";
import { CustomError } from "../utils/customError";

@injectable()
export class WalletService implements IWalletService {
  constructor(
    @inject(Types.WalletRepository) private walletRepository: IWalletRepository,
    @inject(Types.PaymentService) private paymentService: IPaymentService,
  ) {}

  async getWallet(userId: string) {
    let wallet = await this.walletRepository.findOne({ userId });
    if (!wallet) {
      wallet = await this.walletRepository.create({
        userId: new mongoose.Types.ObjectId(userId),
        balance: 0,
        transactions: [],
      });
    }
    return wallet;
  }

  async createTopupOrder(userId: string, dto: CreateTopupOrderRequestDTO) {
    if (dto.amount <= 0) {
      throw new CustomError(
        RESPONSE_MESSAGES.WALLET.ERROR.NON_POSITIVE_AMOUNT,
        StatusCode.BAD_REQUEST,
      );
    }
    const order = await this.paymentService.createOrder({
      amount: dto.amount,
      receipt: `receipt_wallet_${Date.now()}`,
      notes: { userId, purpose: "WALLET_TOPUP" },
    });
    if (!order) {
      throw new CustomError(
        RESPONSE_MESSAGES.PAYMENT.ERROR.INITIATE,
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    const transaction = {
      transactionId: `TXN_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      razorpayOrderId: order.id,
      type: "CREDIT" as const,
      purpose: "WALLET_TOPUP" as const,
      amount: dto.amount,
      status: "PENDING" as const,
      description: "Wallet Top-up via Razorpay",
    };
    await this.walletRepository.addTransaction(userId, transaction);
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    };
  }

  async verifyTopupPayment(userId: string, dto: verifyTopupPaymentRequestDTO) {
    const isValid = this.paymentService.verifySignature(dto);
    const status = isValid ? "SUCCESS" : "FAILED";
    const updatedWallet =
      await this.walletRepository.updateTransactionAndBalance(
        userId,
        dto.razorpayOrderId,
        dto.razorpayPaymentId,
        status,
      );
    if (!isValid) {
      throw new CustomError(
        RESPONSE_MESSAGES.PAYMENT.ERROR.PAYMETNT_SIGNATURE,
        StatusCode.BAD_REQUEST,
      );
    }
    return updatedWallet;
  }

  // async getWalletWithPagination(userId:string,limit:number,skip:number){

  //     const wallet= await this.walletRepository.findOne({userId})
  //     const walletTransactions=wallet?.transactions
  //     const updatedWallet={transactions}
  // }
}
