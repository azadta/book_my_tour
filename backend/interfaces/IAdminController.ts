import { NextFunction, Request, Response } from "express";

export interface IAdminController {
  loginAdmin: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  logoutAdmin: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  updateAdmin: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  updateAdminProfileImage: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getOperatorVerificationRequests: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  verifyOperator: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getPaginatedOperators: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getSingleOperator: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  updateOperator: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  blockOperator: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  deleteOperator: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getPaginatedUsers: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getSingleUser: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  updateUser: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  blockUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  deleteUser: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  createPackageCategory: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getAllPackageCategory: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  createDestination: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getAllDestinations: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getDestinationById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  deleteDestination: (
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
  getTotalUsersCount: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getTotalOperatorsCount: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  todaySignupCount: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getPendingOperatorsCount: (
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
  getPackageById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
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
}
