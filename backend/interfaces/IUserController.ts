import { NextFunction, Request, Response } from "express";

export interface IUserController {
  register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  verifyOtp: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  resendOtp: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  google: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  forgotPassword: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  resetPassword: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  logout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  adminUpdateUser: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  adminDeleteUser: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  updateProfileImage: (
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
  getPaginatedUsers: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getUserDetails: (
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
}
