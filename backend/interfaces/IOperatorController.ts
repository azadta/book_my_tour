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

  resetPasswordAuthenticated: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;

  //admin
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
  getOperatorDetails: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  AdminUpdateOperator: (
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
}
