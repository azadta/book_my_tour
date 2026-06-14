import { injectable } from "inversify";
import { IOperatorRepository } from "../interfaces/IOperatorRepository";
import Operator, { IOperator } from "../models/Operator";
import { BaseRepository } from "./baseRepository";

@injectable()
export class OperatorRepository
  extends BaseRepository<IOperator>
  implements IOperatorRepository
{
  constructor() {
    super(Operator);
  }

  async findByEmail(email: string): Promise<IOperator | null> {
    return Operator.findOne({ email });
  }
  async save(operator: IOperator): Promise<IOperator> {
    return operator.save();
  }

  async findByResetToken(token: string): Promise<IOperator | null> {
    return Operator.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });
  }
  updateOperatorProfileImage(
    id: string,
    image: string,
  ): Promise<IOperator | null> {
    return Operator.findByIdAndUpdate(id, { image }, { new: true });
  }

  getPendingOperatorsCount(): Promise<number> {
    return Operator.countDocuments({ isVerified: false });
  }

  async findOperatorById(id: string): Promise<IOperator | null> {
    return Operator.findById(id).select("-password");
  }

  async updateOperatorBlockStatus(
    id: string,
    isBlocked: boolean,
  ): Promise<IOperator | null> {
    return Operator.findByIdAndUpdate(id, { isBlocked }, { new: true });
  }

  async getPaginatedOperators(
    skip: number,
    limit: number,
  ): Promise<IOperator[]> {
    return Operator.find().skip(skip).limit(limit).select("-password");
  }

  getPendingOperator(): Promise<IOperator[]> {
    return Operator.find({ isVerified: false });
  }

  updateOperatorStatus(
    id: string,
    isVerified: boolean,
  ): Promise<IOperator | null> {
    return Operator.findByIdAndUpdate(id, { isVerified }, { new: true });
  }

  async countOperatorsByDateRange(start: Date, end: Date): Promise<number> {
    return Operator.countDocuments({ createdAt: { $gte: start, $lte: end } });
  }
}
