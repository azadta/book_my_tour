import type { IAdminRepository } from "../interfaces/IAdminRepository";
import { CustomError } from "../utils/customError";

import { inject, injectable } from "inversify";
import { StatusCode } from "../constants/statusCodeConstants";
import type { IAdminService } from "../interfaces/IAdminService";
import type { IHashService } from "../interfaces/IHashService";
import type { ISecurityService } from "../interfaces/ISecurityService";

import { IAdmin, IAdminResponse } from "../interfaces/IAdmin";
import { Types } from "../types/types";

import { HydratedDocument } from "mongoose";
import { RESPONSE_MESSAGES } from "../constants/messages";
import {
  LoginAdminRequestDTO,
  ResetAdminPasswordAuthenticatedRequestDTO,
  UpdateAdminProfileImageRequestDTO,
  UpdateAdminRequestDTO,
} from "../dto-mapping/dto/admin/adminRequestDTO";

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject(Types.AdminRepository) private _adminRepository: IAdminRepository,

    @inject(Types.BcryptHashService)
    private _hashService: IHashService,
    @inject(Types.SecurityService) private _securityService: ISecurityService,
  ) {}

  async loginAdminService(dto: LoginAdminRequestDTO): Promise<{
    accessToken: string;
    refreshToken: string;
    adminData: IAdminResponse;
  }> {
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
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...adminData } = admin.toObject();
    return { accessToken, refreshToken, adminData };
  }
  async resetPasswordAuthenticatedService(
    adminId: string,

    dto: ResetAdminPasswordAuthenticatedRequestDTO,
  ) {
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
    return { message: RESPONSE_MESSAGES.AUTH.SUCCESS.PASSWORD_UPDATE };
  }

  async updateAdminService(
    id: string,
    dto: UpdateAdminRequestDTO,
  ): Promise<HydratedDocument<IAdmin> | null> {
    if (dto.password) {
      dto.password = this._hashService.hash(dto.password);
    }
    return await this._adminRepository.updateById(id, dto);
  }

  async updateProfieImageService(
    id: string,
    dto: UpdateAdminProfileImageRequestDTO,
  ): Promise<HydratedDocument<IAdmin> | null> {
    const { image } = dto;
    return this._adminRepository.updateProfieImage(id, image);
  }
}
