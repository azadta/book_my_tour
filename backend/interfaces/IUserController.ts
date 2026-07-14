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
  updateUser: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  deleteUser: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  updateProfileImage: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getAllPackageCategories: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  resetPasswordAuthenticated: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getPaginatedPackages: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;

  getAllDestinations: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getAllPackages: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getFilteredPackages: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getActiveCategories: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getPackageById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getDestinationsByPackageCategory: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getPackagesByCategory: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}
