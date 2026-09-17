import { NextFunction, Request, Response } from "express";

export interface IWishlistController {
  //user
  getWishlists: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  createWhishlistGroup: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;

  toggleWhishlistPackage: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  addWishlistNote: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getWishlistShareLink: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getSharedWishlist: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  editWishlistGroup: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  deleteWishlistGroup: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  editWishlistNote: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  deleteWishlistNote: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}
