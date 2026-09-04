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
import type { IAdminOperatorService } from "../interfaces/IAdminOperatorService";
import type { IAdminUserService } from "../interfaces/IAdminUserService";
import type { IPackageCategoryService } from "../interfaces/IPackageCategoryService";
import type { IPackageDestinationService } from "../interfaces/IPackageDestinationService";
import type { IPackageService } from "../interfaces/IPackageService";
import type { IAdminDashboardService } from "../interfaces/IAdminDashboardService";
import type { IBookingService } from "../interfaces/IBookingService";
import { BookingResponseMapper } from "../dto-mapping/mapper/booking/BookingResponseMapper";
import { BookingRequestMapper } from "../dto-mapping/mapper/booking/BookingRequestMapper";
import { PackageResponseMapper } from "../dto-mapping/mapper/package/PackageResponseMapper";
import { PackageRequestMapper } from "../dto-mapping/mapper/package/PackageRequestMapper";
import { PackageDestinationResponseMapper } from "../dto-mapping/mapper/package-destination/PackageDestinationResponseMapper";
import { PackageDestinationRequestMapper } from "../dto-mapping/mapper/package-destination/PackageDestinationRequestMapper";
import { CategoryResponseMapper } from "../dto-mapping/mapper/package-category/PackageCategoryResponseMapper";
import { PackageCategoryRequestMapper } from "../dto-mapping/mapper/package-category/PackageCategoryRequestMapper";
import { AdminRequestMapper } from "../dto-mapping/mapper/admin/AdminRequestMapper";
import { AdminResponseMapper } from "../dto-mapping/mapper/admin/AdminResponseMapper";
import { OperatorResponseMapper } from "../dto-mapping/mapper/operator/OperatorResponseMapper";

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject(Types.AdminService) private adminService: IAdminService,
    @inject(Types.OperatorService) private operatorService: IOperatorService,
    @inject(Types.UserService) private userService: IUserService,
    @inject(Types.AdminOperatorService)
    private adminOperatorService: IAdminOperatorService,
    @inject(Types.AdminUserService) private adminUserService: IAdminUserService,
    @inject(Types.PackageCategoryService)
    private packageCategoryService: IPackageCategoryService,
    @inject(Types.PackageDestinationService)
    private packageDestinationService: IPackageDestinationService,
    @inject(Types.PackageService) private packageService: IPackageService,
    @inject(Types.AdminDashboardService)
    private adminDashboardService: IAdminDashboardService,
    @inject(Types.BookingService) private bookingService: IBookingService,
  ) {}

  loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const dto = AdminRequestMapper.toLoginRequestDTO(req.body);

    try {
      logger.info(`Admin login attempt`, {
        layer: "CONTROLLER",
        module: "ADMIN",
        action: "LOGIN",
        email: req.body.email,
      });
      const { accessToken, refreshToken, adminData } =
        await this.adminService.loginAdminService(dto);
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: Number(process.env.MAX_AGE),
      });
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: Number(process.env.MAX_AGE),
      });
      res
        .status(StatusCode.OK)
        .json(AdminResponseMapper.toAdminResponseDTO(adminData));
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
      const dto = AdminRequestMapper.toUpdateAdminRequestDTO(req.body);
      const updatedAdmin = await this.adminService.updateAdminService(
        req.params.id as string,
        dto,
      );
      if (!updatedAdmin)
        return next(
          new CustomError(
            RESPONSE_MESSAGES.ADMIN.ERROR.NOT_FOUND,
            StatusCode.NOT_FOUND,
          ),
        );
      //eslint-disable-next-line @typescript-eslint/no-unused-vars

      res
        .status(StatusCode.OK)
        .json(AdminResponseMapper.toAdminResponseDTO(updatedAdmin));
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
      const dto = AdminRequestMapper.toUpdateProfileImageRequestDTO(req.body);

      const admin = await this.adminService.updateProfieImageService(
        req.user!.id,
        dto,
      );
      //eslint-disable-next-line @typescript-eslint/no-unused-vars

      res
        .status(StatusCode.OK)
        .json(AdminResponseMapper.toAdminResponseDTO(admin));
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
      const dto = AdminRequestMapper.toResetPasswordAuthenticatedRequestDTO(
        req.body,
      );
      const data = await this.adminService.resetPasswordAuthenticatedService(
        req.user!.id,
        dto,
      );
      res.status(StatusCode.OK).json(data);
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
        await this.adminOperatorService.getOperatorVerificationRequestsService();
      res
        .status(StatusCode.OK)
        .json(AdminResponseMapper.toAdminOperatorListResponseDTO(data));
    } catch (error) {
      next(error);
    }
  };

  verifyOperator = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const dto = AdminRequestMapper.toVerifyOperatorPayload(req.body);

      const data = await this.adminOperatorService.verifyOperatorService(
        id as string,
        dto,
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
      const [rawOperators, totalCount] = await Promise.all([
        this.adminOperatorService.getPaginatedOperatorsService(skip, limit),
        this.operatorService.getTotalOperatorsCount(),
      ]);
      res
        .status(StatusCode.OK)
        .json({
          operators:
            AdminResponseMapper.toAdminOperatorListResponseDTO(rawOperators),
          totalCount,
        });
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
      const operator = await this.adminOperatorService.getSingleOperatorService(
        req.params.id as string,
      );

      res
        .status(StatusCode.OK)
        .json(AdminResponseMapper.toAdminOperatorResponseDTO(operator));
    } catch (error) {
      next(error);
    }
  };

  updateOperator = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = AdminRequestMapper.toAdminUpdateOperatorRequestDTO(req.body);
      const updated = await this.adminOperatorService.adminUpdateOperatorService(
        req.params.id as string,
        dto,
      );

      res
        .status(StatusCode.OK)
        .json(OperatorResponseMapper.toOperatorResponseDTO(updated));
    } catch (error) {
      next(error);
    }
  };

  blockOperator = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = AdminRequestMapper.toBlockOperatorPayload(req.body);
      const blocked = await this.adminOperatorService.blockOperatorService(
        req.params.id as string,
        dto,
      );
      res.status(StatusCode.OK).json({
        message: req.body.isBlocked
          ? RESPONSE_MESSAGES.OPERATOR.SUCCESS.BLOCKED
          : RESPONSE_MESSAGES.OPERATOR.SUCCESS.UNBLOCKED,
        operator: AdminResponseMapper.toAdminOperatorResponseDTO(blocked),
      });
    } catch (error) {
      next(error);
    }
  };

  deleteOperator = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.adminOperatorService.deleteOperatorService(
        req.params.id as string,
      );
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
        this.adminUserService.getPaginatedUsersService(skip, limit),
        this.userService.getTotalUsersCount(),
      ]);
      res.status(StatusCode.OK).json({ users, totalCount });
    } catch (error) {
      next(error);
    }
  };

  getSingleUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.adminUserService.getSingleUserService(
        req.params.id as string,
      );

      res.status(StatusCode.OK).json(user);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await this.adminUserService.updateUserService(
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
      const blocked = await this.adminUserService.blockUserService(
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
      await this.adminUserService.deleteUserService(req.params.id as string);
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
      const dto = PackageCategoryRequestMapper.toCreatePackageCategory(
        req.body,
      );
      const rawCategory =
        await this.packageCategoryService.createCategoryService(dto);
      res.status(StatusCode.CREATED).json({
        message: RESPONSE_MESSAGES.CATEGORY.SUCCESS.CREATED,
        category: CategoryResponseMapper.toCategoryResponseDTO(rawCategory),
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
      const categories = await this.packageCategoryService.getAllCategories();
      res.json(CategoryResponseMapper.toCategoryListResponseDTO(categories));
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
      const dto = PackageDestinationRequestMapper.toDestinationEntity(req.body);
      const rawDestination =
        await this.packageDestinationService.createDestinationService(dto);
      res.status(StatusCode.CREATED).json({
        message: RESPONSE_MESSAGES.DESTINATION.SUCCESS.CREATED,
        destination:
          PackageDestinationResponseMapper.toDestinationResponseDTO(
            rawDestination,
          ),
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
      const rawDestinations =
        await this.packageDestinationService.getAllDestinationsService();
      res.json(
        PackageDestinationResponseMapper.toDestinationListResponseDTO(
          rawDestinations,
        ),
      );
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
      const rawDestination =
        await this.packageDestinationService.getDestinationByIdService(
          req.params.id as string,
        );
      res.json({
        success: true,
        destination:
          PackageDestinationResponseMapper.toDestinationResponseDTO(
            rawDestination,
          ),
      });
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
      await this.packageDestinationService.deleteDestinationByIdService(
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
        this.packageService.getPaginatedPackagesService(skip, limit),
        this.packageService.getTotalPackagesCount(),
      ]);
      res.json({ packages, totalCount });
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
      const usersCount = await this.userService.getTotalUsersCount();
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
      const operatorsCount =
        await this.operatorService.getTotalOperatorsCount();
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
        await this.adminDashboardService.getSignupCountTodayService();
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
      const count =
        await this.adminDashboardService.getPendingOperatorsCountService();
      res.status(StatusCode.OK).json({ success: true, count });
    } catch (error) {
      next(error);
    }
  };

  getPackageById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const packageId = req.params.id;

      const pkg = await this.packageService.getSinglePackageService(
        packageId as string,
      );

      res
        .status(StatusCode.OK)
        .json(PackageResponseMapper.toPackageResponseDTO(pkg));
    } catch (error) {
      next(error);
    }
  };

  deletePackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: packageId } = req.params;
      const deletePackage = await this.packageService.deletePackageService(
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
      const rawRequests =
        await this.bookingService.getPendingCancelationRequests();
      const requests =
        BookingResponseMapper.toPendingCancellationListDTO(rawRequests);
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
      const dto = BookingRequestMapper.toProcessAdminCancellationDTO(
        req.params,
        req.body,
      );

      const rawUpdatedBooking =
        await this.bookingService.processAdminCancellation(dto);
      const successMessage = dto.approve
        ? RESPONSE_MESSAGES.BOOKING.SUCCESS.CANCEL_REQ_APPROVED_REFUND
        : RESPONSE_MESSAGES.BOOKING.SUCCESS.CANCEL_REQ_REJECTED;
      const response =
        BookingResponseMapper.toProcessAdminCancellationResponseDTO(
          rawUpdatedBooking,
          dto.approve,
          successMessage,
        );

      res.status(StatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}
