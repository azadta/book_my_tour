import {
  IOperatorLoginRequestDTO,
  IOperatorRegisterRequestDTO,

  IResetOperatorPasswordAuthenticatedRequestDTO,
  IUpdateOperatorProfileRequestDTO,
  IVerifyOperatorOtpRequestDTO
} from "../dto-mapping/dto/operator/operatorRequestDTO";
import { IOperator, IOperatorResponse } from "./IOperator";

export interface IOperatorService {
  operatorRegisterService(dto: IOperatorRegisterRequestDTO): Promise<{
    operatorId: string;
    otpExpire: number | undefined;
  }>;
  operatorVerifyOtpService(dto: IVerifyOperatorOtpRequestDTO): Promise<void>;
  operatorResendOtpService(operatorId: string): Promise<{
    otpExpire: number;
  }>;
  operatorLoginService(dto: IOperatorLoginRequestDTO): Promise<{
    accessToken: string;
    refreshToken: string;
    operatorData: IOperatorResponse;
  }>;
  operatorForgotPasswordService(email: string): Promise<{
    message: string;
  }>;
  operatorResetPasswordService(
    token: string,
    newPassword: string,
  ): Promise<{
    message: string;
  }>;
  updateOperatorService(
    id: string,
    dto: IUpdateOperatorProfileRequestDTO,
  ): Promise<IOperator | null>;
  updateOperatorProfileImageService(
    id: string,
    image: string,
  ): Promise<IOperator | null>;
  operatorLogoutService(): {
    message: string;
  };

  resetPasswordAuthenticatedService(
    operatorId: string,
    dto: IResetOperatorPasswordAuthenticatedRequestDTO,
  ): Promise<{
    message: string;
  }>;
  getTotalOperatorsCount(): Promise<number>;
}
