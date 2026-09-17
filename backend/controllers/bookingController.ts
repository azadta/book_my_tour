import { inject, injectable } from "inversify";
import { IBookingController } from "../interfaces/IBookingController";
import { Types } from "../types/types";
import type{ IBookingService } from "../interfaces/IBookingService";
import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../constants/statusCodeConstants";
import { BookingResponseMapper } from "../dto-mapping/mapper/booking/BookingResponseMapper";
import { BookingRequestMapper } from "../dto-mapping/mapper/booking/BookingRequestMapper";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { CustomError } from "../utils/customError";

@injectable()
export class BookingController implements IBookingController {
  constructor(@inject(Types.BookingService) private bookingService:IBookingService){

  }
  //admin
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

  //operator
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

  //user
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

      res.status(StatusCode.OK).json(booking);
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
      res.status(StatusCode.OK).json(bookings);
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
        bookingId as string,
        req.body,
      );

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
}
