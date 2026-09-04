import {
  CreateTopupOrderRequestDTO,
  verifyTopupPaymentRequestDTO,
} from "../dto-mapping/dto/wallet/walletRequestDTO";
import { IWalletDocument } from "../models/Wallet";

export interface IWalletService {
  getWallet(userId: string): Promise<IWalletDocument>;
  createTopupOrder(
    userId: string,
    dto: CreateTopupOrderRequestDTO,
  ): Promise<{
    orderId: string;
    amount: number;
    currency: string;
    keyId: string | undefined;
  }>;
  verifyTopupPayment(
    userId: string,
    dto: verifyTopupPaymentRequestDTO,
  ): Promise<IWalletDocument | null>;
}
