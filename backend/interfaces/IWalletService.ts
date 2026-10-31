import {
  CreateTopupOrderInput,
  CreateTopupOrderRequestDTO,
  verifyTopupPaymentInput,
  verifyTopupPaymentRequestDTO,
} from "../dto-mapping/dto/wallet/walletRequestDTO";
import {
  PaginatedWalletResponseDTO,
  TopupOrderResponseDTO,
  WalletResponseDTO,
} from "../dto-mapping/dto/wallet/walletResponseDTO";
import { IWalletDocument, IWalletTransaction } from "../models/Wallet";

export interface IWalletService {
  createTopupOrder(
    userId: string,
    body: CreateTopupOrderInput,
  ): Promise<TopupOrderResponseDTO>;
  verifyTopupPayment(
    userId: string,
    body: verifyTopupPaymentInput,
  ): Promise<WalletResponseDTO>;
  getWalletWithPagination(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedWalletResponseDTO>;
}
