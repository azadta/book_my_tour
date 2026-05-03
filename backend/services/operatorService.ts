import { Types } from "mongoose";
import { IOperatorRepository } from "../interfaces/IOperatorRepository.js";
import { IOperatorService } from "../interfaces/IOperatorService.js";
import { Ipackage } from "../models/Package.js";
import { CustomError } from "../utils/customError.js";

import { IHashService } from "../interfaces/IHashService.js";
import { IMailService } from "../interfaces/IMailService.js";
import { ISecurityService } from "../interfaces/ISecurityService.js";
import { ITokenService } from "../interfaces/ITokenService.js";
import { IDestination } from "../models/Destination.js";
import { IHashGenerator } from "../interfaces/IHashGenerator.js";
import { StatusCode } from "../constants/statusCodeConstants.js";

export class OperatorService implements IOperatorService {
  constructor(
    private operatorRepository: IOperatorRepository,
    private mailService: IMailService,
    private hashService: IHashService,
    private securityService: ISecurityService,
    private tokenService: ITokenService,
    private resetTokenHasher: IHashGenerator,
  ) {}
  async operatorRegisterService(data: any) {
    const existing = await this.operatorRepository.findByEmail(data.email);
    if (existing) {
      throw new CustomError("Email already exists", StatusCode.BAD_REQUEST);
    }
    const hashedPassword = this.hashService.hash(data.password);
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    const otpExpire = Date.now() + 10 * 60 * 1000;
    const newOperator = await this.operatorRepository.create({
      ...data,
      password: hashedPassword,
      otp,
      otpExpire,
    });

    await this.mailService.sendEmail(
      data.email,
      "Verify your email",
      `Your otp is ${otp} .It expires in 10 minutes`,
    );

    return {
      operatorId: (newOperator._id as Types.ObjectId).toString(),
      otpExpire: newOperator.otpExpire,
    };
  }

  async operatorVerifyOtpService(operatorId: string, otp: string) {
    const operator = await this.operatorRepository.findById(operatorId);
    if (!operator)
      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    if (operator.isEmailVerified)
      throw new CustomError("Already verified", StatusCode.BAD_REQUEST);
    if (otp !== operator.otp || operator.otpExpire! < Date.now()) {
      throw new CustomError(
        "Otp is expired or invalid",
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
      throw new CustomError("Operator not found", StatusCode.NOT_FOUND);
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

  async operatorLoginService(email: string, password: string) {
    const operator = await this.operatorRepository.findByEmail(email);
    if (!operator)
      throw new CustomError("Operator not found", StatusCode.NOT_FOUND);
    const isMatch = this.hashService.compare(password, operator.password);
    if (!isMatch)
      throw new CustomError("Invalid Credentials", StatusCode.UNAUTHORIZED);
    if (!operator.isVerified)
      throw new CustomError(
        "Operator not verified by the admin",
        StatusCode.UNAUTHORIZED,
      );
    if (operator.isBlocked)
      throw new CustomError(
        "Your account has been blocked, Please contact support",
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

    const { password: pass, ...operatorData } = operator.toObject();
    return { accessToken, refreshToken, operatorData };
  }

  async operatorForgotPasswordService(email: string) {
    const operator = await this.operatorRepository.findByEmail(email);
    if (!operator)
      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    const { resetToken, expireTime, hashedToken } =
      this.tokenService.getPasswordResetToken();
    operator.resetPasswordToken = hashedToken;
    operator.resetPasswordExpire = expireTime;
    await operator.save();
    const resetUrl = `${process.env.FRONTEND_URL}/operator/reset-password/${resetToken}`;
    await this.mailService.sendEmail(
      operator.email,
      "Reset Password",
      `Click this link to reset your password: ${resetUrl}`,
    );

    return { message: "Reset link sent to email " };
  }

  async operatorResetPasswordService(token: string, newPassword: string) {
    const hashedToken = this.resetTokenHasher.hash(token);
    const operator =
      await this.operatorRepository.findByResetToken(hashedToken);
    if (!operator)
      throw new CustomError("Token invalid or expired", StatusCode.BAD_REQUEST);
    operator.password = this.hashService.hash(newPassword);
    operator.resetPasswordToken = undefined;
    operator.resetPasswordExpire = undefined;
    await operator.save();
    return { message: "Password updated successfully" };
  }

  async updateOperatorService(id: string, data: any) {
    if (data.password) {
      data.password = this.hashService.hash(data.password);
    }

    return await this.operatorRepository.updateById(id, data);
  }

  async updateOperatorProfileImageService(id: string, image: string) {
    return await this.operatorRepository.updateOperatorProfileImage(id, image);
  }

  operatorLogoutService(): { message: string } {
    return { message: "Operator has been logged out" };
  }

  async createPackageService(data: Partial<Ipackage>): Promise<Ipackage> {
    const existingPackage = await this.operatorRepository.getPackageByName(
      data.name as string,
    );
    if (existingPackage) {
      throw new CustomError(
        "Package  name already exists",
        StatusCode.BAD_REQUEST,
      );
    }

    return await this.operatorRepository.createPackage(data);
  }

  async getSinglePackageService(id: string): Promise<Ipackage | null> {
    return await this.operatorRepository.getPackageById(id);
  }

  async updatePackageService(
    id: string,
    data: Partial<Ipackage>,
  ): Promise<Ipackage | null> {
    return await this.operatorRepository.updatePackage(id, data);
  }

  async deletePackageService(id: string): Promise<Ipackage | null> {
    return await this.operatorRepository.deletePackage(id);
  }

  async getPaginatedPackagesService(
    skip: number,
    limit: number,
  ): Promise<Ipackage[]> {
    return this.operatorRepository.findAllPackages(skip, limit);
  }

  getTotalPackagesCount() {
    return this.operatorRepository.countAllPackages();
  }

  async resetPasswordAuthenticatedService(
    operatorId: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    const operator = await this.operatorRepository.findById(operatorId);
    if (!operator)
      throw new CustomError("Operator not found", StatusCode.NOT_FOUND);
    const isMatch = this.hashService.compare(oldPassword, operator.password);
    if (!isMatch)
      throw new CustomError(
        "Old password is incorrect",
        StatusCode.BAD_REQUEST,
      );
    if (confirmPassword !== newPassword)
      throw new CustomError("Password do not match", StatusCode.BAD_REQUEST);
    operator.password = this.hashService.hash(newPassword);
    await this.operatorRepository.save(operator);
    return { message: "Password updated successfully" };
  }
  getAllCategories() {
    return this.operatorRepository.findAllPackageCategory();
  }
  getAllDestinationsServise(): Promise<IDestination[]> {
    return this.operatorRepository.findAllDestinations();
  }
  getMyPackagesCountService(operatorId: string): Promise<number> {
    return this.operatorRepository.countPackagesByOperatorId(operatorId);
  }
}
