import { injectable } from "inversify";
import { BaseRepository } from "./baseRepository";
import { IWalletDocument, IWalletTransaction, Wallet } from "../models/Wallet";
import { IWalletRepository } from "../interfaces/IWalletRepository";
import mongoose from "mongoose";

@injectable()
export class WalletRepository
  extends BaseRepository<IWalletDocument>
  implements IWalletRepository
{
  constructor() {
    super(Wallet);
  }
  async addCreditTransaction(
    userId: string,
    transaction: IWalletTransaction,
  ): Promise<IWalletDocument | null> {
    const updatedQuery: any = { $push: { transactions: transaction } };
    if (transaction.type === "CREDIT" && transaction.status === "SUCCESS") {
      updatedQuery.$inc = { balance: transaction.amount };
    }
    return await Wallet.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      updatedQuery,
      { new: true },
    );
  }

  async addPendingTransaction(
    userId: string,
    transaction: IWalletTransaction,
  ): Promise<IWalletDocument | null> {
    return await Wallet.findOneAndUpdate(
      { userId },
      { $push: { transactions: transaction } },
      { new: true },
    );
  }

  async updatePendingTransactionAndBalance(
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
  async getPaginatedWallet(
    userId: string,
    page: number = 1,
    limit: number = 5,
  ): Promise<{
    wallet: IWalletDocument | null;
    totalCount: number;
    transactions: IWalletTransaction[];
  }> {
    const skip = (page - 1) * limit;
    const result = await Wallet.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $project: {
          balance: 1,
          userId: 1,
          totalCount: { $size: "$transactions" },
          transactions: {
            $slice: [{ $reverseArray: "$transactions" }, skip, limit],
          },
        },
      },
    ]);
    if (!result || result.length === 0) {
      return { wallet: null, totalCount: 0, transactions: [] };
    }

    return {
      wallet: result[0],
      totalCount: result[0].totalCount,
      transactions: result[0].transactions,
    };
  }
}
