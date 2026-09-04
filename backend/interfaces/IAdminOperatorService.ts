import { IAdminUpdateOperatorRequestDTO, IBlockOperatorRequestDTO, IVerifyOperatorRequestDTO } from "../dto-mapping/dto/admin/adminRequestDTO";
import { IOperator } from "./IOperator";

export interface IAdminOperatorService {
  getOperatorVerificationRequestsService(): Promise<IOperator[]>;
  verifyOperatorService(
    id: string,
    dto:IVerifyOperatorRequestDTO
  ): Promise<{
    message: string;
  }>;
  getPaginatedOperatorsService(
    skip: number,
    limit: number,
  ): Promise<IOperator[]>;
 
  getSingleOperatorService(id: string): Promise<any>;
  blockOperatorService(id: string, dto:IBlockOperatorRequestDTO): Promise<any>;
  deleteOperatorService(id: string): Promise<any>;
  adminUpdateOperatorService(id: string, dto: IAdminUpdateOperatorRequestDTO): Promise<any>
}
