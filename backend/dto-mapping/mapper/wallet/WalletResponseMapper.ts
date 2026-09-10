import { IWalletDocument, IWalletTransaction } from "../../../models/Wallet";
import {
  PaginatedWalletResponseDTO,
  TopupOrderResponseDTO,
  WalletResponseDTO,
  WalletTransactionResponseDTO,
} from "../../dto/wallet/walletResponseDTO";

export class WalletResponseMapper {
  static toTransactionResponseDTO(txn: any): WalletTransactionResponseDTO {
    return {
      _id: txn._id.toString(),
      transactionId: txn.transactionId,
      razorpayOrderId: txn.razorpayOrderId ?? null,
      razorpayPaymentId: txn.razorpayPaymentId ?? null,
      type: txn.type,
      purpose: txn.purpose,
      amount: txn.amount,
      status: txn.status,
      description: txn.description,
      createdAt: txn.createdAt,
    };
  }

  static toWalletResponseDTO(wallet: any): WalletResponseDTO {
    return {
      _id: wallet._id.toString(),
      userId: wallet.userId.toString(),
      balance: wallet.balance,
      transactions: wallet.transactions
        ? wallet.transactions.map((txn: any) =>
            this.toTransactionResponseDTO(txn),
          )
        : [],
      createdAt: new Date(wallet.createdAt).toISOString(),
      updatedAt: new Date(wallet.updatedAt).toISOString(),
    };
  }

  static toPaginatedWalletResponseDTO(data: {
    balance: number;
    totalCount: number;
    totalPages: number;
    transactions: IWalletTransaction[];
  }): PaginatedWalletResponseDTO {
    return {
      balance: data.balance,
      totalCount: data.totalCount,
      totalPages: data.totalPages,
      transactions: data.transactions.map((transaction) =>
        this.toTransactionResponseDTO(transaction),
      ),
    };
  }

  static toTopupOrderResponseDTO(data: any): TopupOrderResponseDTO {
    return {
      orderId: data.orderId,
      amount: data.amount,
      currency: data.currency,
      keyId: data.keyId,
    };
  }
}
