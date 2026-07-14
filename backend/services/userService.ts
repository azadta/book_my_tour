import { Types as mongooseType } from "mongoose";

import { inject, injectable } from "inversify";
import { StatusCode } from "../constants/statusCodeConstants";
import type { IHashGenerator } from "../interfaces/IHashGenerator";
import type { IHashService } from "../interfaces/IHashService";
import type { IMailService } from "../interfaces/IMailService";
import type { IPackageCategoryRepository } from "../interfaces/IPackageCategoryRepository";
import type { IPackageRepository } from "../interfaces/IPackageRepository";
import type { ISecurityService } from "../interfaces/ISecurityService";
import type { ITokenService } from "../interfaces/ITokenService";
import type { IUserRepository } from "../interfaces/IUserRepository";
import type { IUserService } from "../interfaces/IUserService";
import type { Ipackage } from "../models/Package";
import { Types } from "../types/types";
import { CustomError } from "../utils/customError";
import { IUser, IUserResponse } from "../interfaces/IUser";
import type { IDestinationRepository } from "../interfaces/IDestinationRepository";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(Types.UserRepository) private userRepository: IUserRepository,
    @inject(Types.PackageCategoryRepository)
    private packageCategoryRepository: IPackageCategoryRepository,
    @inject(Types.PackageRepository)
    private packageRepository: IPackageRepository,
    @inject(Types.DestinationRepository)
    private destinationRepository: IDestinationRepository,
    @inject(Types.MailService) private mailService: IMailService,
    @inject(Types.BcryptHashService) private hashService: IHashService,
    @inject(Types.SecurityService) private securityService: ISecurityService,
    @inject(Types.TokenService) private tokenService: ITokenService,
    @inject(Types.CryptoHashService) private resetTokenHasher: IHashGenerator,
  ) {}

  async registerUser(userData: {
    name: string;
    email: string;
    password: string;
  }) {
    const existing = await this.userRepository.findByEmail(userData.email);
    if (existing)
      throw new CustomError("Email already exists", StatusCode.BAD_REQUEST);
    const hashedPassword = this.hashService.hash(userData.password);
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    // const otpExpire = Date.now() + 10 * 60 * 1000;
    const otpExpire = Date.now() + 40 * 1000;
    const newUser = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
      otp,
      otpExpire,
    });
    await this.mailService.sendEmail(
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
    const user = await this.userRepository.findById(userId);
    if (!user) throw new CustomError("User not found", StatusCode.NOT_FOUND);
    if (user.isEmailVerified)
      throw new CustomError("Already verified", StatusCode.BAD_REQUEST);

    if (user.otp !== otp || !user.otpExpire || user.otpExpire < Date.now()) {
      throw new CustomError("Invalid or expired OTP", StatusCode.BAD_REQUEST);
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await this.userRepository.save(user);
  }

  async resendUserOtp(userId: string): Promise<{ otpExpire: number }> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new CustomError("User not found", StatusCode.NOT_FOUND);
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    const otpExpire = Date.now() + 10 * 60 * 1000;

    user.otp = otp;
    user.otpExpire = otpExpire;
    await this.userRepository.save(user);

    await this.mailService.sendEmail(
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
    const user = await this.userRepository.findByEmail(email);
    if (!user)
      throw new CustomError(
        "Invalid email or password",
        StatusCode.UNAUTHORIZED,
      );
    const isPasswordValid = this.hashService.compare(password, user.password);
    if (!isPasswordValid)
      throw new CustomError(
        "Invalid email or password",
        StatusCode.UNAUTHORIZED,
      );
    if (user.isBlocked)
      throw new CustomError(
        "Your account has been blocked ,Please contact support",
        StatusCode.FORBIDDEN,
      );
    const accessToken = this.securityService.generateAccessToken({
      id: user._id.toString(),
      role: user.role,
    });

    const refreshToken = this.securityService.generateRefreshToken({
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
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      if (user.isBlocked) {
        throw new CustomError(
          "Your account has been blocked ,Please contact support",
          StatusCode.FORBIDDEN,
        );
      }
      const accessToken = this.securityService.generateAccessToken({
        id: user._id.toString(),
        role: user.role,
      });

      const refreshToken = this.securityService.generateRefreshToken({
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
    const hashedPassword = this.hashService.hash(generatedPassword);
    const newUser = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      isEmailVerified: true,
      isBlocked: false,
      role: "user",
    });

    const accessToken = this.securityService.generateAccessToken({
      id: newUser._id.toString(),
      role: newUser.role,
    });

    const refreshToken = this.securityService.generateRefreshToken({
      id: newUser._id.toString(),
      role: newUser.role,
    });
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = newUser.toObject();
    return { accessToken, refreshToken, user: rest };
  }

  async forgotPasswordService(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new CustomError("User not found", StatusCode.NOT_FOUND);
    if (user.isBlocked) {
      throw new CustomError(
        "User is blocked, please contact support",
        StatusCode.FORBIDDEN,
      );
    }
    const { resetToken, hashedToken, expireTime } =
      this.tokenService.getPasswordResetToken();
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = expireTime;
    await this.userRepository.save(user);
    const resetUrl = `${process.env.FRONTEND_URL}/user/reset-password/${resetToken}`;
    await this.mailService.sendEmail(
      user.email,
      "Reset Password",
      `Click this link to reset your password: ${resetUrl}`,
    );

    return { message: "Reset link sent to email " };
  }

  async resetPasswordService(token: string, newPassword: string) {
    const hashedToken = this.resetTokenHasher.hash(token);
    const user = await this.userRepository.findByResetToken(hashedToken);
    if (!user)
      throw new CustomError("Token invalid or expired", StatusCode.BAD_REQUEST);
    user.password = this.hashService.hash(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await this.userRepository.save(user);
    return { message: "Password updated successfully" };
  }

  async updateUserService(id: string, data: Partial<IUser>) {
    if (data.password) {
      data.password = this.hashService.hash(data.password);
    }

    return await this.userRepository.updateById(id, data);
  }

  async deleteUserService(id: string) {
    return await this.userRepository.deleteById(id);
  }

  async updateProfileImageService(id: string, image: string) {
    return await this.userRepository.updateProfileImage(id, image);
  }

  userLogoutService(): { message: string } {
    return { message: "User has been logged out" };
  }

  async resetPasswordAuthenticatedService(
    userId: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    if (!userId || !oldPassword || !newPassword || !confirmPassword)
      throw new CustomError("Please enter all fields", StatusCode.BAD_REQUEST);
    const user = await this.userRepository.findById(userId);
    if (!user) throw new CustomError("User not found", StatusCode.NOT_FOUND);
    const isMatch = this.hashService.compare(oldPassword, user.password);
    if (!isMatch)
      throw new CustomError(
        "Old password is incorrect",
        StatusCode.BAD_REQUEST,
      );
    if (confirmPassword !== newPassword)
      throw new CustomError("Password do not match", StatusCode.BAD_REQUEST);
    user.password = this.hashService.hash(newPassword);
    await this.userRepository.save(user);
    return { message: "Password updated successfully" };
  }

  getAllCategories() {
    return this.packageCategoryRepository.findAll();
  }

  async getPaginatedPackagesService(
    skip: number,
    limit: number,
  ): Promise<Ipackage[]> {
    return this.packageRepository.getFilteredPackages({}, skip, limit);
  }
  getTotalPackagesCount() {
    return this.packageRepository.countDocuments();
  }

  getAllPackagesService() {
    return this.packageRepository.findAllPackages();
  }

  async getFilteredPackagesService(query: any) {
    const {
      page = 1,
      limit = 6,
      category,
      destination,

      startDate,
      maxBudget,
      search,
      maxDuration,
    } = query;

    const skip = page > 1 ? (Number(page) - 1) * Number(limit) : 0;
    const filter: any = {};
    if (category) {
      filter.category = category;
    }
    if (destination) {
      filter.destinations = destination;
    }

    if (startDate) {
      filter.startDate = { $gte: new Date(startDate) };
    }

    if (maxBudget) {
      filter.amount = { $lte: Number(maxBudget) };
    }
    if (search) {
      const destinationIds =
        await this.destinationRepository.findDestinationIdsByName(search);
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { destinations: { $in: destinationIds } },
      ];
    }

    if (maxDuration) {
      filter["duration.day"] = { $lte: Number(maxDuration) };
    }

    const [packages, totalCount, uniqueCategoryCount] = await Promise.all([
      this.packageRepository.getFilteredPackages(filter, skip, limit),
      this.packageRepository.getFilteredPackagesCount(filter),
      this.packageRepository.getUniqueCategoryCount(filter),
    ]);

    return { packages, totalCount, uniqueCategoryCount };
  }

  async getActiveCategoryService() {
    const categoryIds = await this.packageRepository.getUsedCategoryIds();

    return this.packageCategoryRepository.findCategoriesByIds(categoryIds);
  }

  async getPackageByIdService(id: string) {
    const pkg = await this.packageRepository.getPackageById(id);
    if (pkg) {
      new CustomError("Package not found", 404);
    }
    return pkg;
  }

  async getDestinationsByPackageCategoryService(categoryName: string) {
    const category =
      await this.packageCategoryRepository.findPackageCategoryByName(
        categoryName,
      );
    if (!category) return [];

    const packages = await this.packageRepository.findPackageByCategory(
      category._id.toString(),
    );
    const destinationMap = new Map();
    packages.forEach((pkg) => {
      pkg.destinations.forEach((destination: any) => {
        destinationMap.set(destination._id.toString(), destination);
      });
    });
    return [...destinationMap.values()];
  }

  async getPackagesByCategoryService(categoryName: string) {
    const category =
      await this.packageCategoryRepository.findPackageCategoryByName(
        categoryName,
      );
    if (!category) return [];

    return this.packageRepository.findPackageByCategory(
      category._id.toString(),
    );
  }
}
