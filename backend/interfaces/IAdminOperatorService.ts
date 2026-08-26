import { IOperator } from "./IOperator";

export interface IAdminOperatorService {
  getOperatorVerificationRequestsService(): Promise<IOperator[]>;
  verifyOperatorService(
    id: string,
    isVerified: boolean,
  ): Promise<{
    message: string;
  }>;
  getPaginatedOperatorsService(
    skip: number,
    limit: number,
  ): Promise<IOperator[]>;
 
  getSingleOperatorService(id: string): Promise<any>;
  blockOperatorService(id: string, isBlocked: boolean): Promise<any>;
  deleteOperatorService(id: string): Promise<any>;
}
