import { IOperator } from "../models/Operator";
import { IBaseRepository } from "./IBaseRepository";

export interface IOperatorRepository extends IBaseRepository<IOperator> {
  findByEmail(email: string): Promise<IOperator | null>;

  findByResetToken(token: string): Promise<IOperator | null>;
  updateOperatorProfileImage(
    id: string,
    image: string,
  ): Promise<IOperator | null>;

  getPendingOperatorsCount(): Promise<number>;

  updateOperatorBlockStatus(
    id: string,
    isBlocked: boolean,
  ): Promise<IOperator | null>;

  getPaginatedOperators(skip: number, limit: number): Promise<IOperator[]>;
  getPendingOperator(): Promise<IOperator[]>;

  updateOperatorStatus(
    id: string,
    isVerified: boolean,
  ): Promise<IOperator | null>;
  countOperatorsByDateRange(start: Date, end: Date): Promise<number>;
  save(operator: IOperator): Promise<IOperator>;
}
