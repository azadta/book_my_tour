
import {
  ResetAdminPasswordAuthenticatedRequestDTO
} from "../dto-mapping/dto/admin/adminRequestDTO";
import { AdminResponseDTO } from "../dto-mapping/dto/admin/adminResponseDTO";

export interface IAdminService {
  loginAdminService(body: unknown): Promise<{
    accessToken: string;
    refreshToken: string;
    adminData: AdminResponseDTO;
  }>;
  updateAdminService(id: string, body: unknown): Promise<AdminResponseDTO>;

  resetPasswordAuthenticatedService(
    adminId: string,
    dto: ResetAdminPasswordAuthenticatedRequestDTO,
  ): Promise<void>;
  updateProfieImageService(
    id: string,
    body: unknown,
  ): Promise<AdminResponseDTO>;
}
