import { HydratedDocument } from "mongoose";


import { LoginAdminRequestDTO,  ResetAdminPasswordAuthenticatedRequestDTO,  UpdateAdminProfileImageRequestDTO, UpdateAdminRequestDTO } from "../dto-mapping/dto/admin/adminRequestDTO";
import { IAdmin, IAdminResponse } from "./IAdmin";

export interface IAdminService {
  loginAdminService(
   dto:LoginAdminRequestDTO
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    adminData: IAdminResponse;
  }>;
  updateAdminService(
    id: string,
   dto:UpdateAdminRequestDTO
  ): Promise<HydratedDocument<IAdmin> | null>;
  resetPasswordAuthenticatedService(
    adminId: string,
  dto:ResetAdminPasswordAuthenticatedRequestDTO
  ): Promise<{
    message: "Password updated successfully";
  }>;
  updateProfieImageService(id: string, dto:UpdateAdminProfileImageRequestDTO): Promise<HydratedDocument<IAdmin> | null>;
}
