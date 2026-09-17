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

  resetPasswordAuthenticated: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}
