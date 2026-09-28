import { Types as mongooseType } from "mongoose";

import { inject, injectable } from "inversify";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import type { IHashGenerator } from "../interfaces/IHashGenerator";
import type { IHashService } from "../interfaces/IHashService";
import type { IMailService } from "../interfaces/IMailService";
import type { ISecurityService } from "../interfaces/ISecurityService";
import type { ITokenService } from "../interfaces/ITokenService";
import { IUser, IUserResponse } from "../interfaces/IUser";
import type { IUserRepository } from "../interfaces/IUserRepository";
import type { IUserService } from "../interfaces/IUserService";
import { Types } from "../types/types";
import { CustomError } from "../utils/customError";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(Types.UserRepository) private _userRepository: IUserRepository,
    @inject(Types.MailService) private _mailService: IMailService,
    @inject(Types.BcryptHashService) private _hashService: IHashService,
    @inject(Types.SecurityService) private _securityService: ISecurityService,
    @inject(Types.TokenService) private _tokenService: ITokenService,
    @inject(Types.CryptoHashService) private _resetTokenHasher: IHashGenerator,
  ) {}

  async registerUser(userData: {
    name: string;
    email: string;
    password: string;
  }) {
    const existing = await this._userRepository.findByEmail(userData.email);
    if (existing)
      throw new CustomError(
        RESPONSE_MESSAGES.AUTH.ERROR.EMAIL_EXISTS,
        StatusCode.BAD_REQUEST,
      );
    const hashedPassword = this._hashService.hash(userData.password);
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    // const otpExpire = Date.now() + 10 * 60 * 1000;
    const otpExpire = Date.now() + 40 * 1000;
    const newUser = await this._userRepository.create({
      ...userData,
      password: hashedPassword,
      otp,
      otpExpire,
    });
    await this._mailService.sendEmail(
      newUser.email,
      "Verify your account",
      `Your otp is ${otp}`,
    );

    return {
      userId: (newUser._id as mongooseType.ObjectId).toString(),
      otpExpire: newUser.otpExpire,
    };
  }

  async verifyUserOtp({ userId, otp }: { userId: string; otp: string }) {
    const user = await this._userRepository.findById(userId);
    if (!user)
      throw new CustomError(
        RESPONSE_MESSAGES.USER.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    if (user.isEmailVerified)
      throw new CustomError(
        RESPONSE_MESSAGES.AUTH.ERROR.EMAIL_ALREADY_VERIFIED,
        StatusCode.BAD_REQUEST,
      );

    if (user.otp !== otp || !user.otpExpire || user.otpExpire < Date.now()) {
      throw new CustomError(
        RESPONSE_MESSAGES.AUTH.ERROR.OTP_EXPIRED_OR_INVALID,
        StatusCode.BAD_REQUEST,
      );
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await this._userRepository.save(user);
  }

  async resendUserOtp(userId: string): Promise<{ otpExpire: number }> {
    const user = await this._userRepository.findById(userId);
    if (!user)
      throw new CustomError(
        RESPONSE_MESSAGES.USER.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    const otpExpire = Date.now() + 10 * 60 * 1000;

    user.otp = otp;
    user.otpExpire = otpExpire;
    await this._userRepository.save(user);

    await this._mailService.sendEmail(
      user.email,
      "Your new OTP",
      `Your new OTP is ${otp}`,
    );

    return { otpExpire: user.otpExpire };
  }

  async loginUser(
    email: string,
    password: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    userData: IUserResponse;
  }> {
    const user = await this._userRepository.findByEmail(email);
    if (!user)
      throw new CustomError(
        RESPONSE_MESSAGES.AUTH.ERROR.INVALID_CREDENTIALS,
        StatusCode.UNAUTHORIZED,
      );
    const isPasswordValid = this._hashService.compare(password, user.password);
    if (!isPasswordValid)
      throw new CustomError(
        RESPONSE_MESSAGES.AUTH.ERROR.INVALID_CREDENTIALS,
        StatusCode.UNAUTHORIZED,
      );
    if (user.isBlocked)
      throw new CustomError(
        "Your account has been blocked ,Please contact support",
        StatusCode.FORBIDDEN,
      );
    const accessToken = this._securityService.generateAccessToken({
      id: user._id.toString(),
      role: user.role,
    });

    const refreshToken = this._securityService.generateRefreshToken({
      id: user._id.toString(),
      role: user.role,
    });
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...userData } = user.toObject();
    return { accessToken, refreshToken, userData };
  }

  async googleLogin(
    name: string,
    email: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: IUserResponse;
  }> {
    const user = await this._userRepository.findByEmail(email);

    if (user) {
      if (user.isBlocked) {
        throw new CustomError(
          RESPONSE_MESSAGES.AUTH.ERROR.ACCOUNT_BLOCKED,
          StatusCode.FORBIDDEN,
        );
      }
      const accessToken = this._securityService.generateAccessToken({
        id: user._id.toString(),
        role: user.role,
      });

      const refreshToken = this._securityService.generateRefreshToken({
        id: user._id.toString(),
        role: user.role,
      });
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user.toObject();
      return { accessToken, refreshToken, user: rest };
    }

    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashedPassword = this._hashService.hash(generatedPassword);
    const newUser = await this._userRepository.create({
      name,
      email,
      password: hashedPassword,
      isEmailVerified: true,
      isBlocked: false,
      role: "user",
    });

    const accessToken = this._securityService.generateAccessToken({
      id: newUser._id.toString(),
      role: newUser.role,
    });

    const refreshToken = this._securityService.generateRefreshToken({
      id: newUser._id.toString(),
      role: newUser.role,
    });
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = newUser.toObject();
    return { accessToken, refreshToken, user: rest };
  }

  async forgotPasswordService(email: string) {
    const user = await this._userRepository.findByEmail(email);
    if (!user)
      throw new CustomError(
        RESPONSE_MESSAGES.USER.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    if (user.isBlocked) {
      throw new CustomError(
        RESPONSE_MESSAGES.AUTH.ERROR.ACCOUNT_BLOCKED,
        StatusCode.FORBIDDEN,
      );
    }
    const { resetToken, hashedToken, expireTime } =
      this._tokenService.getPasswordResetToken();
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = expireTime;
    await this._userRepository.save(user);
    const resetUrl = `${process.env.FRONTEND_URL}/user/reset-password/${resetToken}`;
    await this._mailService.sendEmail(
      user.email,
      "Reset Password",
      `Click this link to reset your password: ${resetUrl}`,
    );

    return { message: RESPONSE_MESSAGES.AUTH.SUCCESS.RESET_LINK_SENT };
  }

  async resetPasswordService(token: string, newPassword: string) {
    const hashedToken = this._resetTokenHasher.hash(token);
    const user = await this._userRepository.findByResetToken(hashedToken);
    if (!user)
      throw new CustomError(
        RESPONSE_MESSAGES.AUTH.ERROR.INVALID_TOKEN,
        StatusCode.BAD_REQUEST,
      );
    user.password = this._hashService.hash(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await this._userRepository.save(user);
    return { message: RESPONSE_MESSAGES.AUTH.SUCCESS.PASSWORD_UPDATE };
  }

  async updateUserService(id: string, data: Partial<IUser>) {
    if (data.password) {
      data.password = this._hashService.hash(data.password);
    }

    return await this._userRepository.updateById(id, data);
  }

  async deleteUserService(id: string) {
    return await this._userRepository.deleteById(id);
  }

  async updateProfileImageService(id: string, image: string) {
    return await this._userRepository.updateProfileImage(id, image);
  }

  userLogoutService(): { message: string } {
    return { message: RESPONSE_MESSAGES.AUTH.SUCCESS.USER_LOGOUT };
  }

  async resetPasswordAuthenticatedService(
    userId: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    if (!userId || !oldPassword || !newPassword || !confirmPassword)
      throw new CustomError(
        RESPONSE_MESSAGES.VALIDATION.ERROR.ALL_FIELDS_REQUIRED,
        StatusCode.BAD_REQUEST,
      );
    const user = await this._userRepository.findById(userId);
    if (!user)
      throw new CustomError(
        RESPONSE_MESSAGES.USER.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    const isMatch = this._hashService.compare(oldPassword, user.password);
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
    user.password = this._hashService.hash(newPassword);
    await this._userRepository.save(user);
    return { message: RESPONSE_MESSAGES.AUTH.SUCCESS.PASSWORD_UPDATE };
  }
  getTotalUsersCount() {
    return this._userRepository.countDocuments();
  }

  async getPaginatedUsersService(skip: number, limit: number) {
    return this._userRepository.getPaginatedUsers(skip, limit);
  }

  async getUserDetailsService(id: string) {
    return this._userRepository.findById(id);
  }
  async blockUserService(id: string, isBlocked: boolean) {
    return this._userRepository.updateUserBlockStatus(id, isBlocked);
  }

  async AdminUpdateUserService(id: string, data: Partial<IUser>) {
    return await this._userRepository.updateById(id, data);
  }
}
