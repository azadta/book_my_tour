import { IWalletDocument, IWalletTransaction } from "../models/Wallet";
import { IBaseRepository } from "./IBaseRepository";

export interface IWalletRepository extends IBaseRepository<IWalletDocument> {
  addPendingTransaction(
    userId: string,
    transaction: IWalletTransaction,
  ): Promise<IWalletDocument | null>;
  updatePendingTransactionAndBalance(
    userId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    status: "SUCCESS" | "FAILED",
  ): Promise<IWalletDocument | null>;
  deductBalance(
    userId: string,
    amount: number,
    transaction: IWalletTransaction,
  ): Promise<IWalletDocument | null>;
  getPaginatedWallet(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<{
    wallet: IWalletDocument | null;
    totalCount: number;
    transactions: IWalletTransaction[];
  }>;
  addCreditTransaction(
    userId: string,
    transaction: IWalletTransaction,
  ): Promise<IWalletDocument | null>;
}
