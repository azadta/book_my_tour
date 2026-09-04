import { NextFunction, Request, Response } from "express";

import { CustomError } from "../utils/customError";

import { inject, injectable } from "inversify";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import type { IPackageCategoryService } from "../interfaces/IPackageCategoryService";
import type { IPackageDestinationService } from "../interfaces/IPackageDestinationService";
import type { IPackageService } from "../interfaces/IPackageService";
import { IUserController } from "../interfaces/IUserController";
import type { IUserService } from "../interfaces/IUserService";
import type { IWalletService } from "../interfaces/IWalletService";
import { Types } from "../types/types";
import { logger } from "../utils/logger";

import { BookingRequestMapper } from "../dto-mapping/mapper/booking/BookingRequestMapper";
import { BookingResponseMapper } from "../dto-mapping/mapper/booking/BookingResponseMapper";
import { CategoryResponseMapper } from "../dto-mapping/mapper/package-category/PackageCategoryResponseMapper";
import { PackageDestinationResponseMapper } from "../dto-mapping/mapper/package-destination/PackageDestinationResponseMapper";
import { ReviewRequestMapper } from "../dto-mapping/mapper/package-review/ReviewRequestMapper";
import { ReviewResponseMapper } from "../dto-mapping/mapper/package-review/ReviewResponseMapper";
import { PackageResponseMapper } from "../dto-mapping/mapper/package/PackageResponseMapper";
import { WalletRequestMapper } from "../dto-mapping/mapper/wallet/WalletRequestMapper";
import { WalletResponseMapper } from "../dto-mapping/mapper/wallet/WalletResponseMapper";
import { WishlistRequestMapper } from "../dto-mapping/mapper/wishlist/WishlistRequestMapper";
import { WishlistResponseMapper } from "../dto-mapping/mapper/wishlist/WishlistResponseMapper";
import type { IBookingService } from "../interfaces/IBookingService";
import type { ICouponService } from "../interfaces/ICouponService";
import type { IPackageReviewService } from "../interfaces/IPackageReviewService";
import type { IWishlistService } from "../interfaces/IWishlistService";
import { CouponRequestMapper } from "../dto-mapping/mapper/coupon/CouponRequestMapper";
import { CouponResponseMapper } from "../dto-mapping/mapper/coupon/CouponResponseMapper";

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(Types.UserService) private userService: IUserService,

    @inject(Types.PackageCategoryService)
    private packageCategoryService: IPackageCategoryService,
    @inject(Types.PackageDestinationService)
    private packageDestinationService: IPackageDestinationService,
    @inject(Types.PackageService) private packageService: IPackageService,

    @inject(Types.BookingService) private bookingService: IBookingService,
    @inject(Types.WalletService) private walletService: IWalletService,
    @inject(Types.WishlistService) private wishlistService: IWishlistService,
    @inject(Types.PackageReviewService)
    private packageReviewService: IPackageReviewService,
    @inject(Types.CouponService) private couponService: ICouponService,
  ) {}
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info(`Attempting registration for email ${req.body.email}`, {
        layer: "CONTROLLER",
        module: "USER",
        action: "REGISTER",
      });
      const result = await this.userService.registerUser(req.body);
      res.status(StatusCode.CREATED).json({
        success: true,
        message: RESPONSE_MESSAGES.AUTH.SUCCESS.OTP_SENT_EMAIL,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, otp } = req.body;
      await this.userService.verifyUserOtp({ userId, otp });
      res.status(StatusCode.OK).json({
        success: true,
        message: RESPONSE_MESSAGES.AUTH.SUCCESS.OTP_VERIFIED,
      });
    } catch (error) {
      next(error);
    }
  };

  resendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.body;
      const data = await this.userService.resendUserOtp(userId);
      res.status(StatusCode.OK).json({
        success: true,
        message: RESPONSE_MESSAGES.AUTH.SUCCESS.OTP_RESENT_EMAIL,
        ...data,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      logger.info(`User login attempt`, {
        layer: "CONTROLLER",
        module: "USER",
        action: "LOGIN",
        email: req.body.email,
      });

      const { accessToken, refreshToken, userData } =
        await this.userService.loginUser(email, password);
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: Number(process.env.MAX_AGE),
      });
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: Number(process.env.MAX_AGE),
      });
      res.status(StatusCode.OK).json(userData);
    } catch (error) {
      next(error);
    }
  };

  google = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email } = req.body;
    try {
      const { accessToken, refreshToken, user } =
        await this.userService.googleLogin(name, email);
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: Number(process.env.MAX_AGE),
      });
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: Number(process.env.MAX_AGE),
      });
      res.status(StatusCode.OK).json(user);
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.userService.forgotPasswordService(req.body.email);
      res.status(StatusCode.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.userService.resetPasswordService(
        req.params.token as string,
        req.body.newPassword,
      );
      res.status(StatusCode.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("access_token").clearCookie("refresh_token");
      const result = this.userService.userLogoutService();
      res.status(StatusCode.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(
        new CustomError(RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED, 401),
      );
    }

    if (req.user.id !== req.params.id) {
      return next(
        new CustomError(RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED, 401),
      );
    }
    try {
      const updatedUser = await this.userService.updateUserService(
        req.params.id as string,
        req.body,
      );
      if (!updatedUser) {
        return next(
          new CustomError(RESPONSE_MESSAGES.USER.ERROR.NOT_FOUND, 404),
        );
      }
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = updatedUser.toObject();
      res.status(StatusCode.OK).json(rest);
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.id !== req.params.id) {
      return next(
        new CustomError(RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED, 401),
      );
    }
    try {
      await this.userService.deleteUserService(req.params.id as string);
      res.clearCookie("access_token");
      res
        .status(StatusCode.OK)
        .json({ message: RESPONSE_MESSAGES.USER.SUCCESS.DELETED });
    } catch (error) {
      next(error);
    }
  };

  updateProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { image } = req.body;
      const user = await this.userService.updateProfileImageService(
        req.user!.id,
        image,
      );
      res.status(StatusCode.OK).json(user);
    } catch (error) {
      next(error);
    }
  };
  resetPasswordAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.userService.resetPasswordAuthenticatedService(
        req.user!.id,
        req.body.oldPassword,
        req.body.newPassword,
        req.body.confirmPassword,
      );
      res.status(StatusCode.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  getAllPackageCategories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const categories = await this.packageCategoryService.getAllCategories();
      res.json(CategoryResponseMapper.toCategoryListResponseDTO(categories));
    } catch (error) {
      next(error);
    }
  };

  getPaginatedPackages = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      const skip = (page - 1) * limit;
      const [rawPackages, totalCount] = await Promise.all([
        this.packageService.getPaginatedPackagesService(skip, limit),
        this.packageService.getTotalPackagesCount(),
      ]);

      res.json({
        packages: PackageResponseMapper.toPackageListResponseDTO(rawPackages),
        totalCount,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllPackages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rawPackages = await this.packageService.getAllPackagesService();
      res.json({
        packages: PackageResponseMapper.toPackageListResponseDTO(rawPackages),
      });
    } catch (error) {
      next(error);
    }
  };

  getAllDestinations = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const destinations =
        await this.packageDestinationService.getAllDestinationsService();
      res.json(
        PackageDestinationResponseMapper.toDestinationListResponseDTO(
          destinations,
        ),
      );
    } catch (error) {
      next(error);
    }
  };

  getFilteredPackages = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const query = req.query;
      const {
        packages: rawPackages,
        totalCount,
        uniqueCategoryCount,
      } = await this.packageService.getFilteredPackagesService(query);
      res.status(200).json({
        packages: PackageResponseMapper.toPackageListResponseDTO(rawPackages),
        totalCount,
        uniqueCategoryCount,
      });
    } catch (error) {
      next(error);
    }
  };

  getActiveCategories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const rawCategories =
        await this.packageCategoryService.getActiveCategoryService();
      res.status(200).json({
        categories:
          CategoryResponseMapper.toCategoryListResponseDTO(rawCategories),
      });
    } catch (error) {
      next(error);
    }
  };

  getPackageById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const rawPackage = await this.packageService.getPackageByIdService(
        id as string,
      );
      res
        .status(200)
        .json({ pkg: PackageResponseMapper.toPackageResponseDTO(rawPackage) });
    } catch (error) {
      next(error);
    }
  };

  getDestinationsByPackageCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { category } = req.params;
      const rawDestinations =
        await this.packageDestinationService.getDestinationsByPackageCategoryService(
          category as string,
        );
      res
        .status(200)
        .json(
          PackageDestinationResponseMapper.toDestinationListResponseDTO(
            rawDestinations,
          ),
        );
    } catch (error) {
      next(error);
    }
  };

  getPackagesByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { category } = req.params;

      const packages = await this.packageService.getPackagesByCategoryService(
        category as string,
      );
      res
        .status(200)
        .json(PackageResponseMapper.toPackageListResponseDTO(packages));
    } catch (error) {
      next(error);
    }
  };

  getWishlists = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED,
        });
        return;
      }

      const wishlistGroups =
        await this.wishlistService.getUserWishlists(userId);
      res.status(200).json({
        success: true,
        wishlistGroups:
          WishlistResponseMapper.toGroupResponseListDTO(wishlistGroups),
      });
    } catch (error: any) {
      next(error);
    }
  };

  createWhishlistGroup = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED,
        });
        return;
      }
      const dto = WishlistRequestMapper.toCreateGroupReqDTO(req.body);

      const wishlistGroup = await this.wishlistService.createWishlistGroup(
        userId,
        dto,
      );
      res.status(201).json({
        success: true,
        wishlistGroup: WishlistResponseMapper.toGroupResponseDTO(wishlistGroup),
      });
    } catch (error: any) {
      next(error);
    }
  };

  toggleWhishlistPackage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED,
        });
        return;
      }

      const dto = WishlistRequestMapper.toTogglePackageReqDTO(req.body);
      const updatedGroup =
        await this.wishlistService.togglePackageInWishlistGroup(userId, dto);
      res.status(200).json({
        success: true,
        data: WishlistResponseMapper.toGroupResponseDTO(updatedGroup),
      });
    } catch (error) {
      next(error);
    }
  };

  addWishlistNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED,
        });
        return;
      }

      const { groupId } = req.params;
      const dto = WishlistRequestMapper.toAddNoteReqDTO(req.body);
      const updatedGroup = await this.wishlistService.addNoteToWishlistGroup(
        userId,
        groupId as string,
        dto,
      );
      res.status(200).json({
        success: true,
        data: WishlistResponseMapper.toGroupResponseDTO(updatedGroup),
      });
    } catch (error) {
      next(error);
    }
  };

  getWishlistShareLink = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED,
        });
        return;
      }

      const { groupId } = req.params;
      const shareData = await this.wishlistService.generateShareableLink(
        userId,
        groupId as string,
      );
      res.status(200).json({
        success: true,
        data: WishlistResponseMapper.toShareLinkDTO(shareData),
      });
    } catch (error) {
      next(error);
    }
  };

  getSharedWishlist = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { shareToken } = req.params;
      const sharedGroup = await this.wishlistService.getSharedGroup(
        shareToken as string,
      );
      res.status(200).json({
        success: true,
        data: WishlistResponseMapper.toGroupResponseDTO(sharedGroup),
      });
    } catch (error) {
      next(error);
    }
  };

  editWishlistGroup = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED,
        });
        return;
      }
      const { groupId } = req.params;
      const dto = WishlistRequestMapper.toEditGroupReqDTO(req.body);
      const updatedGroup = await this.wishlistService.editGroup(
        userId,
        groupId as string,
        dto,
      );
      res.status(200).json({
        success: true,
        data: WishlistResponseMapper.toGroupResponseDTO(updatedGroup),
      });
    } catch (error) {
      next(error);
    }
  };

  deleteWishlistGroup = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED,
        });
        return;
      }
      const { groupId } = req.params;

      await this.wishlistService.deleteGroup(userId, groupId as string);
      res.status(200).json({
        success: true,
        message: RESPONSE_MESSAGES.WISHLIST.SUCCESS.DELETE,
      });
    } catch (error) {
      next(error);
    }
  };

  editWishlistNote = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED,
        });
        return;
      }
      const { groupId, noteId } = req.params;
      const dto = WishlistRequestMapper.toEditNoteReqDTO(req.body);

      const updatedGroup = await this.wishlistService.editNote(
        userId,
        groupId as string,
        noteId as string,
        dto,
      );
      res.status(200).json({
        success: true,
        data: WishlistResponseMapper.toGroupResponseDTO(updatedGroup),
      });
    } catch (error) {
      next(error);
    }
  };
  deleteWishlistNote = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED,
        });
        return;
      }
      const { groupId, noteId } = req.params;

      const updatedGroup = await this.wishlistService.deleteNote(
        userId,
        groupId as string,
        noteId as string,
      );
      res.status(200).json({
        success: true,
        data: WishlistResponseMapper.toGroupResponseDTO(updatedGroup),
      });
    } catch (error) {
      next(error);
    }
  };

  getPackageReviews = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { packageId } = req.params;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      const data = await this.packageReviewService.getPackageReviewService(
        packageId as string,
        page,
        limit,
      );
      res
        .status(200)
        .json(
          ReviewResponseMapper.toPackageReviewsResponseDTO(
            data.reviews,
            data.stats,
          ),
        );
    } catch (error) {
      next(error);
    }
  };

  createPackageReview = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { packageId } = req.params;

      const userId = req.user?.id as string;
      const payload = ReviewRequestMapper.toCreateReviewReqDTO(
        req.body,
        packageId as string,
        userId,
      );
      const data =
        await this.packageReviewService.createPackageReviewService(payload);

      res
        .status(StatusCode.CREATED)
        .json(ReviewResponseMapper.toReviewResponseDTO(data));
    } catch (error) {
      next(error);
    }
  };

  updatePackageReview = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { reviewId, packageId } = req.params;

      const userId = req.user?.id;
      if (!userId || userId === "") {
        return next(
          new CustomError(RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED, 401),
        );
      }

      const dto = ReviewRequestMapper.toUpdateReviewReqDTO(req.body);

      const updatedData =
        await this.packageReviewService.updatePackageReviewService(
          userId!,
          reviewId as string,
          packageId as string,
          dto,
        );
      res.status(200).json({
        success: true,
        message: RESPONSE_MESSAGES.REVIEW.SUCCESS.UPDATE,
        data: ReviewResponseMapper.toUpdateReviewResponseDTO(
          updatedData.review,
          updatedData.stats,
        ),
      });
    } catch (error) {
      next(error);
    }
  };

  deletePackageReview = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { reviewId, packageId } = req.params;
      const userId = req.user?.id;
      const result = await this.packageReviewService.deletePackageReviewService(
        userId!,
        reviewId as string,
        packageId as string,
      );
      res.status(200).json({
        success: true,
        message: RESPONSE_MESSAGES.REVIEW.SUCCESS.DELETE,
        data: ReviewResponseMapper.toReviewStatsDTO(result.stats),
      });
    } catch (error) {
      next(error);
    }
  };

  createBookingOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id as string;
      const dto = BookingRequestMapper.toCreateBookingDTO(userId, req.body);

      const result = await this.bookingService.createBookingOrder(dto);

      const response =
        BookingResponseMapper.toCreateBookingOrderResposeDTO(result);

      res.status(StatusCode.OK).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  };
  verifyBookingPayment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id as string;
      const dto = BookingRequestMapper.toVerifyPaymentDTO(userId, req.body);

      const result = await this.bookingService.verifyAndConfirmBooking(dto);
      const response =
        BookingResponseMapper.toVerifyPayementResponseDTO(result);
      res
        .status(StatusCode.OK)
        .json({ success: true, message: response.message });
    } catch (error) {
      next(error);
    }
  };

  findBookingByOrderId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { orderId } = req.params;
      const rawBooking = await this.bookingService.findBookingByOrderId(
        orderId as string,
      );

      const booking = BookingResponseMapper.toBookingDTO(rawBooking);

      res.status(200).json(booking);
    } catch (error) {
      next(error);
    }
  };
  getUserBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const rawBookings = await this.bookingService.getUserBookings(
        userId as string,
      );
      const bookings = BookingResponseMapper.toBookingListDTO(rawBookings);
      res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  };
  cancelBooking = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id as string;
      const { bookingId } = req.params;
      const dto = BookingRequestMapper.toCancelBookingDTO(
        userId,
        bookingId,
        req.body,
      );

      const { reason } = req.body;
      const result = await this.bookingService.cancelBooking(dto);
      const response = BookingResponseMapper.toCancelBookingResponseDTO(result);
      res.status(StatusCode.OK).json({
        success: true,
        message: result.message,
        data: {
          requiresAdminApproval: response.requiresAdminApproval,
          refundAmount: response.refundAmount,
          booking: response.booking,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getCoupons = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.couponService.getAllAvailableCoupons();
      res.status(StatusCode.OK).json(CouponResponseMapper.toAvailableCouponsDTO(data));
    } catch (error) {
      next(error);
    }
  };
  validateCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto=CouponRequestMapper.toValidateCouponDTO(req.body)
      const { code, bookingAmount, cardBin } = req.body;
      if (!code || !bookingAmount) {
        return res
          .status(StatusCode.BAD_REQUEST)
          .json(RESPONSE_MESSAGES.COUPON.ERROR.CODE_AND_BOOKING_AMOUNT_MISSING);
      }
      const result =
        await this.couponService.validateAndCalculateCouponDiscount(
         dto
        );
      res.status(StatusCode.OK).json(CouponResponseMapper.toValidateCouponResponseDTO(result));
    } catch (error) {
      next(error);
    }
  };
  getWallet = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id as string;
      const wallet = await this.walletService.getWallet(userId);
      res
        .status(StatusCode.OK)
        .json(WalletResponseMapper.toWalletResponseDTO(wallet));
    } catch (error) {
      next(error);
    }
  };
  createWalletTopupOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id as string;
      const dto = WalletRequestMapper.toCreateTopupOrderReqDTO(req.body);

      const result = await this.walletService.createTopupOrder(userId, dto);
      res
        .status(StatusCode.OK)
        .json(WalletResponseMapper.toTopupOrderResponseDTO(result));
    } catch (error) {
      next(error);
    }
  };
  verifyWalletTopupPayment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id as string;
      const dto = WalletRequestMapper.toVerifyTopupPaymentReqDTO(req.body);

      const wallet = await this.walletService.verifyTopupPayment(userId, dto);
      res
        .status(StatusCode.OK)
        .json(WalletResponseMapper.toWalletResponseDTO(wallet));
    } catch (error) {
      next(error);
    }
  };
}
