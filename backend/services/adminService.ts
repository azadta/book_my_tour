import type { IAdminRepository } from "../interfaces/IAdminRepository";
import { CustomError } from "../utils/customError";

import { inject, injectable } from "inversify";
import { StatusCode } from "../constants/statusCodeConstants";
import type { IAdminService } from "../interfaces/IAdminService";
import type { IHashService } from "../interfaces/IHashService";
import type { ISecurityService } from "../interfaces/ISecurityService";

import { Types } from "../types/types";

import { RESPONSE_MESSAGES } from "../constants/messages";
import { AdminResponseDTO } from "../dto-mapping/dto/admin/adminResponseDTO";
import { AdminRequestMapper } from "../dto-mapping/mapper/admin/AdminRequestMapper";
import { AdminResponseMapper } from "../dto-mapping/mapper/admin/AdminResponseMapper";
import {
  LoginAdminBody,
  ResetAdminPasswordAuthenticatedBody,
  UpdateAdminBody,
  UpdateAdminProfileImageBody,
} from "../dto-mapping/dto/admin/adminRequestDTO";

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject(Types.AdminRepository) private _adminRepository: IAdminRepository,

    @inject(Types.BcryptHashService)
    private _hashService: IHashService,
    @inject(Types.SecurityService) private _securityService: ISecurityService,
  ) {}

  async loginAdminService(body: LoginAdminBody): Promise<{
    accessToken: string;
    refreshToken: string;
    adminData: AdminResponseDTO;
  }> {
    const dto = AdminRequestMapper.toLoginRequestDTO(body);
    const { email, password } = dto;
    const admin = await this._adminRepository.findByEmail(email);
    if (!admin)
      throw new CustomError(
        RESPONSE_MESSAGES.ADMIN.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    const isPasswordValid = this._hashService.compare(password, admin.password);
    if (!isPasswordValid)
      throw new CustomError(
        RESPONSE_MESSAGES.AUTH.ERROR.INVALID_CREDENTIALS,
        StatusCode.UNAUTHORIZED,
      );
    const accessToken = this._securityService.generateAccessToken({
      id: admin._id.toString(),
      role: admin.role,
    });
    const refreshToken = this._securityService.generateRefreshToken({
      id: admin._id.toString(),
      role: admin.role,
    });
    const adminData = AdminResponseMapper.toAdminResponseDTO(admin);
    return { accessToken, refreshToken, adminData };
  }
  async resetPasswordAuthenticatedService(
    adminId: string,

    body: ResetAdminPasswordAuthenticatedBody,
  ) {
    const dto = AdminRequestMapper.toResetPasswordAuthenticatedRequestDTO(body);
    const { confirmPassword, newPassword, oldPassword } = dto;
    const admin = await this._adminRepository.findById(adminId);
    if (!admin)
      throw new CustomError(
        RESPONSE_MESSAGES.ADMIN.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    const isMatch = this._hashService.compare(oldPassword, admin.password);
    if (!isMatch)
      throw new CustomError(
        RESPONSE_MESSAGES.AUTH.ERROR.OLD_PASSWORD_INCORRECT,
        StatusCode.BAD_REQUEST,
      );
    if (confirmPassword !== newPassword)
      throw new CustomError(
        RESPONSE_MESSAGES.AUTH.ERROR.PASSWORD_MISMATCH,
        StatusCode.BAD_REQUEST,
      );
    admin.password = this._hashService.hash(newPassword);
    await this._adminRepository.save(admin);
  }

  async updateAdminService(id: string, body: UpdateAdminBody) {
    const dto = AdminRequestMapper.toUpdateAdminRequestDTO(body);
    if (dto.password) {
      dto.password = this._hashService.hash(dto.password);
    }
    const updatedAdmin = await this._adminRepository.updateById(id, dto);
    if (!updatedAdmin) {
      throw new CustomError(
        RESPONSE_MESSAGES.ADMIN.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }

    return AdminResponseMapper.toAdminResponseDTO(updatedAdmin);
  }

  async updateProfieImageService(
    id: string,
    body: UpdateAdminProfileImageBody,
  ) {
    const dto = AdminRequestMapper.toUpdateProfileImageRequestDTO(body);
    const { image } = dto;
    const updatedAdmin = this._adminRepository.updateProfieImage(id, image);
    return AdminResponseMapper.toAdminResponseDTO(updatedAdmin);
  }
}
