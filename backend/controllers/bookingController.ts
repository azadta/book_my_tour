import { inject, injectable } from "inversify";
import { IBookingController } from "../interfaces/IBookingController";
import { Types } from "../types/types";
import type { IBookingService } from "../interfaces/IBookingService";
import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../constants/statusCodeConstants";
import { BookingResponseMapper } from "../dto-mapping/mapper/booking/BookingResponseMapper";
import { BookingRequestMapper } from "../dto-mapping/mapper/booking/BookingRequestMapper";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { CustomError } from "../utils/customError";
import { sendSuccessResponse } from "../utils/apiResponse";
import {
  BookingResponseDTO,
  OperatorBookingListResponseDTO,
} from "../dto-mapping/dto/booking/bookingResponseDTO";

@injectable()
export class BookingController implements IBookingController {
  constructor(
    @inject(Types.BookingService) private _bookingService: IBookingService,
  ) {}

  getPendingCancellations = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const requests =
        await this._bookingService.getPendingCancelationRequests();

      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.BOOKING.SUCCESS.FETCH_PENDING_CANCELLATION_REQS,
        requests,
        StatusCode.OK,
      );
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
      const approve = req.body?.approve;

      const updatedBooking =
        await this._bookingService.processAdminCancellation(
          req.body,
          req.params,
        );
      const successMessage = approve
        ? RESPONSE_MESSAGES.BOOKING.SUCCESS.CANCEL_REQ_APPROVED_REFUND
        : RESPONSE_MESSAGES.BOOKING.SUCCESS.CANCEL_REQ_REJECTED;

      sendSuccessResponse(res, successMessage, updatedBooking, StatusCode.OK);
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

      const result = await this._bookingService.getOperatorBookingsService(
        operatorId,
        req.query,
      );

      sendSuccessResponse<OperatorBookingListResponseDTO>(
        res,
        RESPONSE_MESSAGES.BOOKING.SUCCESS.FETCH_OPERATOR_BOOKINGS,
        result,
        StatusCode.OK,
      );
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
      const booking =
        await this._bookingService.getOperatorBookingDetailsService(
          bookingId as string,
          operatorId,
        );

      sendSuccessResponse<BookingResponseDTO>(
        res,
        RESPONSE_MESSAGES.BOOKING.SUCCESS.FETCH_OPERATOR_BOOKING_DETAILS,
        booking,
        StatusCode.OK,
      );
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
      const { bookingId } = req.params;
      const { attendance } = req.body;

      const updatedBooking = await this._bookingService.updateAttendanceService(
        operatorId,
        bookingId as string,
        req.body,
      );

      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.BOOKING.SUCCESS.ATTENDANCE_UPDATE(attendance),
        updatedBooking,
        StatusCode.OK,
      );
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
      const { bookingId } = req.params;

      const updatedBooking =
        await this._bookingService.operatorCancelBookingService(
          bookingId as string,
          operatorId,
          req.body,
        );

      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.BOOKING.SUCCESS.CANCEL_BY_OPERATOR,
        updatedBooking,
        StatusCode.OK,
      );
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
      const { bookingId } = req.params;

      const updatedPackage =
        await this._bookingService.operatorRescheduleBookingService(
          bookingId as string,
          operatorId,
          req.body,
        );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.BOOKING.SUCCESS.DATE_RESCHEDULED_BY_OPERATOR,
        updatedPackage,
        StatusCode.OK,
      );
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
      const { bookingId } = req.params;
      const { action } = req.body;

      if (!["APPROVE", "REJECT"].includes(action)) {
        throw new CustomError(
          RESPONSE_MESSAGES.BOOKING.ERROR.INVALID_ACTION,
          StatusCode.BAD_REQUEST,
        );
      }
      const updatedBooking =
        await this._bookingService.verifyCancellationService(
          bookingId as string,
          operatorId,
          req.body,
        );
      const message =
        action === "APPROVE"
          ? RESPONSE_MESSAGES.BOOKING.SUCCESS.CANCEL_REQ_APPROVED_REFUND
          : RESPONSE_MESSAGES.BOOKING.SUCCESS.CANCEL_REQ_REJECTED;

      sendSuccessResponse<BookingResponseDTO>(
        res,
        message,
        updatedBooking,
        StatusCode.OK,
      );
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

      const result = await this._bookingService.createBookingOrder(
        userId,
        req.body,
      );

      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.BOOKING.SUCCESS.CREATE_BOOKING_ORDER,
        result,
        StatusCode.CREATED,
      );
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

      const result = await this._bookingService.verifyAndConfirmBooking(
        userId,
        req.body,
      );

      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.BOOKING.SUCCESS.CONFIRM,
        result,
        StatusCode.OK,
      );
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
      const booking = await this._bookingService.findBookingByOrderId(
        orderId as string,
      );

      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.BOOKING.SUCCESS.FETCH_BOOKING,
        booking,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };
  getUserBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const { bookings, totalCount } =
        await this._bookingService.getUserBookings(
          userId as string,
          page,
          limit,
        );

      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.BOOKING.SUCCESS.FETCH_BOOKINGS,
        { bookings, totalCount },
        StatusCode.OK,
      );
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

      const response = await this._bookingService.cancelBooking(
        userId,
        bookingId as string,
        req.body,
      );
      const data = {
        requiresAdminApproval: response.requiresAdminApproval,
        refundAmount: response.refundAmount,
        booking: response.booking,
      };
      const message = response.message;

      sendSuccessResponse(res, message, data, StatusCode.OK);
    } catch (error) {
      next(error);
    }
  };
}
