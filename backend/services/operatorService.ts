import { Types as mongooseType } from "mongoose";
import type { IOperatorRepository } from "../interfaces/IOperatorRepository";
import type { IOperatorService } from "../interfaces/IOperatorService";
import { CustomError } from "../utils/customError";

import { inject, injectable } from "inversify";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import type { IHashGenerator } from "../interfaces/IHashGenerator";
import type { IHashService } from "../interfaces/IHashService";
import type { IMailService } from "../interfaces/IMailService";
import { IOperatorResponse } from "../interfaces/IOperator";
import type { ISecurityService } from "../interfaces/ISecurityService";
import type { ITokenService } from "../interfaces/ITokenService";
import { Types } from "../types/types";

import {
  IAdminUpdateOperatorinput,
  IAdminUpdateOperatorRequestDTO,
  IBlockOperatorRequestDTO,
  IVerifyOperatorRequestDTO,
} from "../dto-mapping/dto/admin/adminRequestDTO";
import {
  IOperatorLoginInput,
  IOperatorLoginRequestDTO,
  IOperatorRegisterInput,
  IOperatorRegisterRequestDTO,
  IResetOperatorPasswordAuthenticatedInput,
  IResetOperatorPasswordAuthenticatedRequestDTO,
  IUpdateOperatorProfileInput,
  IUpdateOperatorProfileRequestDTO,
  IVerifyOperatorOtpInput,
  IVerifyOperatorOtpRequestDTO,
} from "../dto-mapping/dto/operator/operatorRequestDTO";
import { OperatorRequestMapper } from "../dto-mapping/mapper/operator/OperatorRequestMapper";
import { OperatorResponseMapper } from "../dto-mapping/mapper/operator/OperatorResponseMapper";
import { IOperatorResponseDTO } from "../dto-mapping/dto/operator/operatorResponseDTO";
import { AdminResponseMapper } from "../dto-mapping/mapper/admin/AdminResponseMapper";
import { AdminRequestMapper } from "../dto-mapping/mapper/admin/AdminRequestMapper";

@injectable()
export class OperatorService implements IOperatorService {
  constructor(
    @inject(Types.OperatorRepository)
    private _operatorRepository: IOperatorRepository,
    @inject(Types.MailService) private _mailService: IMailService,
    @inject(Types.BcryptHashService) private _hashService: IHashService,
    @inject(Types.SecurityService) private _securityService: ISecurityService,
    @inject(Types.TokenService) private _tokenService: ITokenService,
    @inject(Types.CryptoHashService) private _resetTokenHasher: IHashGenerator,
  ) {}
  async operatorRegisterService(body: IOperatorRegisterInput) {
    const dto = OperatorRequestMapper.toOperatorRegisterRequestDTO(body);
    const existing = await this._operatorRepository.findByEmail(
      dto.email as string,
    );
    if (existing) {
      throw new CustomError(
        RESPONSE_MESSAGES.AUTH.ERROR.EMAIL_EXISTS,
        StatusCode.BAD_REQUEST,
      );
    }
    const hashedPassword = this._hashService.hash(dto.password as string);
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    const otpExpire = Date.now() + 10 * 60 * 1000;
    const newOperator = await this._operatorRepository.create({
      ...dto,
      password: hashedPassword,
      otp,
      otpExpire,
    });

    await this._mailService.sendEmail(
      dto.email as string,
      "Verify your email",
      `Your otp is ${otp} .It expires in 10 minutes`,
    );

    const result = {
      operatorId: (newOperator._id as mongooseType.ObjectId).toString(),
      otpExpire: newOperator.otpExpire as unknown as string,
    };
    return OperatorResponseMapper.toOperatorRegisterRespsonseDTO(result);
  }

  async operatorVerifyOtpService(body: IVerifyOperatorOtpInput) {
    const dto = OperatorRequestMapper.toVerityOperatorOtpDTO(body);
    const { operatorId, otp } = dto;
    const operator = await this._operatorRepository.findById(operatorId);
    if (!operator)
      throw new CustomError(
        RESPONSE_MESSAGES.USER.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    if (operator.isEmailVerified)
      throw new CustomError(
        RESPONSE_MESSAGES.AUTH.ERROR.EMAIL_ALREADY_VERIFIED,
        StatusCode.BAD_REQUEST,
      );
    if (otp !== operator.otp || operator.otpExpire! < Date.now()) {
      throw new CustomError(
        RESPONSE_MESSAGES.AUTH.ERROR.OTP_EXPIRED_OR_INVALID,
        StatusCode.BAD_REQUEST,
      );
    }
    operator.isEmailVerified = true;
    operator.otp = undefined;
    operator.otpExpire = undefined;
    await this._operatorRepository.save(operator);
  }

  async operatorResendOtpService(
    operatorId: string,
  ): Promise<{ otpExpire: number }> {
    const operator = await this._operatorRepository.findById(operatorId);
    if (!operator)
      throw new CustomError(
        RESPONSE_MESSAGES.OPERATOR.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    const otpExpire = Date.now() + 10 * 60 * 1000;
    operator.otp = otp;
    operator.otpExpire = otpExpire;
    await this._operatorRepository.save(operator);
    await this._mailService.sendEmail(
      operator.email,
      "Your new OTP",
      `your new otp is ${otp}`,
    );
    return { otpExpire };
  }

  async operatorLoginService(body: IOperatorLoginInput): Promise<{
    accessToken: string;
    refreshToken: string;
    operatorData: IOperatorResponseDTO;
  }> {
    const dto = OperatorRequestMapper.toOperatorLoginRequestDTO(body);
    const { email, password } = dto;
    const operator = await this._operatorRepository.findByEmail(email);
    if (!operator)
      throw new CustomError(
        RESPONSE_MESSAGES.OPERATOR.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    const isMatch = this._hashService.compare(password, operator.password);
    if (!isMatch)
      throw new CustomError(
        RESPONSE_MESSAGES.AUTH.ERROR.INVALID_CREDENTIALS,
        StatusCode.UNAUTHORIZED,
      );
    if (!operator.isVerified)
      throw new CustomError(
        RESPONSE_MESSAGES.OPERATOR.ERROR.NOT_VERIFIED,
        StatusCode.UNAUTHORIZED,
      );
    if (operator.isBlocked)
      throw new CustomError(
        RESPONSE_MESSAGES.AUTH.ERROR.ACCOUNT_BLOCKED,
        StatusCode.UNAUTHORIZED,
      );
    const accessToken = this._securityService.generateAccessToken({
      id: operator._id.toString(),
      role: operator.role,
    });
    const refreshToken = this._securityService.generateRefreshToken({
      id: operator._id.toString(),
      role: operator.role,
    });
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...operatorData } = operator.toObject();
    return {
      accessToken,
      refreshToken,
      operatorData: OperatorResponseMapper.toOperatorResponseDTO(operator),
    };
  }

  async operatorForgotPasswordService(email: string) {
    const operator = await this._operatorRepository.findByEmail(email);
    if (!operator)
      throw new CustomError(
        RESPONSE_MESSAGES.OPERATOR.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    const { resetToken, expireTime, hashedToken } =
      this._tokenService.getPasswordResetToken();

    operator.resetPasswordToken = hashedToken;
    operator.resetPasswordExpire = expireTime;
    await this._operatorRepository.save(operator);
    const resetUrl = `${process.env.FRONTEND_URL}/operator/reset-password/${resetToken}`;
    await this._mailService.sendEmail(
      operator.email,
      "Reset Password",
      `Click this link to reset your password: ${resetUrl}`,
    );

    return { message: RESPONSE_MESSAGES.AUTH.SUCCESS.RESET_LINK_SENT };
  }

  async operatorResetPasswordService(token: string, newPassword: string) {
    const hashedToken = this._resetTokenHasher.hash(token);

    const operator =
      await this._operatorRepository.findByResetToken(hashedToken);
    if (!operator)
      throw new CustomError(
        RESPONSE_MESSAGES.AUTH.ERROR.INVALID_TOKEN,
        StatusCode.BAD_REQUEST,
      );

    operator.password = this._hashService.hash(newPassword);
    operator.resetPasswordToken = undefined;
    operator.resetPasswordExpire = undefined;
    await operator.save();
    return { message: RESPONSE_MESSAGES.AUTH.SUCCESS.PASSWORD_UPDATE };
  }

  async updateOperatorService(id: string, body: IUpdateOperatorProfileInput) {
    const dto = OperatorRequestMapper.toUpdateOperatorProfileDTO(body);
    const updatedOperator = await this._operatorRepository.updateById(id, dto);
    if (!updatedOperator) {
      throw new CustomError(
        RESPONSE_MESSAGES.OPERATOR.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    return OperatorResponseMapper.toOperatorResponseDTO(updatedOperator);
  }

  async updateOperatorProfileImageService(id: string, image: string) {
    const operator= await this._operatorRepository.updateOperatorProfileImage(id, image);
    if(!operator){
      throw new CustomError(RESPONSE_MESSAGES.OPERATOR.ERROR.NOT_FOUND,StatusCode.NOT_FOUND)
    }
   return OperatorResponseMapper.toOperatorResponseDTO(operator)
  }

  operatorLogoutService(): { message: string } {
    return { message: RESPONSE_MESSAGES.AUTH.SUCCESS.OPERATOR_LOGOUT };
  }

  async resetPasswordAuthenticatedService(
    operatorId: string,
    body: IResetOperatorPasswordAuthenticatedInput,
  ) {
     const dto =
        OperatorRequestMapper.toOperatorResetPasswordAuthenticatedRequestDTO(
          body,
        );
    const { confirmPassword, newPassword, oldPassword } = dto;
    const operator = await this._operatorRepository.findById(operatorId);
    if (!operator)
      throw new CustomError(
        RESPONSE_MESSAGES.OPERATOR.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    const isMatch = this._hashService.compare(oldPassword, operator.password);
    if (!isMatch)
      throw new CustomError(
        RESPONSE_MESSAGES.AUTH.ERROR.OLD_PASSWORD_INCORRECT,
        StatusCode.BAD_REQUEST,
      );
    if (confirmPassword !== newPassword)
      throw new CustomError(
        RESPONSE_MESSAGES.AUTH.ERROR.PASSWORD_MISMATCH,
        StatusCode.BAD_REQUEST,
      );
    operator.password = this._hashService.hash(newPassword);
    await this._operatorRepository.save(operator);
    return { message: RESPONSE_MESSAGES.AUTH.SUCCESS.PASSWORD_UPDATE };
  }
  getTotalOperatorsCount() {
    return this._operatorRepository.countDocuments();
  }

  async getOperatorVerificationRequestsService() {
    const pendingOperators= await this._operatorRepository.getPendingOperator();
   return AdminResponseMapper.toAdminOperatorListResponseDTO(pendingOperators)
  }
  async verifyOperatorService(id: string,body: {
    isVerified: boolean;
  }) {
       const dto = AdminRequestMapper.toVerifyOperatorPayload(body);
    const { isVerified } = dto;
    const updated = await this._operatorRepository.updateOperatorStatus(
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
    await this._mailService.sendEmail(updated.email, subject, message);
    if (!isVerified) {
      await this._operatorRepository.deleteById(id);
    }

    return { message: `Operator ${isVerified ? "verified" : "rejected"}` };
  }

  async getPaginatedOperatorsService(skip: number, limit: number) {
    const operators=await this._operatorRepository.getPaginatedOperators(skip, limit);
    return AdminResponseMapper.toAdminOperatorListResponseDTO(operators)
  }

  async getOperatorDetailsService(id: string) {
    const operator=await this._operatorRepository.findById(id);
    if(!operator){
      throw new CustomError(RESPONSE_MESSAGES.OPERATOR.ERROR.NOT_FOUND,StatusCode.NOT_FOUND)
    }
   return AdminResponseMapper.toAdminOperatorResponseDTO(operator)
  }

  async blockOperatorService(id: string, body:{
    isBlocked: boolean;
  }) {
       const dto = AdminRequestMapper.toBlockOperatorPayload(body);
    const { isBlocked } = dto;
    const blockedOperator=await this._operatorRepository.updateOperatorBlockStatus(id, isBlocked);
    if(!blockedOperator){
      throw new  CustomError(RESPONSE_MESSAGES.OPERATOR.ERROR.NOT_FOUND,StatusCode.NOT_FOUND)
    }
   return AdminResponseMapper.toAdminOperatorResponseDTO(blockedOperator)
  }

  async deleteOperatorService(id: string) {
    return this._operatorRepository.deleteById(id);
  }
  async adminUpdateOperatorService(
    id: string,
    body: IAdminUpdateOperatorinput,
  ) {
     const dto = AdminRequestMapper.toAdminUpdateOperatorRequestDTO(body);
    const updatedOperator= await this._operatorRepository.updateById(id, dto);
    if(!updatedOperator){
      throw new CustomError(RESPONSE_MESSAGES.OPERATOR.ERROR.NOT_FOUND,StatusCode.NOT_FOUND)
    }
   return OperatorResponseMapper.toOperatorResponseDTO(updatedOperator)
  }
}
