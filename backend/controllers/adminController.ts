import { NextFunction, Request, Response } from "express";

import { CustomError } from "../utils/customError";

import type { IAdminService } from "../interfaces/IAdminService";
import { logger } from "../utils/logger";
import { StatusCode } from "../constants/statusCodeConstants";
import { injectable, inject } from "inversify";
import { Types } from "../types/types";
import { IAdminController } from "../interfaces/IAdminController";
import type { IOperatorService } from "../interfaces/IOperatorService";
import { RESPONSE_MESSAGES } from "../constants/messages";
import type { IUserService } from "../interfaces/IUserService";

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject(Types.AdminService) private adminService: IAdminService,
    @inject(Types.OperatorService) private operatorService: IOperatorService,
    @inject(Types.UserService) private userService: IUserService,
  ) {}

  loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
      logger.info(`Admin login attempt`, {
        layer: "CONTROLLER",
        module: "ADMIN",
        action: "LOGIN",
        email: req.body.email,
      });
      const { accessToken, refreshToken, adminData } =
        await this.adminService.loginAdminService(email, password);
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: Number(process.env.MAX_AGE),
      });
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: Number(process.env.MAX_AGE),
      });
      res.status(StatusCode.OK).json(adminData);
    } catch (error) {
      next(error);
    }
  };

  logoutAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("access_token").clearCookie("refresh_token");
      res
        .status(StatusCode.OK)
        .json({ message: RESPONSE_MESSAGES.AUTH.SUCCESS.ADMIN_LOGOUT });
    } catch (error) {
      next(error);
    }
  };

  updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.id !== req.params.id) {
      return next(
        new CustomError(
          RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED,
          StatusCode.UNAUTHORIZED,
        ),
      );
    }

    try {
      const updatedAdmin = await this.adminService.updateAdminService(
        req.params.id as string,
        req.body,
      );
      if (!updatedAdmin)
        return next(
          new CustomError(
            RESPONSE_MESSAGES.ADMIN.ERROR.NOT_FOUND,
            StatusCode.NOT_FOUND,
          ),
        );
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = updatedAdmin.toObject();
      res.status(StatusCode.OK).json(rest);
    } catch (error) {
      next(error);
    }
  };

  updateAdminProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { image } = req.body;
      const admin = await this.adminService.updateProfieImageService(
        req.user!.id,
        image,
      );
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = admin!.toObject();
      res.status(StatusCode.OK).json(rest);
    } catch (error) {
      next(error);
    }
  };

  getOperatorVerificationRequests = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data =
        await this.adminService.getOperatorVerificationRequestsService();
      res.status(StatusCode.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  verifyOperator = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { isVerified } = req.body;
      const data = await this.adminService.verifyOperatorService(
        id as string,
        isVerified,
      );
      res.status(StatusCode.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  getPaginatedOperators = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      const skip = (page - 1) * limit;
      const [operators, totalCount] = await Promise.all([
        this.adminService.getPaginatedOperatorsService(skip, limit),
        this.adminService.getTotalOperatorsCount(),
      ]);
      res.status(StatusCode.OK).json({ operators, totalCount });
    } catch (error) {
      next(error);
    }
  };

  getSingleOperator = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const operator = await this.adminService.getSingleOperatorService(
        req.params.id as string,
      );

      res.status(StatusCode.OK).json(operator);
    } catch (error) {
      next(error);
    }
  };

  updateOperator = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await this.adminService.updateOperatorService(
        req.params.id as string,
        req.body,
      );

      res.status(StatusCode.OK).json(updated);
    } catch (error) {
      next(error);
    }
  };

  blockOperator = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blocked = await this.adminService.blockOperatorService(
        req.params.id as string,
        req.body.isBlocked,
      );
      res.status(StatusCode.OK).json({
        message: req.body.isBlocked
          ? RESPONSE_MESSAGES.OPERATOR.SUCCESS.BLOCKED
          : RESPONSE_MESSAGES.OPERATOR.SUCCESS.UNBLOCKED,
        operator: blocked,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteOperator = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.adminService.deleteOperatorService(req.params.id as string);
      res
        .status(StatusCode.OK)
        .json({ message: RESPONSE_MESSAGES.OPERATOR.SUCCESS.DELETED });
    } catch (error) {
      next(error);
    }
  };

  getPaginatedUsers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      const skip = (page - 1) * limit;
      const [users, totalCount] = await Promise.all([
        this.adminService.getPaginatedUsersService(skip, limit),
        this.adminService.getTotalUsersCount(),
      ]);
      res.status(StatusCode.OK).json({ users, totalCount });
    } catch (error) {
      next(error);
    }
  };

  getSingleUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.adminService.getSingleUserService(
        req.params.id as string,
      );

      res.status(StatusCode.OK).json(user);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await this.adminService.updateUserService(
        req.params.id as string,
        req.body,
      );

      res.status(StatusCode.OK).json(updated);
    } catch (error) {
      next(error);
    }
  };

  blockUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.warn(`Admin is blocking a user`, {
        layer: "CONTROLLER",
        module: "ADMIN",
        targetUserId: req.params.id,
        adminId: req.user?.id,
      });
      const blocked = await this.adminService.blockUserService(
        req.params.id as string,
        req.body.isBlocked,
      );
      res.status(StatusCode.OK).json({
        message: req.body.isBlocked
          ? RESPONSE_MESSAGES.USER.SUCCESS.BLOCKED
          : RESPONSE_MESSAGES.USER.SUCCESS.UNBLOCKED,
        user: blocked,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.adminService.deleteUserService(req.params.id as string);
      res
        .status(StatusCode.OK)
        .json({ message: RESPONSE_MESSAGES.USER.SUCCESS.DELETED });
    } catch (error) {
      next(error);
    }
  };

  createPackageCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const category = await this.adminService.createCategoryService(req.body);
      res.status(StatusCode.CREATED).json({
        message: RESPONSE_MESSAGES.CATEGORY.SUCCESS.CREATED,
        category,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllPackageCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const categories = await this.adminService.getAllCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  };

  createDestination = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const destination = await this.adminService.createDestinationService(
        req.body,
      );
      res.status(StatusCode.CREATED).json({
        message: RESPONSE_MESSAGES.DESTINATION.SUCCESS.CREATED,
        destination,
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
      const destinations = await this.adminService.getAllDestinationsService();
      res.json(destinations);
    } catch (error) {
      next(error);
    }
  };

  getDestinationById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const destination = await this.adminService.getDestinationByIdService(
        req.params.id as string,
      );
      res.json({ success: true, destination });
    } catch (error) {
      next(error);
    }
  };

  deleteDestination = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.adminService.deleteDestinationByIdService(
        req.params.id as string,
      );
      res.json({ success: true, message: "Destination deleted" });
    } catch (error) {
      next(error);
    }
  };

  getAllPackages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      const skip = (page - 1) * limit;
      const [packages, totalCount] = await Promise.all([
        this.adminService.getPaginatedPackagesService(skip, limit),
        this.adminService.getTotalPackagesCount(),
      ]);
      res.json({ packages, totalCount });
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
      const data = await this.adminService.resetPasswordAuthenticatedService(
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

  getTotalUsersCount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const usersCount = await this.adminService.getTotalUsersCount();
      res.status(StatusCode.OK).json({ success: true, usersCount });
    } catch (error) {
      next(error);
    }
  };
  getTotalOperatorsCount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const operatorsCount = await this.adminService.getTotalOperatorsCount();
      res.status(StatusCode.OK).json({ success: true, operatorsCount });
    } catch (error) {
      next(error);
    }
  };

  todaySignupCount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const todaySignupCount =
        await this.adminService.getSignupCountTodayService();
      res.status(StatusCode.OK).json({ success: true, todaySignupCount });
    } catch (error) {
      next(error);
    }
  };

  getPendingOperatorsCount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const count = await this.adminService.getPendingOperatorsCountService();
      res.status(StatusCode.OK).json({ success: true, count });
    } catch (error) {
      next(error);
    }
  };

  getPackageById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const packageId = req.params.id;

      const pkg = await this.adminService.getSinglePackageService(
        packageId as string,
      );

      res.status(StatusCode.OK).json(pkg);
    } catch (error) {
      next(error);
    }
  };

  updatePackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const packageId = req.params.id;
      const updatedPackage = await this.adminService.updatePackageService(
        packageId as string,

        req.body,
      );
      if (!updatedPackage) {
        return next(
          new CustomError(
            RESPONSE_MESSAGES.PACKAGE.ERROR.NOT_FOUND,
            StatusCode.NOT_FOUND,
          ),
        );
      }
      res.status(StatusCode.OK).json(updatedPackage);
    } catch (error) {
      next(error);
    }
  };

  deletePackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: packageId } = req.params;
      const deletePackage = await this.adminService.deletePackageService(
        packageId as string,
      );
      if (!deletePackage) {
        throw new CustomError(
          RESPONSE_MESSAGES.PACKAGE.ERROR.NOT_FOUND,
          StatusCode.NOT_FOUND,
        );
      }
      res.status(StatusCode.OK).json({
        success: true,
        message: RESPONSE_MESSAGES.PACKAGE.SUCCESS.DELETED,
      });
    } catch (error) {
      next(error);
    }
  };
  getPendingCancellations = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const requests = await this.adminService.getPendingCancelationRequests();
      res.status(StatusCode.OK).json(requests);
    } catch (error) {
      next(error);
    }
  };

  processCancellationRequests = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { bookingId } = req.params;
      const { approve, adminNotes } = req.body;
      const updatedBooking = await this.adminService.processAdminCancellation(
        bookingId as string,
        approve,
        adminNotes,
      );
      res.status(StatusCode.OK).json({
        success: true,
        message: approve
          ? RESPONSE_MESSAGES.BOOKING.SUCCESS.CANCEL_REQ_APPROVED_REFUND
          : RESPONSE_MESSAGES.BOOKING.SUCCESS.CANCEL_REQ_REJECTED,
        data: updatedBooking,
      });
    } catch (error) {
      next(error);
    }
  };
}
