import { Types as mongooseType } from "mongoose";
import type { IOperatorRepository } from "../interfaces/IOperatorRepository";
import type { IOperatorService } from "../interfaces/IOperatorService";
import type { Ipackage } from "../models/Package";
import { CustomError } from "../utils/customError";
import { QueryFilter } from "mongoose";

import { inject, injectable } from "inversify";
import { StatusCode } from "../constants/statusCodeConstants";
import type { IDestinationRepository } from "../interfaces/IDestinationRepository";
import type { IHashGenerator } from "../interfaces/IHashGenerator";
import type { IHashService } from "../interfaces/IHashService";
import type { IMailService } from "../interfaces/IMailService";
import type { IPackageCategoryRepository } from "../interfaces/IPackageCategoryRepository";
import type { IPackageRepository } from "../interfaces/IPackageRepository";
import type { ISecurityService } from "../interfaces/ISecurityService";
import type { ITokenService } from "../interfaces/ITokenService";
import type { IDestination } from "../models/Destination";
import { Types } from "../types/types";
import { IOperator, IOperatorResponse } from "../interfaces/IOperator";
import { RESPONSE_MESSAGES } from "../constants/messages";

@injectable()
export class OperatorService implements IOperatorService {
  constructor(
    @inject(Types.OperatorRepository)
    private operatorRepository: IOperatorRepository,
    @inject(Types.PackageRepository)
    private packageRepository: IPackageRepository,
    @inject(Types.MailService) private mailService: IMailService,
    @inject(Types.BcryptHashService) private hashService: IHashService,
    @inject(Types.SecurityService) private securityService: ISecurityService,
    @inject(Types.TokenService) private tokenService: ITokenService,
    @inject(Types.CryptoHashService) private resetTokenHasher: IHashGenerator,
    @inject(Types.PackageCategoryRepository)
    private packageCategoryRepository: IPackageCategoryRepository,
    @inject(Types.DestinationRepository)
    private destinationRepository: IDestinationRepository,
  ) {}
  async operatorRegisterService(data: Partial<IOperator>) {
    const existing = await this.operatorRepository.findByEmail(
      data.email as string,
    );
    if (existing) {
      throw new CustomError(RESPONSE_MESSAGES.AUTH.ERROR.EMAIL_EXISTS, StatusCode.BAD_REQUEST);
    }
    const hashedPassword = this.hashService.hash(data.password as string);
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    const otpExpire = Date.now() + 10 * 60 * 1000;
    const newOperator = await this.operatorRepository.create({
      ...data,
      password: hashedPassword,
      otp,
      otpExpire,
    });

    await this.mailService.sendEmail(
      data.email as string,
      "Verify your email",
      `Your otp is ${otp} .It expires in 10 minutes`,
    );

    return {
      operatorId: (newOperator._id as mongooseType.ObjectId).toString(),
      otpExpire: newOperator.otpExpire,
    };
  }

  async operatorVerifyOtpService(operatorId: string, otp: string) {
    const operator = await this.operatorRepository.findById(operatorId);
    if (!operator)
      throw new CustomError(RESPONSE_MESSAGES.USER.ERROR.NOT_FOUND, StatusCode.NOT_FOUND);
    if (operator.isEmailVerified)
      throw new CustomError(RESPONSE_MESSAGES.AUTH.ERROR.EMAIL_ALREADY_VERIFIED, StatusCode.BAD_REQUEST);
    if (otp !== operator.otp || operator.otpExpire! < Date.now()) {
      throw new CustomError(
        RESPONSE_MESSAGES.AUTH.ERROR.OTP_EXPIRED_OR_INVALID,
        StatusCode.BAD_REQUEST,
      );
    }
    operator.isEmailVerified = true;
    operator.otp = undefined;
    operator.otpExpire = undefined;
    await this.operatorRepository.save(operator);
  }

  async operatorResendOtpService(
    operatorId: string,
  ): Promise<{ otpExpire: number }> {
    const operator = await this.operatorRepository.findById(operatorId);
    if (!operator)
      throw new CustomError(RESPONSE_MESSAGES.OPERATOR.ERROR.NOT_FOUND, StatusCode.NOT_FOUND);
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    const otpExpire = Date.now() + 10 * 60 * 1000;
    operator.otp = otp;
    operator.otpExpire = otpExpire;
    await this.operatorRepository.save(operator);
    await this.mailService.sendEmail(
      operator.email,
      "Your new OTP",
      `your new otp is ${otp}`,
    );
    return { otpExpire };
  }

  async operatorLoginService(
    email: string,
    password: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    operatorData: IOperatorResponse;
  }> {
    const operator = await this.operatorRepository.findByEmail(email);
    if (!operator)
      throw new CustomError(RESPONSE_MESSAGES.OPERATOR.ERROR.NOT_FOUND, StatusCode.NOT_FOUND);
    const isMatch = this.hashService.compare(password, operator.password);
    if (!isMatch)
      throw new CustomError(RESPONSE_MESSAGES.AUTH.ERROR.INVALID_CREDENTIALS, StatusCode.UNAUTHORIZED);
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
    const accessToken = this.securityService.generateAccessToken({
      id: operator._id.toString(),
      role: operator.role,
    });
    const refreshToken = this.securityService.generateRefreshToken({
      id: operator._id.toString(),
      role: operator.role,
    });
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...operatorData } = operator.toObject();
    return { accessToken, refreshToken, operatorData };
  }

  async operatorForgotPasswordService(email: string) {
    const operator = await this.operatorRepository.findByEmail(email);
    if (!operator)
      throw new CustomError(RESPONSE_MESSAGES.OPERATOR.ERROR.NOT_FOUND, StatusCode.NOT_FOUND);
    const { resetToken, expireTime, hashedToken } =
      this.tokenService.getPasswordResetToken();
    operator.resetPasswordToken = hashedToken;
    operator.resetPasswordExpire = expireTime;
    await this.operatorRepository.save(operator);
    const resetUrl = `${process.env.FRONTEND_URL}/operator/reset-password/${resetToken}`;
    await this.mailService.sendEmail(
      operator.email,
      "Reset Password",
      `Click this link to reset your password: ${resetUrl}`,
    );

    return { message: RESPONSE_MESSAGES.AUTH.SUCCESS.RESET_LINK_SENT };
  }

  async operatorResetPasswordService(token: string, newPassword: string) {
    const hashedToken = this.resetTokenHasher.hash(token);
    const operator =
      await this.operatorRepository.findByResetToken(hashedToken);
    if (!operator)
      throw new CustomError(RESPONSE_MESSAGES.AUTH.ERROR.INVALID_TOKEN, StatusCode.BAD_REQUEST);
    operator.password = this.hashService.hash(newPassword);
    operator.resetPasswordToken = undefined;
    operator.resetPasswordExpire = undefined;
    await operator.save();
    return { message: RESPONSE_MESSAGES.AUTH.SUCCESS.PASSWORD_UPDATE };
  }

  async updateOperatorService(id: string, data: Partial<IOperator>) {
    if (data.password) {
      data.password = this.hashService.hash(data.password);
    }

    return await this.operatorRepository.updateById(id, data);
  }

  async updateOperatorProfileImageService(id: string, image: string) {
    return await this.operatorRepository.updateOperatorProfileImage(id, image);
  }

  operatorLogoutService(): { message: string } {
    return { message: RESPONSE_MESSAGES.AUTH.SUCCESS.OPERATOR_LOGOUT };
  }

  async createPackageService(data: Partial<Ipackage>): Promise<Ipackage> {
    const existingPackage = await this.packageRepository.getPackageByName(
      data.name as string,
    );
    if (existingPackage) {
      throw new CustomError(
        RESPONSE_MESSAGES.PACKAGE.ERROR.NAME_ALREADY_EXIST,
        StatusCode.BAD_REQUEST,
      );
    }

    return await this.packageRepository.create(data);
  }

  async getSinglePackageService(id: string): Promise<Ipackage | null> {
    return await this.packageRepository.getPackageById(id);
  }

  async updatePackageService(
    packageId: string,
    operatorId: string,
    data: Partial<Ipackage>,
  ): Promise<Ipackage | null> {
    const existingPackage = await this.packageRepository.getByIdAndOperator(
      packageId,
      operatorId,
    );
    if (!existingPackage) {
      throw new CustomError(
        RESPONSE_MESSAGES.PACKAGE.ERROR.NOTFOUND_OR_UNAUTHORIZED,
        StatusCode.NOT_FOUND,
      );
    }
    return await this.packageRepository.updateById(packageId, data);
  }

  async deletePackageService(
    packageId: string,
    operatorId: string,
  ): Promise<Ipackage | null> {
    return this.packageRepository.deleteByIdAndOperator(packageId, operatorId);
  }

  async getPaginatedPackagesService(
    filter: QueryFilter<Ipackage> = {},
    skip: number,
    limit: number,
  ): Promise<Ipackage[]> {
    return this.packageRepository.getFilteredPackages(filter, skip, limit);
  }

  getTotalPackagesCount() {
    return this.packageRepository.countDocuments();
  }

  async resetPasswordAuthenticatedService(
    operatorId: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    const operator = await this.operatorRepository.findById(operatorId);
    if (!operator)
      throw new CustomError(RESPONSE_MESSAGES.OPERATOR.ERROR.NOT_FOUND, StatusCode.NOT_FOUND);
    const isMatch = this.hashService.compare(oldPassword, operator.password);
    if (!isMatch)
      throw new CustomError(
        RESPONSE_MESSAGES.AUTH.ERROR.OLD_PASSWORD_INCORRECT,
        StatusCode.BAD_REQUEST,
      );
    if (confirmPassword !== newPassword)
      throw new CustomError(RESPONSE_MESSAGES.AUTH.ERROR.PASSWORD_MISMATCH, StatusCode.BAD_REQUEST);
    operator.password = this.hashService.hash(newPassword);
    await this.operatorRepository.save(operator);
    return { message: RESPONSE_MESSAGES.AUTH.SUCCESS.PASSWORD_UPDATE };
  }
  getAllCategories() {
    return this.packageCategoryRepository.findAll();
  }
  getAllDestinationsServise(): Promise<IDestination[]> {
    return this.destinationRepository.findAll();
  }
  getMyPackagesCountService(operatorId: string): Promise<number> {
    return this.packageRepository.countPackagesByOperatorId(operatorId);
  }

  async getPackageByIdAndOperatorService(
    packageId: string,
    operatorId: string,
  ) {
    const pkg = await this.packageRepository.getByIdAndOperator(
      packageId,
      operatorId,
    );
    if (!pkg) {
      throw new CustomError(
        RESPONSE_MESSAGES.PACKAGE.ERROR.NOTFOUND_OR_UNAUTHORIZED,
        StatusCode.NOT_FOUND,
      );
    }
    return pkg;
  }
}
