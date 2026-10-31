import {
  IAdminUpdateOperatorinput,
  IAdminUpdateOperatorRequestDTO,
  IBlockOperatorRequestDTO,
  IVerifyOperatorRequestDTO,
} from "../dto-mapping/dto/admin/adminRequestDTO";

import {
  IOperatorLoginInput,
  IOperatorRegisterInput,
  IResetOperatorPasswordAuthenticatedInput,
  IUpdateOperatorProfileInput,
  IVerifyOperatorOtpInput,
} from "../dto-mapping/dto/operator/operatorRequestDTO";
import {
  IOperatorRegisterResponseDTO,
  IOperatorResponseDTO,
} from "../dto-mapping/dto/operator/operatorResponseDTO";
import { IOperator } from "./IOperator";

export interface IOperatorService {
  operatorRegisterService(
    body: IOperatorRegisterInput,
  ): Promise<IOperatorRegisterResponseDTO>;
  operatorVerifyOtpService(body: IVerifyOperatorOtpInput): Promise<void>;
  operatorResendOtpService(operatorId: string): Promise<{
    otpExpire: number;
  }>;
  operatorLoginService(body: IOperatorLoginInput): Promise<{
    accessToken: string;
    refreshToken: string;
    operatorData: IOperatorResponseDTO;
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
    body: IUpdateOperatorProfileInput,
  ): Promise<IOperatorResponseDTO>;
  updateOperatorProfileImageService(
    id: string,
    image: string,
  ): Promise<IOperatorResponseDTO>;
  operatorLogoutService(): {
    message: string;
  };

  resetPasswordAuthenticatedService(
    operatorId: string,
    body: IResetOperatorPasswordAuthenticatedInput,
  ): Promise<{
    message: string;
  }>;
  getTotalOperatorsCount(): Promise<number>;
  getOperatorVerificationRequestsService(): Promise<IOperatorResponseDTO[]>;
  verifyOperatorService(
    id: string,
    body: {
      isVerified: boolean;
    },
  ): Promise<{
    message: string;
  }>;
  getPaginatedOperatorsService(
    skip: number,
    limit: number,
  ): Promise<IOperatorResponseDTO[]>;
  getOperatorDetailsService(id: string): Promise<IOperatorResponseDTO>;
  blockOperatorService(
    id: string,
    body: {
      isBlocked: boolean;
    },
  ): Promise<IOperatorResponseDTO>;
  deleteOperatorService(id: string): Promise<any>;
  adminUpdateOperatorService(
    id: string,
    body: IAdminUpdateOperatorinput,
  ): Promise<IOperatorResponseDTO>;
}
