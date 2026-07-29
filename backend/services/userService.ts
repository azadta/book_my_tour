import { Types as mongooseType } from "mongoose";

import { inject, injectable } from "inversify";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import type { IDestinationRepository } from "../interfaces/IDestinationRepository";
import type { IHashGenerator } from "../interfaces/IHashGenerator";
import type { IHashService } from "../interfaces/IHashService";
import type { IMailService } from "../interfaces/IMailService";
import type { IPackageCategoryRepository } from "../interfaces/IPackageCategoryRepository";
import type { IPackageRepository } from "../interfaces/IPackageRepository";
import type { ISecurityService } from "../interfaces/ISecurityService";
import type { ITokenService } from "../interfaces/ITokenService";
import { IUser, IUserResponse } from "../interfaces/IUser";
import type { IUserRepository } from "../interfaces/IUserRepository";
import type { IUserService } from "../interfaces/IUserService";
import type { IWishlistRepository } from "../interfaces/IWishlistRepository";
import type { Ipackage } from "../models/Package";
import { Types } from "../types/types";
import { CustomError } from "../utils/customError";
import { ICreateWishlistDTO, IWishlistGroup } from "../interfaces/IWishList";
import { ROUTES } from "../constants/routesConstants";
import { randomBytes } from "node:crypto";
import type { IReviewRepository } from "../interfaces/IReviewRepository";

import { STATUS_CODES } from "node:http";
import { CreateReviewDto } from "../interfaces/IReview";

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
    @inject(Types.WishlistRepository)
    private wishlistRepository: IWishlistRepository,
    @inject(Types.ReviewRepository)
    private reviewRepository: IReviewRepository,
  ) {}

  async registerUser(userData: {
    name: string;
    email: string;
    password: string;
  }) {
    const existing = await this.userRepository.findByEmail(userData.email);
    if (existing)
      throw new CustomError(
        RESPONSE_MESSAGES.AUTH.ERROR.EMAIL_EXISTS,
        StatusCode.BAD_REQUEST,
      );
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
    await this.userRepository.save(user);
  }

  async resendUserOtp(userId: string): Promise<{ otpExpire: number }> {
    const user = await this.userRepository.findById(userId);
    if (!user)
      throw new CustomError(
        RESPONSE_MESSAGES.USER.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
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
        RESPONSE_MESSAGES.AUTH.ERROR.INVALID_CREDENTIALS,
        StatusCode.UNAUTHORIZED,
      );
    const isPasswordValid = this.hashService.compare(password, user.password);
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
          RESPONSE_MESSAGES.AUTH.ERROR.ACCOUNT_BLOCKED,
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

    return { message: RESPONSE_MESSAGES.AUTH.SUCCESS.RESET_LINK_SENT };
  }

  async resetPasswordService(token: string, newPassword: string) {
    const hashedToken = this.resetTokenHasher.hash(token);
    const user = await this.userRepository.findByResetToken(hashedToken);
    if (!user)
      throw new CustomError(
        RESPONSE_MESSAGES.AUTH.ERROR.INVALID_TOKEN,
        StatusCode.BAD_REQUEST,
      );
    user.password = this.hashService.hash(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await this.userRepository.save(user);
    return { message: RESPONSE_MESSAGES.AUTH.SUCCESS.PASSWORD_UPDATE };
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
    const user = await this.userRepository.findById(userId);
    if (!user)
      throw new CustomError(
        RESPONSE_MESSAGES.USER.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    const isMatch = this.hashService.compare(oldPassword, user.password);
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
    user.password = this.hashService.hash(newPassword);
    await this.userRepository.save(user);
    return { message: RESPONSE_MESSAGES.AUTH.SUCCESS.PASSWORD_UPDATE };
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
      new CustomError(RESPONSE_MESSAGES.PACKAGE.ERROR.NOT_FOUND, 404);
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

  async getUserWishlists(userId: string): Promise<IWishlistGroup[]> {
    return this.wishlistRepository.findByUserId(userId);
  }

  async createGroup(
    userId: string,
    dto: ICreateWishlistDTO,
  ): Promise<IWishlistGroup> {
    return this.wishlistRepository.createGroup(userId, dto);
  }

  async togglePackageInGroup(
    userId: string,
    groupId: string,
    packageId: string,
  ): Promise<IWishlistGroup> {
    const group = await this.wishlistRepository.findWishlistGroupById(groupId);
    if (!group) {
      throw new CustomError(
        RESPONSE_MESSAGES.WISHLIST.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    if (group.userId.toString() !== userId) {
      throw new CustomError(RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED);
    }

    const hasPackage = group.packages.some(
      (pkg: any) =>
        (pkg._id ? pkg._id.toString() : pkg.toString()) === packageId,
    );
    const updatedGroup = hasPackage
      ? await this.wishlistRepository.removePackageToGroup(groupId, packageId)
      : await this.wishlistRepository.addPackageToGroup(groupId, packageId);
    if (!updatedGroup) {
      throw new CustomError(RESPONSE_MESSAGES.WISHLIST.ERROR.UPDATE);
    }
    return updatedGroup;
  }

  async addNoteToGroup(
    userId: string,
    groupId: string,
    text: string,
  ): Promise<IWishlistGroup> {
    const group = await this.wishlistRepository.findWishlistGroupById(groupId);
    if (!group || group.userId.toString() !== userId) {
      new CustomError(
        RESPONSE_MESSAGES.WISHLIST.ERROR.UNAUTHORIZED_OR_NOT_FOUND,
        StatusCode.UNAUTHORIZED,
      );
    }

    const updatedGroup = await this.wishlistRepository.addNote(groupId, text);
    if (!updatedGroup) {
      throw new CustomError(RESPONSE_MESSAGES.WISHLIST.ERROR.ADD_NOTE);
    }
    return updatedGroup;
  }

  async generateShareableLink(
    userId: string,
    groupId: string,
  ): Promise<{ shareToken: string }> {
    const group = await this.wishlistRepository.findWishlistGroupById(groupId);
    if (!group || group.userId.toString() !== userId) {
      new CustomError(
        RESPONSE_MESSAGES.WISHLIST.ERROR.UNAUTHORIZED_OR_NOT_FOUND,
        StatusCode.UNAUTHORIZED,
      );
    }

    if (group?.shareToken) {
      return { shareToken: group.shareToken };
    }

    const token = randomBytes(12).toString("hex");
    await this.wishlistRepository.updateShareToken(groupId, token, true);
    return { shareToken: token };
  }

  async getSharedGroup(shareToken: string): Promise<IWishlistGroup> {
    const group = await this.wishlistRepository.findByShareToken(shareToken);
    if (!group) {
      throw new CustomError(
        RESPONSE_MESSAGES.WISHLIST.ERROR.LINK_EXPIRE_OR_NOT_FOUND,
      );
    }
    return group;
  }

  async editGroup(
    userId: string,
    groupId: string,
    dto: { title?: string; description?: string },
  ): Promise<IWishlistGroup> {
    const group = await this.wishlistRepository.findWishlistGroupById(groupId);
    if (!group || group.userId.toString() !== userId) {
      throw new CustomError(
        RESPONSE_MESSAGES.WISHLIST.ERROR.UNAUTHORIZED_OR_NOT_FOUND,
        StatusCode.UNAUTHORIZED,
      );
    }
    const updated = await this.wishlistRepository.updateById(groupId, dto);
    if (!updated) {
      throw new CustomError(RESPONSE_MESSAGES.WISHLIST.ERROR.UPDATE);
    }
    return updated;
  }

  async deleteGroup(
    userId: string,
    groupId: string,
  ): Promise<IWishlistGroup | null> {
    const group = await this.wishlistRepository.findWishlistGroupById(groupId);
    if (!group || group.userId.toString() !== userId) {
      throw new CustomError(
        RESPONSE_MESSAGES.WISHLIST.ERROR.UNAUTHORIZED_OR_NOT_FOUND,
        StatusCode.UNAUTHORIZED,
      );
    }

    return this.wishlistRepository.deleteById(groupId);
  }

  async deleteNote(userId: string, groupId: string, noteId: string) {
    const group = await this.wishlistRepository.findWishlistGroupById(groupId);
    if (!group || group.userId.toString() !== userId) {
      throw new CustomError(
        RESPONSE_MESSAGES.WISHLIST.ERROR.UNAUTHORIZED_OR_NOT_FOUND,
        StatusCode.UNAUTHORIZED,
      );
    }

    const updated = await this.wishlistRepository.deleteNote(groupId, noteId);
    if (!updated) {
      throw new CustomError(RESPONSE_MESSAGES.WISHLIST.ERROR.UPDATE);
    }
    return updated;
  }

  async editNote(
    userId: string,
    groupId: string,
    noteId: string,
    text: string,
  ): Promise<IWishlistGroup> {
    const group = await this.wishlistRepository.findWishlistGroupById(groupId);
    if (!group || group.userId.toString() !== userId) {
      throw new CustomError(
        RESPONSE_MESSAGES.WISHLIST.ERROR.UNAUTHORIZED_OR_NOT_FOUND,
        StatusCode.UNAUTHORIZED,
      );
    }

    const updated = await this.wishlistRepository.updateNote(
      groupId,
      noteId,
      text,
    );
    if (!updated) {
      throw new CustomError(RESPONSE_MESSAGES.WISHLIST.ERROR.UPDATE);
    }
    return updated;
  }

  async getPackageReviewService(packageId: string, page = 1, limit = 1) {
    const skip = (page - 1) * limit;
    const [reviews, stats] = await Promise.all([
      this.reviewRepository.getReviewsByPackageId(packageId, skip, limit),
      this.reviewRepository.getReviewStatsByPackageId(packageId),
    ]);

    return { reviews, stats };
  }

  async createPackageReviewService(reviewData: CreateReviewDto) {
    const existingReview = await this.reviewRepository.findUserReviewForPackage(
      reviewData.userId,
      reviewData.packageId,
    );
    if (existingReview) {
      throw new CustomError(
        RESPONSE_MESSAGES.REVIEW.ERROR.ALREADY_EXIST,
        StatusCode.BAD_REQUEST,
      );
    }

    return this.reviewRepository.createReview(reviewData);
  }

  async updatePackageReviewService(
    userId: string,
    reviewId: string,
    packageId: string,
    updatePayload: any,
  ) {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new CustomError(
        RESPONSE_MESSAGES.REVIEW.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    if (review.userId.toString() !== userId) {
      throw new CustomError(
        RESPONSE_MESSAGES.REVIEW.ERROR.FORBIDDEN,
        StatusCode.FORBIDDEN,
      );
    }
    const updatedReview = await this.reviewRepository.updateReview(
      reviewId,
      updatePayload,
    );
    const stats =
      await this.reviewRepository.getReviewStatsByPackageId(packageId);
    return { review: updatedReview, stats };
  }

  async deletePackageReviewService(
    userId: string,
    reviewId: string,
    packageId: string,
  ) {
  
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new CustomError(
        RESPONSE_MESSAGES.REVIEW.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }

    if (review.userId.toString() !== userId) {
      throw new CustomError(
        RESPONSE_MESSAGES.REVIEW.ERROR.FORBIDDEN,
        StatusCode.FORBIDDEN,
      );
    }

    await this.reviewRepository.deleteById(reviewId);
    const stats =
      await this.reviewRepository.getReviewStatsByPackageId(packageId);
    return { stats };
  }
}
