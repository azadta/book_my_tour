import { NextFunction, Request, Response } from "express";

import { inject, injectable } from "inversify";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import type { IBookingService } from "../interfaces/IBookingService";
import type { ICouponService } from "../interfaces/ICouponService";
import { IOperatorController } from "../interfaces/IOperatorController";
import type { IOperatorDashboardService } from "../interfaces/IOperatorDashboard";
import type { IOperatorService } from "../interfaces/IOperatorService";
import type { IPackageCategoryService } from "../interfaces/IPackageCategoryService";
import type { IPackageDestinationService } from "../interfaces/IPackageDestinationService";
import type { IPackageService } from "../interfaces/IPackageService";
import { Types } from "../types/types";
import { CustomError } from "../utils/customError";
import { logger } from "../utils/logger";
import { BookingRequestMapper } from "../dto-mapping/mapper/booking/BookingRequestMapper";
import { BookingResponseMapper } from "../dto-mapping/mapper/booking/BookingResponseMapper";
import { PackageRequestMapper } from "../dto-mapping/mapper/package/PackageRequestMapper";
import { PackageResponseMapper } from "../dto-mapping/mapper/package/PackageResponseMapper";
import { PackageDestinationResponseMapper } from "../dto-mapping/mapper/package-destination/PackageDestinationResponseMapper";
import { CategoryResponseMapper } from "../dto-mapping/mapper/package-category/PackageCategoryResponseMapper";
import { CouponResponseMapper } from "../dto-mapping/mapper/coupon/CouponResponseMapper";
import { CouponRequestMapper } from "../dto-mapping/mapper/coupon/CouponRequestMapper";
import { OperatorRequestMapper } from "../dto-mapping/mapper/operator/OperatorRequestMapper";
import { OperatorResponseMapper } from "../dto-mapping/mapper/operator/OperatorResponseMapper";
@injectable()
export class OperatorController implements IOperatorController {
  constructor(
    @inject(Types.OperatorService) private operatorService: IOperatorService,

    @inject(Types.PackageCategoryService)
    private packageCategoryService: IPackageCategoryService,
    @inject(Types.PackageDestinationService)
    private packageDestinationService: IPackageDestinationService,
    @inject(Types.PackageService) private packageService: IPackageService,
    @inject(Types.OperatorDashboardService)
    private operatorDashboardService: IOperatorDashboardService,
    @inject(Types.BookingService) private bookingService: IBookingService,
    @inject(Types.CouponService) private couponService: ICouponService,
  ) {}

  operatorRegister = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      logger.info(`Attempting registration for email ${req.body.email}`, {
        layer: "CONTROLLER",
        module: "OPERATOR",
        action: "REGISTER",
      });
      const dto = OperatorRequestMapper.toOperatorRegisterRequestDTO(req.body);
      const result = await this.operatorService.operatorRegisterService(dto);
      res.status(StatusCode.CREATED).json({
        success: true,
        message: RESPONSE_MESSAGES.AUTH.SUCCESS.OTP_SENT_EMAIL,
        ...OperatorResponseMapper.toOperatorRegisterRespsonseDTO(result),
      });
    } catch (error) {
      next(error);
    }
  };

  operatorOtpverification = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const dto = OperatorRequestMapper.toVerityOperatorOtpDTO(req.body);
      await this.operatorService.operatorVerifyOtpService(dto);
      res.status(StatusCode.OK).json({
        success: true,
        message: RESPONSE_MESSAGES.AUTH.SUCCESS.OTP_VERIFIED,
      });
    } catch (error) {
      next(error);
    }
  };

  operatorResendOtp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { operatorId } = req.body;
    try {
      const { otpExpire } =
        await this.operatorService.operatorResendOtpService(operatorId);
      res.status(StatusCode.OK).json({
        succuss: true,
        message: RESPONSE_MESSAGES.AUTH.SUCCESS.OTP_SENT_EMAIL,
        otpExpire,
      });
    } catch (error) {
      next(error);
    }
  };

  loginOperator = async (req: Request, res: Response, next: NextFunction) => {
    const dto = OperatorRequestMapper.toOperatorLoginRequestDTO(req.body);

    try {
      logger.info(`Operator login attempt`, {
        layer: "CONTROLLER",
        module: "Operator",
        action: "LOGIN",
        email: req.body.email,
      });
      const { accessToken, refreshToken, operatorData } =
        await this.operatorService.operatorLoginService(dto);
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
        .json(OperatorResponseMapper.toOperatorResponseDTO(operatorData));
    } catch (error) {
      next(error);
    }
  };

  forgotOperatorPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.operatorService.operatorForgotPasswordService(
        req.body.email,
      );
      res.status(StatusCode.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  resetOperatorPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.operatorService.operatorResetPasswordService(
        req.params.token as string,
        req.body.newPassword,
      );
      res.status(StatusCode.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  operatorLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("access_token").clearCookie("refresh_token");
      const result = this.operatorService.operatorLogoutService();
      res.status(StatusCode.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateOperator = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(
        new CustomError(RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED, 401),
      );
    }

    if (req.user.id !== req.params.id) {
      return next(
        new CustomError("RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED", 401),
      );
    }
    try {
      const dto = OperatorRequestMapper.toUpdateOperatorProfileDTO(req.body);
      const updatedOperator = await this.operatorService.updateOperatorService(
        req.params.id as string,
        dto,
      );
      if (!updatedOperator) {
        return next(
          new CustomError(RESPONSE_MESSAGES.USER.ERROR.NOT_FOUND, 404),
        );
      }

      res
        .status(StatusCode.OK)
        .json(OperatorResponseMapper.toOperatorResponseDTO(updatedOperator));
    } catch (error) {
      next(error);
    }
  };

  updateOperatorProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { image } = req.body;
      const operator =
        await this.operatorService.updateOperatorProfileImageService(
          req.user!.id,
          image,
        );
      res
        .status(StatusCode.OK)
        .json(OperatorResponseMapper.toOperatorResponseDTO(operator));
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
      const dto =
        OperatorRequestMapper.toOperatorResetPasswordAuthenticatedRequestDTO(
          req.body,
        );
      const data = await this.operatorService.resetPasswordAuthenticatedService(
        req.user!.id,
        dto,
      );
      res.status(StatusCode.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  createPackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("operator creating a new package", {
        layer: "CONTROLLER",
        module: "OPERATOR",
        operatorId: req.user?.id,
        action: "CREATE_PACKAGE",
      });
      const operatorId = req?.user?.id;
      const dto = PackageRequestMapper.toCreatePackageEntity(
        req.body,
        operatorId as string,
      );

      const packageData = {
        ...req.body,
        operatorId,
      };
      const created =
        await this.packageService.createPackageService(packageData);
      res.status(StatusCode.CREATED).json({
        success: true,
        data: PackageResponseMapper.toPackageResponseDTO(created),
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
      res
        .status(StatusCode.OK)
        .json(
          PackageDestinationResponseMapper.toDestinationListResponseDTO(
            destinations,
          ),
        );
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
      res
        .status(StatusCode.OK)
        .json(CategoryResponseMapper.toCategoryListResponseDTO(categories));
    } catch (error) {
      next(error);
    }
  };

  getAllPackages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      const skip = (page - 1) * limit;
      const [rawPackages, totalCount] = await Promise.all([
        this.packageService.getFilteredPaginatedPackagesService(
          {},
          skip,
          limit,
        ),
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

  getMyPackagesCount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const operatorId = req.user?.id;
      const totalPakagesCount =
        await this.packageService.getOperatorPackagesCountService(
          operatorId as string,
        );
      res.status(StatusCode.OK).json({ success: true, totalPakagesCount });
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
      const operatorId = req.user!.id;
      const { limit, page } = req.query;

      const skip = (Number(page) - 1) * Number(limit);

      const totalCount =
        await this.packageService.getOperatorPackagesCountService(
          operatorId as string,
        );

      const packages =
        await this.packageService.getFilteredPaginatedPackagesService(
          { operatorId },
          skip,
          Number(limit),
        );
      res.status(StatusCode.OK).json({ success: true, totalCount, packages });
    } catch (error) {
      next(error);
    }
  };

  getPackageByIdAndOperator = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const packageId = req.params.id;
      const operatorId = req.user!.id;

      const pkg = await this.packageService.getPackageByIdAndOperatorService(
        packageId as string,
        operatorId,
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
      const operatorId = req.user?.id;
      if (!operatorId) {
        throw new CustomError(
          RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED,
          StatusCode.UNAUTHORIZED,
        );
      }
      const { id: packageId } = req.params;
      const deletePackage =
        await this.packageService.deleteOperatorPackageService(
          packageId as string,
          operatorId,
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

  updatePackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const packageId = req.params.id;
      const dto = PackageRequestMapper.toUpdatePackageEntity(req.body);
      const updatedPackage =
        await this.packageService.updateOperatorPackageService(
          packageId as string,
          req.user!.id,
          dto,
        );
      if (!updatedPackage) {
        return next(
          new CustomError(
            RESPONSE_MESSAGES.PACKAGE.ERROR.NOT_FOUND,
            StatusCode.NOT_FOUND,
          ),
        );
      }
      res
        .status(StatusCode.OK)
        .json(PackageResponseMapper.toPackageResponseDTO(updatedPackage));
    } catch (error) {
      next(error);
    }
  };

  getCoupons = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.couponService.getAllAvailableCoupons();
      res
        .status(StatusCode.OK)
        .json(CouponResponseMapper.toAvailableCouponsDTO(data));
    } catch (error) {
      next(error);
    }
  };

  validateCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, bookingAmount } = req.body;
      if (!code || !bookingAmount) {
        res
          .status(StatusCode.BAD_REQUEST)
          .json(RESPONSE_MESSAGES.COUPON.ERROR.CODE_AND_BOOKING_AMOUNT_MISSING);
      }
      const dto = CouponRequestMapper.toValidateCouponDTO(req.body);
      const result =
        await this.couponService.validateAndCalculateCouponDiscount(dto);
      res
        .status(StatusCode.OK)
        .json(CouponResponseMapper.toValidateCouponResponseDTO(result));
    } catch (error) {
      next(error);
    }
  };

  getAllCoupons = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const result = await this.couponService.getAllCoupons(page, limit);
      res.status(StatusCode.OK).json({
        coupons: CouponResponseMapper.toCouponResponseDTOList(result.coupons),
        totalCount: result.totalCount,
      });
    } catch (error) {
      next(error);
    }
  };

  getCouponById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const coupon = await this.couponService.getCouponById(id as string);
      res
        .status(StatusCode.OK)
        .json(CouponResponseMapper.toCouponResponseDTO(coupon));
    } catch (error) {
      next(error);
    }
  };

  createCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = CouponRequestMapper.toCreateCouponDTO(req.body);
      const rawCoupon = await this.couponService.createCoupon(dto);
      res.status(StatusCode.CREATED).json({
        message: RESPONSE_MESSAGES.COUPON.SUCCESS.CREATED,
        coupon: CouponResponseMapper.toCouponResponseDTO(rawCoupon),
      });
    } catch (error) {
      next(error);
    }
  };

  updateCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const dto = CouponRequestMapper.toUpdateCouponDTO(req.body);

      const rawUpdatedCoupon = await this.couponService.updateCoupon(
        id as string,
        dto,
      );
      res.status(StatusCode.OK).json({
        message: RESPONSE_MESSAGES.COUPON.SUCCESS.UPDATE,
        updatedCoupon:
          CouponResponseMapper.toCouponResponseDTO(rawUpdatedCoupon),
      });
    } catch (error) {
      next(error);
    }
  };

  toggleCouponStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const updatedCoupon = await this.couponService.toggleCouponStatus(
        id as string,
        isActive,
      );
      res.status(StatusCode.OK).json({
        message: RESPONSE_MESSAGES.COUPON.SUCCESS.TOGGLE_STATUS(isActive),
        coupon: CouponResponseMapper.toCouponResponseDTO(updatedCoupon),
      });
    } catch (error) {
      next(error);
    }
  };

  getOperatorDashboardData = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const operatorId = req.user?.id as string;
      const stats =
        await this.operatorDashboardService.getOperatorDashboardStatsService(
          operatorId,
        );
      res.status(StatusCode.OK).json(stats);
    } catch (error) {
      next(error);
    }
  };

  getOperatorBookings = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const operatorId = req.user?.id as string;
      const queryDTO = BookingRequestMapper.toGetOperatorBookingsQueryDTO(
        operatorId,
        req.query,
      );

      const rawData = await this.bookingService.getOperatorBookingsService(
        queryDTO.operatorId,
        queryDTO.status,
        queryDTO.skip,
        queryDTO.limit,
      );
      const currentPage = Math.floor(queryDTO.skip / queryDTO.limit) + 1;
      const data = BookingResponseMapper.toOperatorBookingListResponseDTO(
        rawData,
        currentPage,
        queryDTO.limit,
      );

      res.status(StatusCode.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  getOperatorBookingDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { bookingId } = req.params;
      const operatorId = req.user?.id as string;
      const rawBooking =
        await this.bookingService.getOperatorBookingDetailsService(
          bookingId as string,
          operatorId,
        );
      const booking = BookingResponseMapper.toBookingDTO(rawBooking);
      res.status(StatusCode.OK).json(booking);
    } catch (error) {
      next(error);
    }
  };

  updateGuestAttendance = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const operatorId = req.user?.id as string;
      const dto = BookingRequestMapper.toUpdateAttendanceDTO(
        operatorId,
        req.params,
        req.body,
      );

      const rawUpdatedBooking =
        await this.bookingService.updateAttendanceService(dto);
      const updatedBooking =
        BookingResponseMapper.toBookingDTO(rawUpdatedBooking);
      res.status(StatusCode.OK).json({
        message: RESPONSE_MESSAGES.BOOKING.SUCCESS.ATTENDANCE_UPDATE(
          dto.attendance,
        ),
        booking: updatedBooking,
      });
    } catch (error) {
      next(error);
    }
  };
  operatorCancelBooking = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const operatorId = req.user?.id as string;
      const dto = BookingRequestMapper.toOperatorCancelBookingDTO(
        operatorId,
        req.params,
        req.body,
      );

      if (!dto.reason || dto.reason.trim() === "") {
        throw new CustomError(
          RESPONSE_MESSAGES.BOOKING.ERROR.CANCEL_REASON_MISSING,
        );
      }
      const rawUpdatedBooking =
        await this.bookingService.operatorCancelBookingService(dto);
      const updatedBooking =
        BookingResponseMapper.toBookingDTO(rawUpdatedBooking);
      res.status(StatusCode.OK).json({
        message: RESPONSE_MESSAGES.BOOKING.SUCCESS.CANCEL_BY_OPERATOR,
        booking: updatedBooking,
      });
    } catch (error) {
      next(error);
    }
  };

  operatorRescheduleBooking = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const operatorId = req.user?.id as string;
      const dto = BookingRequestMapper.toOperatorReschuduleBookingDTO(
        operatorId,
        req.params,
        req.body,
      );
      if (!dto.startDate) {
        throw new CustomError(
          RESPONSE_MESSAGES.BOOKING.ERROR.START_DATE_MISSING,
          StatusCode.BAD_REQUEST,
        );
      }
      const updatedPackage =
        await this.bookingService.operatorRescheduleBookingService(dto);
      res.status(StatusCode.OK).json({
        message: RESPONSE_MESSAGES.BOOKING.SUCCESS.DATE_RESCHEDULED_BY_OPERATOR,
        package: updatedPackage,
      });
    } catch (error) {
      next(error);
    }
  };
  verifyCancellationRequest = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const operatorId = req.user?.id as string;
      const dto = BookingRequestMapper.toVerifyCancellationDTO(
        operatorId,
        req.params,
        req.body,
      );

      if (!["APPROVE", "REJECT"].includes(dto.action)) {
        throw new CustomError(
          RESPONSE_MESSAGES.BOOKING.ERROR.INVALID_ACTION,
          StatusCode.BAD_REQUEST,
        );
      }
      const rawUpdatedBooking =
        await this.bookingService.verifyCancellationService(dto);
      const updatedBooking =
        BookingResponseMapper.toBookingDTO(rawUpdatedBooking);
      res.status(StatusCode.OK).json({
        message:
          dto.action === "APPROVE"
            ? RESPONSE_MESSAGES.BOOKING.SUCCESS.CANCEL_REQ_APPROVED_REFUND
            : RESPONSE_MESSAGES.BOOKING.SUCCESS.CANCEL_REQ_REJECTED,
        booking: updatedBooking,
      });
    } catch (error) {
      next(error);
    }
  };
}
