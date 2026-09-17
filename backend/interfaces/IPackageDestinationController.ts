import { NextFunction, Request, Response } from "express";

export interface IPackageDestinationController {
  //admin
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

  //user

  getDestinationsByPackageCategory: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}
