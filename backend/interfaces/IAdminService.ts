import { HydratedDocument } from "mongoose";
import { IDestination } from "../models/Destination";

import { Ipackage } from "../models/Package";
import { IPackageCategory } from "../models/PackageCategory";

import { IAdmin, IAdminResponse } from "./IAdmin";
import { IOperator } from "./IOperator";
import { IUser } from "./IUser";
import { IBooking } from "./IBookingRepository";

export interface IAdminService {
  loginAdminService(
    email: string,
    password: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    adminData: IAdminResponse;
  }>;
  updateAdminService(
    id: string,
    data: Partial<IAdmin>,
  ): Promise<HydratedDocument<IAdmin> | null>;
  resetPasswordAuthenticatedService(
    adminId: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<{
    message: "Password updated successfully";
  }>;
  updateProfieImageService(id: string, image: string): Promise<HydratedDocument<IAdmin> | null>;
}
