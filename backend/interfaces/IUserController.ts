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
  getPackageReviews: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  createPackageReview: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  updatePackageReview: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  deletePackageReview: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  createBookingOrder: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  verifyBookingPayment: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  findBookingByOrderId: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getUserBookings: (
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
  ) => Promise<Response<any, Record<string, any>> | undefined>;
  getWallet: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  createWalletTopupOrder: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  verifyWalletTopupPayment: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}
