import {
  CreateTopupOrderInput,
  verifyTopupPaymentInput
} from "../dto-mapping/dto/wallet/walletRequestDTO";
import {
  PaginatedWalletResponseDTO,
  TopupOrderResponseDTO, 
  WalletResponseDTO,
} from "../dto-mapping/dto/wallet/walletResponseDTO";

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
