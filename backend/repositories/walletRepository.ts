import { injectable } from "inversify";
import { BaseRepository } from "./baseRepository";
import { IWalletDocument, IWalletTransaction, Wallet } from "../models/Wallet";
import { IWalletRepository } from "../interfaces/IWalletRepository";

@injectable()
export class WalletRepository
  extends BaseRepository<IWalletDocument>
  implements IWalletRepository
{
  constructor() {
    super(Wallet);
  }

  async addTransaction(
    userId: string,
    transaction: IWalletTransaction,
  ): Promise<IWalletDocument | null> {
    return await Wallet.findOneAndUpdate(
      { userId },
      { $push: { transactions: transaction } },
      { new: true, upsert: true },
    );
  }

  async updateTransactionAndBalance(
    userId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    status: "SUCCESS" | "FAILED",
  ): Promise<IWalletDocument | null> {
    const wallet = await Wallet.findOne({
      userId,
      "transactions.razorpayOrderId": razorpayOrderId,
    });
    if (!wallet) return null;
    const tx = wallet.transactions.find(
      (t) => t.razorpayOrderId === razorpayOrderId,
    );
    if (!tx || tx.status !== "PENDING") return wallet;
    tx.status = status;
    tx.razorpayPaymentId = razorpayPaymentId;
    if (status === "SUCCESS" && tx.type === "CREDIT") {
      wallet.balance += tx.amount;
    }
    return wallet.save();
  }

  async deductBalance(
    userId: string,
    amount: number,
    transaction: IWalletTransaction,
  ): Promise<IWalletDocument | null> {
    return await Wallet.findOneAndUpdate(
      { userId, balance: { $gte: amount } },
      { $inc: { balance: -amount }, $push: { transactions: transaction } },
      { new: true },
    );
  }
}
