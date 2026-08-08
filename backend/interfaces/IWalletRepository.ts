import { IWalletDocument, IWalletTransaction } from "../models/Wallet";
import { IBaseRepository } from "./IBaseRepository";

export interface IWalletRepository extends IBaseRepository<IWalletDocument> {
  addTransaction(
    userId: string,
    transaction: IWalletTransaction,
  ): Promise<IWalletDocument | null>;
  updateTransactionAndBalance(
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
}
