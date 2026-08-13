import { NextFunction, Request, Response } from "express";

export interface IOperatorController {
  operatorRegister: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  operatorOtpverification: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  operatorResendOtp: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  loginOperator: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  forgotOperatorPassword: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  resetOperatorPassword: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  operatorLogout: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  updateOperator: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  updateOperatorProfileImage: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  createPackage: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getAllDestinations: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getAllPackageCategory: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getAllPackages: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  resetPasswordAuthenticated: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getMyPackagesCount: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getPaginatedPackages: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  deletePackage: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  updatePackage: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getPackageByIdAndOperator: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getCoupons: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  validateCoupon: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getAllCoupons: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getCouponById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  createCoupon: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  updateCoupon: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  toggleCouponStatus: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getOperatorDashboardData: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
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
}
