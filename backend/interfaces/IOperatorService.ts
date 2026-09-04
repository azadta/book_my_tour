import { IOperator, IOperatorResponse } from "./IOperator";

export interface IOperatorService {
  operatorRegisterService(data: Partial<IOperator>): Promise<{
    operatorId: string;
    otpExpire: number | undefined;
  }>;
  operatorVerifyOtpService(operatorId: string, otp: string): Promise<void>;
  operatorResendOtpService(operatorId: string): Promise<{
    otpExpire: number;
  }>;
  operatorLoginService(
    email: string,
    password: string,
  ): Promise<{
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
    data: Partial<IOperator>,
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
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<{
    message: string;
  }>;
  getTotalOperatorsCount(): Promise<number>;
}
