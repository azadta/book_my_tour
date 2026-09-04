import { inject, injectable } from "inversify";
import { IAdminOperatorService } from "../interfaces/IAdminOperatorService";
import { CustomError } from "../utils/customError";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import { Types } from "../types/types";
import type { IOperatorRepository } from "../interfaces/IOperatorRepository";
import type { IMailService } from "../interfaces/IMailService";

@injectable()
export class AdminOperatorService implements IAdminOperatorService {
  constructor(
    @inject(Types.OperatorRepository)
    private operatorRepository: IOperatorRepository,

    @inject(Types.MailService) private mailService: IMailService,
  ) {}

  async getOperatorVerificationRequestsService() {
    return await this.operatorRepository.getPendingOperator();
  }
  async verifyOperatorService(id: string, isVerified: boolean) {
    const updated = await this.operatorRepository.updateOperatorStatus(
      id,
      isVerified,
    );
    if (!updated)
      throw new CustomError(
        RESPONSE_MESSAGES.OPERATOR.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    const subject = "Verification Request update";

    const message = isVerified
      ? `Hi ${updated.name},<br><br>your operator account has been  <b>verified</b>.You can now access your dashboard and manage packages`
      : `Hi ${updated.name},<br><br>your verification request has been  <b>rejected</b>.Please contact support for clarification`;
    await this.mailService.sendEmail(updated.email, subject, message);
    if (!isVerified) {
      await this.operatorRepository.deleteById(id);
    }

    return { message: `Operator ${isVerified ? "verified" : "rejected"}` };
  }

  async getPaginatedOperatorsService(skip: number, limit: number) {
    return this.operatorRepository.getPaginatedOperators(skip, limit);
  }

 

  async getSingleOperatorService(id: string) {
    return this.operatorRepository.findById(id);
  }

  async blockOperatorService(id: string, isBlocked: boolean) {
    return this.operatorRepository.updateOperatorBlockStatus(id, isBlocked);
  }

  async deleteOperatorService(id: string) {
    return this.operatorRepository.deleteById(id);
  }
}
