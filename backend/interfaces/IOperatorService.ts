import { QueryFilter } from "mongoose";
import { IDestination } from "../models/Destination";

import { Ipackage } from "../models/Package";
import { IPackageCategory } from "../models/PackageCategory";
import { IOperator, IOperatorResponse } from "./IOperator";
import { ICouponDocument } from "../models/Coupon";

export interface IOperatorService {
  operatorRegisterService(data: Partial<IOperator>): Promise<{
    operatorId: string;
    otpExpire: number | undefined;
  }>;
  operatorVerifyOtpService(operatorId: string, otp: string): Promise<void>;
  operatorResendOtpService(operatorId: string): Promise<{
    otpExpire: number;
  }>;
  operatorLoginService(
    email: string,
    password: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    operatorData: IOperatorResponse;
  }>;
  operatorForgotPasswordService(email: string): Promise<{
    message: string;
  }>;
  operatorResetPasswordService(
    token: string,
    newPassword: string,
  ): Promise<{
    message: string;
  }>;
  updateOperatorService(
    id: string,
    data: Partial<IOperator>,
  ): Promise<IOperator | null>;
  updateOperatorProfileImageService(
    id: string,
    image: string,
  ): Promise<IOperator | null>;
  operatorLogoutService(): {
    message: string;
  };
  createPackageService(data: Partial<Ipackage>): Promise<Ipackage>;
  getSinglePackageService(id: string): Promise<Ipackage | null>;
  updatePackageService(
    packageId: string,
    operatorId: string,
    data: Partial<Ipackage>,
  ): Promise<Ipackage | null>;
  deletePackageService(
    operatorId: string,
    packageId: string,
  ): Promise<Ipackage | null>;
  getPaginatedPackagesService(
    id: QueryFilter<Ipackage>,
    skip: number,
    limit: number,
  ): Promise<Ipackage[]>;
  getTotalPackagesCount(): Promise<number>;
  resetPasswordAuthenticatedService(
    operatorId: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<{
    message: string;
  }>;
  getAllCategories(): Promise<IPackageCategory[]>;
  getAllDestinationsServise(): Promise<IDestination[]>;
  getMyPackagesCountService(operatorId: string): Promise<number>;
  getPackageByIdAndOperatorService(
    packageId: string,
    operatorId: string,
  ): Promise<Ipackage>;
  getAllCoupons(
    page: number,
    limit: number,
  ): Promise<{
    coupons: ICouponDocument[];
    totalCount: number;
  }>;
  getCouponById(id: string): Promise<ICouponDocument>;
  createCoupon(couponData: Partial<ICouponDocument>): Promise<ICouponDocument>;
  updateCoupon(
    id: string,
    couponData: Partial<ICouponDocument>,
  ): Promise<ICouponDocument | null>;
  toggleCouponStatus(
    id: string,
    isActive: boolean,
  ): Promise<ICouponDocument | null>;
  getAllAvailableCoupons(): Promise<{
    bankOffers: ICouponDocument[];
    generalCoupons: ICouponDocument[];
  }>;
  validateAndCalculateDiscount(code: string, bookingAmount: number, cardBin?: string | undefined): Promise<{
    discountAmount: number;
    finalPrice: number;
    coupon: ICouponDocument;
}>
}
