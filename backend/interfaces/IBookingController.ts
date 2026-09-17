import { NextFunction, Request, Response } from "express";

export interface IBookingController {
  //admin
  getPendingCancellations: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  processCancellationRequests: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;

  //operator
  getOperatorBookings: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getOperatorBookingDetails: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  updateGuestAttendance: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  operatorRescheduleBooking: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  operatorCancelBooking: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  verifyCancellationRequest: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;

  //user
  createBookingOrder: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  verifyBookingPayment: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  findBookingByOrderId: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getUserBookings: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  cancelBooking: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}
