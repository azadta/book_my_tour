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
}
