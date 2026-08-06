import { ICouponDocument } from "../models/Coupon";
import { IDestination } from "../models/Destination";
import { Ipackage } from "../models/Package";
import { IPackageCategory } from "../models/PackageCategory";
import { IBooking } from "./IBookingRepository";

import { CreateReviewDto, IReview } from "./IReview";
import { IUser, IUserResponse } from "./IUser";
import { ICreateWishlistDTO, IWishlistGroup } from "./IWishList";

export interface IUserService {
  registerUser(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ userId: string; otpExpire: number | undefined }>;
  verifyUserOtp(data: { userId: string; otp: string }): Promise<void>;
  resendUserOtp(userId: string): Promise<{ otpExpire: number }>;
  loginUser(
    email: string,
    password: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    userData: IUserResponse;
  }>;
  googleLogin(
    name: string,
    email: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: IUserResponse;
  }>;
  forgotPasswordService(email: string): Promise<{ message: string }>;
  resetPasswordService(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }>;
  updateUserService(id: string, data: Partial<IUser>): Promise<IUser | null>;
  deleteUserService(id: string): Promise<IUser | null>;
  updateProfileImageService(id: string, image: string): Promise<IUser | null>;
  userLogoutService(): { message: string };
  resetPasswordAuthenticatedService(
    userId: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<{ message: string }>;
  getAllCategories(): Promise<IPackageCategory[]>;
  getPaginatedPackagesService(skip: number, limit: number): Promise<Ipackage[]>;
  getTotalPackagesCount(): Promise<number>;
  getAllPackagesService(): Promise<Ipackage[]>;
  getFilteredPackagesService(query: any): Promise<{
    packages: Ipackage[];
    totalCount: number;
    uniqueCategoryCount: number;
  }>;
  getActiveCategoryService(): Promise<IPackageCategory[]>;
  getPackageByIdService(id: string): Promise<Ipackage | null>;
  getDestinationsByPackageCategoryService(categoryName: string): Promise<any[]>;

  getPackagesByCategoryService(categoryName: string): Promise<Ipackage[]>;
  getUserWishlists(userId: string): Promise<IWishlistGroup[]>;
  createGroup(userId: string, dto: ICreateWishlistDTO): Promise<IWishlistGroup>;
  togglePackageInGroup(
    userId: string,
    groupId: string,
    packageId: string,
  ): Promise<IWishlistGroup>;
  addNoteToGroup(
    userId: string,
    groupId: string,
    text: string,
  ): Promise<IWishlistGroup>;
  generateShareableLink(
    userId: string,
    groupId: string,
  ): Promise<{
    shareToken: string;
  }>;
  getSharedGroup(shareToken: string): Promise<IWishlistGroup>;
  editGroup(
    userId: string,
    groupId: string,
    dto: {
      title?: string;
      description?: string;
    },
  ): Promise<IWishlistGroup>;
  deleteGroup(userId: string, groupId: string): Promise<IWishlistGroup | null>;
  deleteNote(
    userId: string,
    groupId: string,
    noteId: string,
  ): Promise<IWishlistGroup>;
  editNote(
    userId: string,
    groupId: string,
    noteId: string,
    text: string,
  ): Promise<IWishlistGroup>;
  getPackageReviewService(
    packageId: string,
    page?: number,
    limit?: number,
  ): Promise<{
    reviews: IReview[];
    stats: any;
  }>;
  createPackageReviewService(reviewData: CreateReviewDto): Promise<IReview>;
  updatePackageReviewService(
    userId: string,
    reviewId: string,
    packageId: string,
    updatePayload: any,
  ): Promise<{
    review: IReview | null;
    stats: any;
  }>;
  deletePackageReviewService(
    userId: string,
    reviewId: string,
    packageId: string,
  ): Promise<{
    stats: any;
  }>;
  createBookingOrder(
    userId: string,
    dto: {
      packageId: string;
      addedActivityIds: string[];
      removedActivityIds: string[];
      generalCouponCode: string;
      bankCouponCode: string;
    },
  ): Promise<
    | {
        orderId: string;
        amount: number;
        currency: string;
        keyId: string | undefined;
        packageName: string;
        packageDescription: string;
      }
    | undefined
  >;
  verifyAndConfirmBooking(dto: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    packageId: string;
    userId: string;
  }): Promise<{
    message: "Booking confirmed successfully";
    booking: IBooking;
  }>;
  findBookingByOrderId(razorpayOrderId: string): Promise<IBooking>;
  getUserBookings(userId: string): Promise<IBooking[]>;
  getAllAvailableCoupons(): Promise<{
    bankOffers: ICouponDocument[];
    generalCoupons: ICouponDocument[];
  }>;
  validateAndCalculateDiscount(
    code: string,
    bookingAmount: number,
    cardBin?: string | undefined,
  ): Promise<{
    discountAmount: number;
    finalPrice: number;
    coupon: ICouponDocument;
  }>;
}
