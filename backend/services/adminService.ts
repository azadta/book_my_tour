import type { IAdminRepository } from "../interfaces/IAdminRepository";
import type { IDestination } from "../models/Destination";
import type { IPackageCategory } from "../models/PackageCategory";
import { CustomError } from "../utils/customError";

import type { IAdminService } from "../interfaces/IAdminService";
import type { IHashService } from "../interfaces/IHashService";
import type { IMailService } from "../interfaces/IMailService";
import type { ISecurityService } from "../interfaces/ISecurityService";
import type { ITokenService } from "../interfaces/ITokenService";
import type { IAdmin } from "../models/Admin";
import type { Ipackage } from "../models/Package";
import { StatusCode } from "../constants/statusCodeConstants";
import { inject, injectable } from "inversify";
import { Types } from "../types/types";

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject(Types.AdminRepository) private adminRepository: IAdminRepository,
    @inject(Types.MailService) private mailService: IMailService,
    @inject(Types.BcryptHashService) private hashService: IHashService,
    @inject(Types.SecurityService) private securityService: ISecurityService,
    @inject(Types.TokenService) private tokenService: ITokenService,
  ) {}

  async loginAdminService(email: string, password: string) {
    const admin = await this.adminRepository.findByEmail(email);
    if (!admin) throw new CustomError("Admin not found", StatusCode.NOT_FOUND);
    const isPasswordValid = this.hashService.compare(password, admin.password);
    if (!isPasswordValid)
      throw new CustomError("Invalid credentials", StatusCode.UNAUTHORIZED);
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

  async updateAdminService(id: string, data: Partial<IAdmin>) {
    if (data.password) {
      data.password = this.hashService.hash(data.password);
    }
    return await this.adminRepository.updateById(id, data);
  }

  async getOperatorVerificationRequestsService() {
    return await this.adminRepository.getPendingOperator();
  }

  async verifyOperatorService(id: string, isVerified: boolean) {
    const updated = await this.adminRepository.updateOperatorStatus(
      id,
      isVerified,
    );
    if (!updated)
      throw new CustomError("Operator not found", StatusCode.NOT_FOUND);
    const subject = "Verification Request update";

    const message = isVerified
      ? `Hi ${updated.name},<br><br>your operator account has been  <b>verified</b>.You can now access your dashboard and manage packages`
      : `Hi ${updated.name},<br><br>your verification request has been  <b>rejected</b>.Please contact support for clarification`;
    await this.mailService.sendEmail(updated.email, subject, message);
    if (!isVerified) {
      await this.adminRepository.deleteOperatorById(id);
    }

    return { message: `Operator ${isVerified ? "verified" : "rejected"}` };
  }

  async getPaginatedOperatorsService(skip: number, limit: number) {
    return this.adminRepository.getPaginatedOperators(skip, limit);
  }

  getTotalOperatorsCount() {
    return this.adminRepository.countAllOperators();
  }

  async getSingleOperatorService(id: string) {
    return this.adminRepository.findOperatorById(id);
  }

  async blockOperatorService(id: string, isBlocked: boolean) {
    return this.adminRepository.updateOperatorBlockStatus(id, isBlocked);
  }

  async deleteOperatorService(id: string) {
    return this.adminRepository.deleteOperatorById(id);
  }

  async getPaginatedUsersService(skip: number, limit: number) {
    return this.adminRepository.getPaginatedUsers(skip, limit);
  }

  getTotalUsersCount() {
    return this.adminRepository.countAllUsers();
  }

  async getSingleUserService(id: string) {
    return this.adminRepository.findUserById(id);
  }

  async blockUserService(id: string, isBlocked: boolean) {
    return this.adminRepository.updateUserBlockStatus(id, isBlocked);
  }

  async createCategoryService(
    data: Partial<IPackageCategory>,
  ): Promise<IPackageCategory> {
    if (!data.name)
      throw new CustomError(
        "Category name is required",
        StatusCode.BAD_REQUEST,
      );
    const existing = await this.adminRepository.findPackageCategoryByName(
      data.name,
    );
    if (existing)
      throw new CustomError("Category already exists", StatusCode.BAD_REQUEST);
    return this.adminRepository.createPackgeCategory(data);
  }

  getAllCategories() {
    return this.adminRepository.findAllPackageCategory();
  }

  async createDestinationService(
    data: Partial<IDestination> & { latitude?: number; longitude?: number },
  ): Promise<IDestination> {
    if (!data.name)
      throw new CustomError(
        "Destination name is required",
        StatusCode.BAD_REQUEST,
      );
    if (data.latitude === null || data.longitude === null)
      throw new CustomError(
        "Latitude and longitude are required",
        StatusCode.BAD_REQUEST,
      );
    const existing = await this.adminRepository.findDestinationByName(
      data.name,
    );
    if (existing)
      throw new CustomError(
        "Destination with same name already exists",
        StatusCode.BAD_REQUEST,
      );

    return this.adminRepository.createDestination({
      name: data.name.trim(),
      location: { latitude: data.latitude, longitude: data.longitude },
      images: Array.isArray(data.images) ? data.images : [],
    } as Partial<IDestination>);
  }

  getAllDestinationsServise(): Promise<IDestination[]> {
    return this.adminRepository.findAllDestinations();
  }

  async getDestinationByIdService(id: string): Promise<IDestination> {
    const destination = await this.adminRepository.findDestinationById(id);
    if (!destination) {
      throw new CustomError("Destination not found", StatusCode.NOT_FOUND);
    }
    return destination;
  }

  async deleteDestinationByIdService(id: string): Promise<void> {
    const deleted = await this.adminRepository.deleteDestinationById(id);
    if (!deleted)
      throw new CustomError("Destination not found", StatusCode.NOT_FOUND);
  }

  async resetPasswordAuthenticatedService(
    adminId: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    const admin = await this.adminRepository.findById(adminId);
    if (!admin) throw new CustomError("Admin not found", StatusCode.NOT_FOUND);
    const isMatch = await this.hashService.compare(oldPassword, admin.password);
    if (!isMatch)
      throw new CustomError(
        "Old password is incorrect",
        StatusCode.BAD_REQUEST,
      );
    if (confirmPassword !== newPassword)
      throw new CustomError("Password do not match", StatusCode.BAD_REQUEST);
    admin.password = this.hashService.hash(newPassword);
    await this.adminRepository.save(admin);
    return { message: "Password updated successfully" };
  }

  async deleteUserService(id: string) {
    return await this.adminRepository.deleteUserById(id);
  }
  async updateUserService(id: string, data: any) {
    if (data.password) {
      data.password = this.hashService.hash(data.password);
    }

    return await this.adminRepository.updateUserById(id, data);
  }

  async getPaginatedPackagesService(
    skip: number,
    limit: number,
  ): Promise<Ipackage[]> {
    return this.adminRepository.findAllPackages(skip, limit);
  }

  getTotalPackagesCount() {
    return this.adminRepository.countAllPackages();
  }

  async updateOperatorService(id: string, data: any) {
    if (data.password) {
      data.password = this.hashService.hash(data.password);
    }

    return await this.adminRepository.updateOperatorById(id, data);
  }

  async updateProfieImageService(
    id: string,
    image: string,
  ): Promise<IAdmin | null> {
    return this.adminRepository.updateProfieImage(id, image);
  }

  async getSignupCountTodayService() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    return this.adminRepository.getSignupCountToday(startOfDay, endOfDay);
  }

  async getPendingOperatorsCountService() {
    return await this.adminRepository.getPendingOperatorsCount();
  }
}
