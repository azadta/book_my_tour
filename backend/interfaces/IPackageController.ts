import { NextFunction, Request, Response } from "express";

export interface IPackageController {
  //operator
  createPackage: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;

  getMyPackagesCount: (
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

  //user
  getPaginatedPackages: (
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
  getPackageById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getPackagesByCategory: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getAdminAllPackages: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  adminDeletePackage: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getOperatorPaginatedPackages: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}
