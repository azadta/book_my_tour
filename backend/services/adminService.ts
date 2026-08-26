import type { IAdminRepository } from "../interfaces/IAdminRepository";
import { CustomError } from "../utils/customError";

import { inject, injectable } from "inversify";
import { StatusCode } from "../constants/statusCodeConstants";
import type { IAdminService } from "../interfaces/IAdminService";
import type { IDestinationRepository } from "../interfaces/IDestinationRepository";
import type { IHashService } from "../interfaces/IHashService";
import type { IMailService } from "../interfaces/IMailService";
import type { IOperatorRepository } from "../interfaces/IOperatorRepository";
import type { IPackageCategoryRepository } from "../interfaces/IPackageCategoryRepository";
import type { IPackageRepository } from "../interfaces/IPackageRepository";
import type { ISecurityService } from "../interfaces/ISecurityService";
import type { IUserRepository } from "../interfaces/IUserRepository";

import { IAdmin, IAdminResponse } from "../interfaces/IAdmin";
import { Types } from "../types/types";

import { HydratedDocument } from "mongoose";
import { RESPONSE_MESSAGES } from "../constants/messages";
import type {
  IBookingRepository
} from "../interfaces/IBookingRepository";
import type { IWalletRepository } from "../interfaces/IWalletRepository";

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject(Types.AdminRepository) private adminRepository: IAdminRepository,
    @inject(Types.OperatorRepository)
    private operatorRepository: IOperatorRepository,
    @inject(Types.UserRepository) private userRepository: IUserRepository,
    @inject(Types.PackageCategoryRepository)
    private packageCategoryRepository: IPackageCategoryRepository,
    @inject(Types.PackageRepository)
    private packageRepository: IPackageRepository,
    @inject(Types.DestinationRepository)
    private destinationRepository: IDestinationRepository,
    @inject(Types.BookingRepository)
    private bookingRepository: IBookingRepository,
    @inject(Types.WalletRepository)
    private walletRepository: IWalletRepository,

    @inject(Types.MailService) private mailService: IMailService,
    @inject(Types.BcryptHashService) private hashService: IHashService,
    @inject(Types.SecurityService) private securityService: ISecurityService,
  ) {}

     async loginAdminService(
      email: string,
      password: string,
    ): Promise<{
      accessToken: string;
      refreshToken: string;
      adminData: IAdminResponse;
    }> {
      const admin = await this.adminRepository.findByEmail(email);
      if (!admin)
        throw new CustomError(
          RESPONSE_MESSAGES.ADMIN.ERROR.NOT_FOUND,
          StatusCode.NOT_FOUND,
        );
      const isPasswordValid = this.hashService.compare(password, admin.password);
      if (!isPasswordValid)
        throw new CustomError(
          RESPONSE_MESSAGES.AUTH.ERROR.INVALID_CREDENTIALS,
          StatusCode.UNAUTHORIZED,
        );
      const accessToken = this.securityService.generateAccessToken({
        id: admin._id.toString(),
        role: admin.role,
      });
      const refreshToken = this.securityService.generateRefreshToken({
        id: admin._id.toString(),
        role: admin.role,
      });
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: pass, ...adminData } = admin.toObject();
      return { accessToken, refreshToken, adminData };
    }
    async resetPasswordAuthenticatedService(
        adminId: string,
        oldPassword: string,
        newPassword: string,
        confirmPassword: string,
      ) {
        const admin = await this.adminRepository.findById(adminId);
        if (!admin)
          throw new CustomError(
            RESPONSE_MESSAGES.ADMIN.ERROR.NOT_FOUND,
            StatusCode.NOT_FOUND,
          );
        const isMatch = this.hashService.compare(oldPassword, admin.password);
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
        admin.password = this.hashService.hash(newPassword);
        await this.adminRepository.save(admin);
        return { message: RESPONSE_MESSAGES.AUTH.SUCCESS.PASSWORD_UPDATE };
      }

  async updateAdminService(
    id: string,
    data: Partial<IAdmin>,
  ): Promise<HydratedDocument<IAdmin> | null> {
    if (data.password) {
      data.password = this.hashService.hash(data.password);
    }
    return await this.adminRepository.updateById(id, data);
  }

  async updateProfieImageService(
    id: string,
    image: string,
  ): Promise<HydratedDocument<IAdmin> | null> {
    return this.adminRepository.updateProfieImage(id, image);
  }
}
