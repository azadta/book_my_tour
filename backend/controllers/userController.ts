import { NextFunction, Request, Response } from "express";

import { CustomError } from "../utils/customError";

import type { IUserService } from "../interfaces/IUserService";
import { logger } from "../utils/logger";
import { StatusCode } from "../constants/statusCodeConstants";
import { injectable, inject } from "inversify";
import { Types } from "../types/types";
import { IUserController } from "../interfaces/IUserController";
import type { IAdminService } from "../interfaces/IAdminService";
import { RESPONSE_MESSAGES } from "../constants/messages";

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(Types.UserService) private userService: IUserService,
    @inject(Types.AdminService) private adminService: IAdminService,
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

  getAllPackageCategories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const categories = await this.userService.getAllCategories();
      res.json(categories);
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

  getPaginatedPackages = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      const skip = (page - 1) * limit;
      const [packages, totalCount] = await Promise.all([
        this.userService.getPaginatedPackagesService(skip, limit),
        this.userService.getTotalPackagesCount(),
      ]);

      res.json({ packages, totalCount });
    } catch (error) {
      next(error);
    }
  };

  getAllPackages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const packages = await this.userService.getAllPackagesService();
      res.json({ packages });
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
      const destinations = await this.adminService.getAllDestinationsService();
      res.json(destinations);
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
      const { packages, totalCount, uniqueCategoryCount } =
        await this.userService.getFilteredPackagesService(query);
      res.status(200).json({ packages, totalCount, uniqueCategoryCount });
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
      const categories = await this.userService.getActiveCategoryService();
      res.status(200).json({ categories });
    } catch (error) {
      next(error);
    }
  };

  getPackageById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const pkg = await this.userService.getPackageByIdService(id as string);
      res.status(200).json({ pkg });
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
      const destinations =
        await this.userService.getDestinationsByPackageCategoryService(
          category as string,
        );
      res.status(200).json(destinations);
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

      const packages = await this.userService.getPackagesByCategoryService(
        category as string,
      );
      res.status(200).json(packages);
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

      const wishlistGroups = await this.userService.getUserWishlists(userId);
      res.status(200).json({ success: true, wishlistGroups });
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
      const { title, description } = req.body;
      const wishlistGroup = await this.userService.createGroup(userId, {
        title,
        description,
      });
      res.status(201).json({ success: true, wishlistGroup });
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

      const { groupId, packageId } = req.body;
      const data = await this.userService.togglePackageInGroup(
        userId,
        groupId,
        packageId,
      );
      res.status(200).json({ success: true, data });
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
      const { text } = req.body;
      const data = await this.userService.addNoteToGroup(
        userId,
        groupId as string,
        text,
      );
      res.status(200).json({ success: true, data });
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
      const data = await this.userService.generateShareableLink(
        userId,
        groupId as string,
      );
      res.status(200).json({ success: true, data });
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
      const data = await this.userService.getSharedGroup(shareToken as string);
      res.status(200).json({ success: true, data });
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
      const { title, description } = req.body;
      const data = await this.userService.editGroup(userId, groupId as string, {
        title,
        description,
      });
      res.status(200).json({ success: true, data });
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

      await this.userService.deleteGroup(userId, groupId as string);
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
      const { text } = req.body;

      const data = await this.userService.editNote(
        userId,
        groupId as string,
        noteId as string,
        text,
      );
      res.status(200).json({ success: true, data });
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

      const data = await this.userService.deleteNote(
        userId,
        groupId as string,
        noteId as string,
      );
      res.status(200).json({ success: true, data });
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
      const data = await this.userService.getPackageReviewService(
        packageId as string,
        page,
        limit,
      );
      res.status(200).json(data);
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

      const userId = req.user?.id;
      const data = await this.userService.createPackageReviewService({
        packageId,
        userId,
        ...req.body,
      });
      res.status(StatusCode.CREATED).json(data);
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

      const data = await this.userService.updatePackageReviewService(
        userId!,
        reviewId as string,
        packageId as string,
        req.body,
      );
      res.status(200).json({
        success: true,
        message: RESPONSE_MESSAGES.REVIEW.SUCCESS.UPDATE,
        data,
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
      const data = await this.userService.deletePackageReviewService(
        userId!,
        reviewId as string,
        packageId as string,
      );
      res.status(200).json({
        success: true,
        message: RESPONSE_MESSAGES.REVIEW.SUCCESS.DELETE,
        data,
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
      const { packageId, addedActivityIds, removedActivityIds } = req.body;
      const userId = req.user?.id;
      const result = await this.userService.createBookingOrder(
        userId as string,
        { packageId, addedActivityIds, removedActivityIds },
      );

      res.status(StatusCode.OK).json({ success: true, data: result });
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
      const {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        packageId,
        orderId,
      } = req.body;
      const userId = req.user?.id;
      const result = await this.userService.verifyAndConfirmBooking({
        razorpayOrderId,
        packageId,
        razorpayPaymentId,
        razorpaySignature,
        userId: userId as string,
      });
      res
        .status(StatusCode.OK)
        .json({ success: true, message: result.message });
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
      const booking = await this.userService.findBookingByOrderId(
        orderId as string,
      );
      res.status(200).json(booking);
    } catch (error) {
      next(error);
    }
  };
  getUserBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const bookings = await this.userService.getUserBookings(userId as string);
      res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  };
}
